import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
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
    const { categoryIds, tagIds, ...data } = dto;
    return this.prisma.product.create({
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
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);
    const { categoryIds, tagIds, ...data } = dto;
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.product.delete({ where: { id } });
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

