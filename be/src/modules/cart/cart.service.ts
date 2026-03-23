import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cart.findMany({
      where: { profileId: userId },
      include: {
        product: {
          select: { id: true, name: true, slug: true, thumbnailUrl: true, price: true, discountPercent: true, isFree: true },
        },
      },
      orderBy: { addedAt: 'desc' },
    });
  }

  async addItem(userId: string, productId: string) {
    const owned = await this.prisma.userLibrary.findUnique({
      where: { profileId_productId: { profileId: userId, productId } },
    });
    if (owned) throw new BadRequestException('You already own this product');

    return this.prisma.cart.upsert({
      where: { profileId_productId: { profileId: userId, productId } },
      create: { profileId: userId, productId },
      update: {},
    });
  }

  async removeItem(userId: string, productId: string) {
    return this.prisma.cart.delete({
      where: { profileId_productId: { profileId: userId, productId } },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cart.deleteMany({ where: { profileId: userId } });
  }
}
