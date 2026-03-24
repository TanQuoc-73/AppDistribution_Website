import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cart.findMany({
      where: { user_id: userId },
      include: {
        product: {
          select: { id: true, name: true, slug: true, thumbnailUrl: true, price: true, discountPercent: true, isFree: true },
        },
      },
      orderBy: { addedAt: 'desc' },
    });
  }

  async addItem(userId: string, productId: string) {
    const owned = await this.prisma.userLibrary.findFirst({
      where: { user_id: userId, productId },
    });
    if (owned) throw new BadRequestException('You already own this product');

    const existing = await this.prisma.cart.findFirst({ where: { user_id: userId, productId } });
    if (existing) return existing;

    return this.prisma.cart.create({ data: { user_id: userId, productId } });
  }

  async removeItem(userId: string, productId: string) {
    return this.prisma.cart.deleteMany({ where: { user_id: userId, productId } });
  }

  async clearCart(userId: string) {
    return this.prisma.cart.deleteMany({ where: { user_id: userId } });
  }
}
