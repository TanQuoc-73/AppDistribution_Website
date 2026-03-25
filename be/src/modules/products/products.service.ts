import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';
import { PaginatedResult } from '../../common/types/pagination';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20, search, categoryId, developerId, isFree, minPrice, maxPrice, sort, tag } = query;
    const skip = (page - 1) * limit;

    const where: any = { is_active: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categories = { some: { categoryId } };
    if (developerId) where.developerId = developerId;
    if (isFree !== undefined) where.isFree = isFree;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (tag) where.tags = { some: { tag: { slug: tag } } };

    const orderBy = this.buildOrderBy(sort);

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          developer: { select: { id: true, name: true } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          _count: { select: { reviews: true, library: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const mapped = data.map((p) => ({
      ...p,
      reviewCount: p._count?.reviews ?? 0,
      totalDownloads: p._count?.library ?? 0,
      averageRating: '0',
      _count: undefined,
    }));

    return { data: mapped, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        developer: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        platforms: true,
        media: { orderBy: { sortOrder: 'asc' } },
        versions: { where: { isLatest: true }, take: 1 },
        _count: { select: { reviews: true, library: true } },
      },
    });
    if (!product) throw new NotFoundException(`Product "${slug}" not found`);

    const avgResult = await this.prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
    });

    return {
      ...product,
      reviewCount: product._count?.reviews ?? 0,
      totalDownloads: product._count?.library ?? 0,
      averageRating: (avgResult._avg?.rating ?? 0).toFixed(1),
      _count: undefined,
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(developerId: string, dto: CreateProductDto) {
    const { categoryIds, tagIds, downloadUrl, versionString, fileSize, ...data } = dto;
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...data,
          developerId,
          slug: this.toSlug(data.name),
          categories: categoryIds
            ? { create: categoryIds.map((id) => ({ categoryId: id })) }
            : undefined,
          tags: tagIds
            ? { create: tagIds.map((id) => ({ tagId: id })) }
            : undefined,
        },
      });

      // Auto-create initial version if download info provided
      if (downloadUrl || versionString) {
        await tx.productVersion.create({
          data: {
            productId: product.id,
            version: versionString || '1.0.0',
            downloadUrl: downloadUrl || null,
            fileSize: fileSize ?? null,
            isLatest: true,
          },
        });
      }

      return product;
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);
    const { categoryIds, tagIds, downloadUrl, versionString, fileSize, ...data } = dto;
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.update({ where: { id }, data });
      if (categoryIds !== undefined) {
        await tx.productCategory.deleteMany({ where: { productId: id } });
        if (categoryIds.length > 0) {
          await tx.productCategory.createMany({
            data: categoryIds.map((categoryId) => ({ productId: id, categoryId })),
          });
        }
      }
      if (tagIds !== undefined) {
        await tx.productTag.deleteMany({ where: { productId: id } });
        if (tagIds.length > 0) {
          await tx.productTag.createMany({
            data: tagIds.map((tagId) => ({ productId: id, tagId })),
          });
        }
      }

      // Inline version update: update latest version or create new one
      if (downloadUrl !== undefined || versionString !== undefined || fileSize !== undefined) {
        const latestVersion = await tx.productVersion.findFirst({
          where: { productId: id, isLatest: true },
        });
        if (latestVersion) {
          await tx.productVersion.update({
            where: { id: latestVersion.id },
            data: {
              ...(downloadUrl !== undefined && { downloadUrl }),
              ...(versionString !== undefined && { version: versionString }),
              ...(fileSize !== undefined && { fileSize }),
            },
          });
        } else {
          await tx.productVersion.create({
            data: {
              productId: id,
              version: versionString || '1.0.0',
              downloadUrl: downloadUrl || null,
              fileSize: fileSize ?? null,
              isLatest: true,
            },
          });
        }
      }

      return product;
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.product.delete({ where: { id } });
  }

  // ─── Version management ─────────────────────────────────────────────────────

  async getVersions(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.productVersion.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVersionsBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug }, select: { id: true } });
    if (!product) throw new NotFoundException('Product not found');
    return this.getVersions(product.id);
  }

  async createVersion(productId: string, userId: string, dto: CreateVersionDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { developer: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.developer?.user_id !== userId) {
      // Check if admin
      const profile = await this.prisma.profile.findUnique({ where: { id: userId }, select: { role: true } });
      if (profile?.role !== 'admin') throw new ForbiddenException('You do not own this product');
    }
    // Check duplicate version string
    const existing = await this.prisma.productVersion.findUnique({
      where: { productId_version: { productId, version: dto.version } },
    });
    if (existing) throw new BadRequestException(`Version ${dto.version} already exists`);

    return this.prisma.$transaction(async (tx) => {
      if (dto.isLatest) {
        await tx.productVersion.updateMany({ where: { productId }, data: { isLatest: false } });
      }
      return tx.productVersion.create({ data: { productId, ...dto } });
    });
  }

  async updateVersion(productId: string, versionId: string, userId: string, dto: UpdateVersionDto) {
    const version = await this.prisma.productVersion.findFirst({ where: { id: versionId, productId } });
    if (!version) throw new NotFoundException('Version not found');
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { developer: true },
    });
    if (product?.developer?.user_id !== userId) {
      const profile = await this.prisma.profile.findUnique({ where: { id: userId }, select: { role: true } });
      if (profile?.role !== 'admin') throw new ForbiddenException('You do not own this product');
    }
    return this.prisma.$transaction(async (tx) => {
      if (dto.isLatest) {
        await tx.productVersion.updateMany({ where: { productId }, data: { isLatest: false } });
      }
      return tx.productVersion.update({ where: { id: versionId }, data: dto });
    });
  }

  async deleteVersion(productId: string, versionId: string, userId: string) {
    const version = await this.prisma.productVersion.findFirst({ where: { id: versionId, productId } });
    if (!version) throw new NotFoundException('Version not found');
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { developer: true },
    });
    if (product?.developer?.user_id !== userId) {
      const profile = await this.prisma.profile.findUnique({ where: { id: userId }, select: { role: true } });
      if (profile?.role !== 'admin') throw new ForbiddenException('You do not own this product');
    }
    return this.prisma.productVersion.delete({ where: { id: versionId } });
  }

  private buildOrderBy(sort?: string) {
    switch (sort) {
      case 'price_asc':  return { price: 'asc' as const };
      case 'price_desc': return { price: 'desc' as const };
      case 'rating':     return { reviews: { _count: 'desc' as const } };
      case 'popular':    return { library: { _count: 'desc' as const } };
      default:           return { createdAt: 'desc' as const };
    }
  }

  private toSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
}

