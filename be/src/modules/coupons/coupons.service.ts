import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Admin: list all coupons with pagination.
   */
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.coupon.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.coupon.count(),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /**
   * Admin: create a new coupon.
   */
  async create(dto: CreateCouponDto) {
    // Check uniqueness
    const existing = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Coupon code "${dto.code}" already exists`);

    return this.prisma.coupon.create({
      data: {
        code: dto.code.toUpperCase().trim(),
        description: dto.description ?? null,
        discount_type: dto.discountType as any,
        discountValue: dto.discountValue,
        min_order_value: dto.minOrderValue ?? 0,
        max_discount: dto.maxDiscount ?? null,
        max_uses: dto.maxUses ?? null,
        isActive: dto.isActive ?? true,
        validFrom: dto.validFrom ? new Date(dto.validFrom) : new Date(),
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
      },
    });
  }

  /**
   * Admin: update a coupon.
   */
  async update(id: string, dto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    if (dto.code && dto.code !== coupon.code) {
      const conflict = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
      if (conflict) throw new ConflictException(`Coupon code "${dto.code}" already exists`);
    }

    const data: any = {};
    if (dto.code !== undefined) data.code = dto.code.toUpperCase().trim();
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.discountType !== undefined) data.discount_type = dto.discountType;
    if (dto.discountValue !== undefined) data.discountValue = dto.discountValue;
    if (dto.minOrderValue !== undefined) data.min_order_value = dto.minOrderValue;
    if (dto.maxDiscount !== undefined) data.max_discount = dto.maxDiscount;
    if (dto.maxUses !== undefined) data.max_uses = dto.maxUses;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.validFrom !== undefined) data.validFrom = new Date(dto.validFrom);
    if (dto.validUntil !== undefined) data.validUntil = dto.validUntil ? new Date(dto.validUntil) : null;

    return this.prisma.coupon.update({ where: { id }, data });
  }

  /**
   * Admin: delete a coupon.
   */
  async remove(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    // Don't delete if coupon has been used in orders
    const usedInOrders = await this.prisma.order.count({ where: { couponId: id } });
    if (usedInOrders > 0) {
      throw new BadRequestException(
        `Cannot delete coupon that has been used in ${usedInOrders} order(s). Deactivate it instead.`,
      );
    }

    await this.prisma.coupon.delete({ where: { id } });
    return { message: 'Coupon deleted' };
  }

  /**
   * Public validation: validate a coupon code for an order.
   * Used by orders service and could be exposed as a user-facing endpoint.
   */
  async validate(code: string, orderSubtotal: number) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { code: code.toUpperCase().trim(), isActive: true },
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
    if (orderSubtotal < Number(coupon.min_order_value)) {
      throw new BadRequestException(
        `Minimum order value of $${coupon.min_order_value} required for this coupon`,
      );
    }

    // Calculate discount
    let discountAmount: number;
    if (coupon.discount_type === 'percentage') {
      discountAmount = orderSubtotal * (Number(coupon.discountValue) / 100);
      if (coupon.max_discount) {
        discountAmount = Math.min(discountAmount, Number(coupon.max_discount));
      }
    } else {
      discountAmount = Math.min(Number(coupon.discountValue), orderSubtotal);
    }

    return {
      valid: true,
      coupon,
      discountAmount: Math.round(discountAmount * 100) / 100,
    };
  }
}
