import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class WishlistService {
    constructor(private prisma: PrismaService) { }

    async add(userId: string, productId: string) {
        return this.prisma.wishlist.upsert({
            where: { userId_productId: { userId, productId } },
            create: { userId, productId },
            update: {},
            include: { product: true },
        });
    }

    async remove(id: string) {
        return this.prisma.wishlist.delete({ where: { id } });
    }

    async removeByProduct(userId: string, productId: string) {
        const res = await this.prisma.wishlist.deleteMany({ where: { userId, productId } });
        return { deleted: res.count };
    }

    async findByUser(userId: string) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'desc' },
        });
    }
}
