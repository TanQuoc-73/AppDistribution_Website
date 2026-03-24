import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import type { Coupon } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: dto.productIds }, is_active: true },
    });

    if (products.length !== dto.productIds.length) {
      throw new BadRequestException('One or more products are invalid or unavailable');
    }

    const owned = await this.prisma.userLibrary.findMany({
      where: { user_id: userId, productId: { in: dto.productIds } },
    });
    if (owned.length > 0) {
      throw new BadRequestException('You already own one or more of these products');
    }

    let coupon: Coupon | null = null;
    if (dto.couponCode) {
      coupon = await this.prisma.coupon.findFirst({
        where: { code: dto.couponCode, isActive: true },
      });
      if (!coupon) throw new BadRequestException('Invalid or expired coupon');
    }

    const subtotal = products.reduce((sum, p) => sum + Number(p.price), 0);
    let discountAmount = 0;
    if (coupon) {
      discountAmount = coupon.discount_type === 'percentage'
        ? subtotal * (Number(coupon.discountValue) / 100)
        : Math.min(Number(coupon.discountValue), subtotal);
    }
    const totalPrice = Math.max(0, subtotal - discountAmount);

    return this.prisma.order.create({
      data: {
        user_id: userId,
        couponId: coupon?.id,
        subtotal,
        discountAmount,
        totalPrice,
        notes: dto.notes,
        orderItems: {
          create: products.map((p) => ({
            productId: p.id,
            product_name: p.name,
            unit_price: p.price as any,
            final_price: Number(p.price) * (1 - Number((p as any).discountPercent ?? 0) / 100),
          })),
        },
      },
      include: { orderItems: true },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: 'desc' },
      include: { orderItems: { include: { product: { select: { id: true, name: true, thumbnailUrl: true } } } } },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, user_id: userId },
      include: { orderItems: true, payment: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { profiles: { select: { username: true } }, _count: { select: { orderItems: true } } },
      }),
      this.prisma.order.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
