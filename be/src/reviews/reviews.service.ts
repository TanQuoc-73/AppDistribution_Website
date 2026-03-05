import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, productId: number, rating: number, comment: string) {
        const review = await this.prisma.review.create({
            data: { userId, productId, rating, comment },
            include: { user: { select: { name: true, avatar: true } } },
        });

        // Update product average rating
        const agg = await this.prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
        });
        await this.prisma.product.update({
            where: { id: productId },
            data: { rating: agg._avg.rating ?? 0 },
        });

        return review;
    }

    async findByProduct(productId: number) {
        return this.prisma.review.findMany({
            where: { productId },
            include: { user: { select: { name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
}
