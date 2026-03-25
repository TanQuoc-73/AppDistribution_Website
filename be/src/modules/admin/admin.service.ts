import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRole, OrderStatus } from '@prisma/client';

interface CreateProductDto {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string;
  price?: number;
  discountPercent?: number;
  isFree?: boolean;
  ageRating?: string;
  developerId?: string;
  releaseDate?: string;
  downloadUrl?: string;
  versionString?: string;
  fileSize?: number;
}

interface UpdateProductDto {
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string;
  price?: number;
  discountPercent?: number;
  isFree?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
  ageRating?: string;
  developerId?: string;
  releaseDate?: string;
  downloadUrl?: string;
  versionString?: string;
  fileSize?: number;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /* ─── Dashboard stats ──────────────────────────────────────────────── */

  async getStats() {
    const [users, products, orders, revenue] = await Promise.all([
      this.prisma.profile.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { totalPrice: true } }),
    ]);
    return {
      totalUsers: users,
      totalProducts: products,
      totalOrders: orders,
      totalRevenue: Number(revenue._sum.totalPrice ?? 0),
    };
  }

  /* ─── Users (profiles) ─────────────────────────────────────────────── */

  async findAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.profile.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.profile.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateUserRole(id: string, role: UserRole) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('User not found');
    return this.prisma.profile.update({ where: { id }, data: { role } });
  }

  async toggleUserActive(id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('User not found');
    return this.prisma.profile.update({
      where: { id },
      data: { is_active: !profile.is_active },
    });
  }

  async updateUser(id: string, data: { username?: string; displayName?: string; bio?: string; role?: UserRole }) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('User not found');
    const updateData: any = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.role !== undefined) updateData.role = data.role;
    return this.prisma.profile.update({ where: { id }, data: updateData });
  }

  async deleteUser(id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('User not found');
    return this.prisma.profile.delete({ where: { id } });
  }

  /* ─── Products ──────────────────────────────────────────────────────── */

  async findAllProducts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          developer: { select: { id: true, name: true } },
          versions: { where: { isLatest: true }, take: 1, select: { version: true, downloadUrl: true, fileSize: true } },
        },
      }),
      this.prisma.product.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateProductStatus(id: string, isActive: boolean, isFeatured?: boolean) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.update({
      where: { id },
      data: {
        is_active: isActive,
        ...(isFeatured !== undefined && { is_featured: isFeatured }),
      },
    });
  }

  async createProduct(dto: CreateProductDto) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          shortDescription: dto.shortDescription ?? null,
          description: dto.description ?? null,
          thumbnailUrl: dto.thumbnailUrl ?? null,
          price: dto.price ?? 0,
          discountPercent: dto.discountPercent ?? 0,
          isFree: dto.isFree ?? false,
          ageRating: (dto.ageRating as any) ?? 'everyone',
          developerId: dto.developerId ?? null,
          releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : null,
        },
        include: { developer: { select: { id: true, name: true } } },
      });

      if (dto.downloadUrl || dto.versionString) {
        await tx.productVersion.create({
          data: {
            productId: product.id,
            version: dto.versionString || '1.0.0',
            downloadUrl: dto.downloadUrl || null,
            fileSize: dto.fileSize ?? null,
            isLatest: true,
          },
        });
      }

      return product;
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.shortDescription !== undefined) data.shortDescription = dto.shortDescription;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.thumbnailUrl !== undefined) data.thumbnailUrl = dto.thumbnailUrl;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.discountPercent !== undefined) data.discountPercent = dto.discountPercent;
    if (dto.isFree !== undefined) data.isFree = dto.isFree;
    if (dto.is_active !== undefined) data.is_active = dto.is_active;
    if (dto.is_featured !== undefined) data.is_featured = dto.is_featured;
    if (dto.ageRating !== undefined) data.ageRating = dto.ageRating;
    if (dto.developerId !== undefined) data.developerId = dto.developerId || null;
    if (dto.releaseDate !== undefined) data.releaseDate = dto.releaseDate ? new Date(dto.releaseDate) : null;
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data,
        include: { developer: { select: { id: true, name: true } } },
      });

      if (dto.downloadUrl !== undefined || dto.versionString !== undefined || dto.fileSize !== undefined) {
        const latestVersion = await tx.productVersion.findFirst({
          where: { productId: id, isLatest: true },
        });
        if (latestVersion) {
          await tx.productVersion.update({
            where: { id: latestVersion.id },
            data: {
              ...(dto.downloadUrl !== undefined && { downloadUrl: dto.downloadUrl || null }),
              ...(dto.versionString !== undefined && { version: dto.versionString }),
              ...(dto.fileSize !== undefined && { fileSize: dto.fileSize }),
            },
          });
        } else {
          await tx.productVersion.create({
            data: {
              productId: id,
              version: dto.versionString || '1.0.0',
              downloadUrl: dto.downloadUrl || null,
              fileSize: dto.fileSize ?? null,
              isLatest: true,
            },
          });
        }
      }

      return updated;
    });
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.delete({ where: { id } });
  }

  /* ─── Orders ────────────────────────────────────────────────────────── */

  async findAllOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profiles: { select: { id: true, username: true } },
          orderItems: { include: { product: { select: { id: true, name: true } } } },
        },
      }),
      this.prisma.order.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  async getOrderDetail(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        profiles: { select: { id: true, username: true, avatarUrl: true } },
        orderItems: { include: { product: { select: { id: true, name: true, slug: true, thumbnailUrl: true } } } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  /* ─── News ──────────────────────────────────────────────────────────── */

  async findAllNewsAdmin(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.news.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          cover_image: true,
          isPublished: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          profiles: { select: { id: true, username: true } },
        },
      }),
      this.prisma.news.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createNews(dto: { title: string; slug: string; content: string; excerpt?: string; cover_image?: string; isPublished?: boolean; publishedAt?: string }) {
    return this.prisma.news.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        content: dto.content,
        excerpt: dto.excerpt ?? null,
        cover_image: dto.cover_image ?? null,
        isPublished: dto.isPublished ?? false,
        publishedAt: dto.isPublished ? (dto.publishedAt ? new Date(dto.publishedAt) : new Date()) : null,
      },
    });
  }

  async updateNews(id: string, dto: { title?: string; slug?: string; content?: string; excerpt?: string; cover_image?: string; isPublished?: boolean }) {
    const article = await this.prisma.news.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('News article not found');
    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.excerpt !== undefined) data.excerpt = dto.excerpt;
    if (dto.cover_image !== undefined) data.cover_image = dto.cover_image;
    if (dto.isPublished !== undefined) {
      data.isPublished = dto.isPublished;
      if (dto.isPublished && !article.isPublished) data.publishedAt = new Date();
      if (!dto.isPublished) data.publishedAt = null;
    }
    return this.prisma.news.update({ where: { id }, data });
  }

  async deleteNews(id: string) {
    const article = await this.prisma.news.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('News article not found');
    return this.prisma.news.delete({ where: { id } });
  }

  /* ─── Banners ───────────────────────────────────────────────────────── */

  async findAllBanners(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.banner.findMany({
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.banner.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createBanner(dto: { title: string; imageUrl: string; linkUrl?: string; sortOrder?: number; isActive?: boolean }) {
    return this.prisma.banner.create({
      data: {
        title: dto.title,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl ?? null,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async updateBanner(id: string, dto: { title?: string; imageUrl?: string; linkUrl?: string; sortOrder?: number; isActive?: boolean }) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.linkUrl !== undefined) data.linkUrl = dto.linkUrl;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    return this.prisma.banner.update({ where: { id }, data });
  }

  async deleteBanner(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    return this.prisma.banner.delete({ where: { id } });
  }
}
