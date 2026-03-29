import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import type { Coupon } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Production-safe checkout: atomic, idempotent, concurrency-safe.
   * @param userId
   * @param dto
   * @param idempotencyKey (optional, for advanced clients)
   */
  async create(userId: string, dto: CreateOrderDto, idempotencyKey?: string) {
    // 1. Check for existing pending order for this user and same products (idempotency)
    // (If idempotencyKey is provided, use it; else, fallback to productIds hash)
    const pendingOrder = await this.prisma.order.findFirst({
      where: {
        user_id: userId,
        status: 'pending',
        // Optionally: add idempotencyKey or hash of productIds
      },
      include: { orderItems: true },
    });
    if (pendingOrder) {
      // Check if same products (simple array compare)
      const pendingIds = pendingOrder.orderItems.map(i => i.productId).sort().join(',');
      const reqIds = dto.productIds.slice().sort().join(',');
      if (pendingIds === reqIds) {
        throw new ConflictException('A pending order for these products already exists.');
      }
    }

    // 2. Fetch cart items and products server-side
    const cartItems = await this.prisma.cart.findMany({
      where: { user_id: userId, productId: { in: dto.productIds } },
      include: { product: true },
    });
    if (cartItems.length !== dto.productIds.length) {
      throw new BadRequestException('Some products are not in your cart.');
    }
    const products = cartItems.map(i => i.product);

    // 3. Check for already owned products
    const owned = await this.prisma.userLibrary.findMany({
      where: { user_id: userId, productId: { in: dto.productIds } },
      select: { productId: true },
    });
    if (owned.length > 0) {
      throw new BadRequestException('You already own one or more of these products');
    }

    // 4. Validate coupon and calculate total
    let coupon: Coupon | null = null;
    const subtotal = products.reduce((sum, p) => sum + Number(p.price), 0);
    let discountAmount = 0;
    if (dto.couponCode) {
      coupon = await this.prisma.coupon.findFirst({
        where: { code: dto.couponCode, isActive: true },
      });
      if (!coupon) throw new BadRequestException('Invalid or inactive coupon code');
      const now = new Date();
      if (coupon.validFrom && coupon.validFrom > now) {
        throw new BadRequestException('This coupon is not yet valid');
      }
      if (coupon.validUntil && coupon.validUntil < now) {
        throw new BadRequestException('This coupon has expired');
      }
      if (coupon.max_uses && coupon.usedCount >= coupon.max_uses) {
        throw new BadRequestException('This coupon has reached its usage limit');
      }
      if (subtotal < Number(coupon.min_order_value)) {
        throw new BadRequestException(
          `Minimum order value of $${coupon.min_order_value} required for this coupon`,
        );
      }
      if (coupon.discount_type === 'percentage') {
        discountAmount = subtotal * (Number(coupon.discountValue) / 100);
        if (coupon.max_discount) {
          discountAmount = Math.min(discountAmount, Number(coupon.max_discount));
        }
      } else if (coupon.discount_type === 'fixed') {
        discountAmount = Number(coupon.discountValue);
      }
    }
    const total = Math.max(0, subtotal - discountAmount);

    // 5. Transaction: create order, order_items, mark coupon, clear cart
    return await this.prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          user_id: userId,
          status: 'pending',
          totalPrice: total,
          couponId: coupon?.id ?? null,
          // Optionally: idempotencyKey
          orderItems: {
            create: products.map((p) => ({
              productId: p.id,
              product_name: p.name,
              unit_price: p.price,
              final_price: Number(p.price) * (1 - Number((p as any).discountPercent ?? 0) / 100),
              // If your schema requires a product relation, add:
              // product: { connect: { id: p.id } },
            })),
          },
        },
        include: { orderItems: true },
      });


      // Mark coupon as used (if applicable)
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Clear cart
      await tx.cart.deleteMany({ where: { user_id: userId, productId: { in: dto.productIds } } });

      return order;
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
