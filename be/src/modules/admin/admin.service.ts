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
    return this.prisma.product.create({
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
      },
      include: { developer: { select: { id: true, name: true } } },
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
    return this.prisma.product.update({
      where: { id },
      data,
      include: { developer: { select: { id: true, name: true } } },
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
}
