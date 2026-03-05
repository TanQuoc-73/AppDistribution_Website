import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class WishlistService {
    constructor(private prisma: PrismaService) { }

    async add(userId: number, productId: number) {
        return this.prisma.wishlist.upsert({
            where: { userId_productId: { userId, productId } },
            create: { userId, productId },
            update: {},
            include: { product: true },
        });
    }

    async remove(id: number) {
        return this.prisma.wishlist.delete({ where: { id } });
    }

    async findByUser(userId: number) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'desc' },
        });
    }
}
