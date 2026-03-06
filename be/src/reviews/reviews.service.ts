import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, productId: string, rating: number, comment: string) {
        const review = await this.prisma.review.create({
            data: { userId, productId, rating, comment },
            include: { user: { select: { username: true, avatarUrl: true } } },
        });

        // Note: Product rating field doesn't exist in schema
        // If needed, implement a separate rating aggregation endpoint

        return review;
    }

    async findByProduct(productId: string) {
        return this.prisma.review.findMany({
            where: { productId },
            include: { user: { select: { username: true, avatarUrl: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
}
