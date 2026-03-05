import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, items: { productId: number; price: number }[], paymentMethod?: string) {
        const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

        const order = await this.prisma.order.create({
            data: {
                userId,
                totalPrice,
                paymentMethod,
                status: 'COMPLETED',
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        price: item.price,
                    })),
                },
            },
            include: { items: { include: { product: true } } },
        });

        // Add products to user library
        for (const item of items) {
            await this.prisma.userLibrary.upsert({
                where: { userId_productId: { userId, productId: item.productId } },
                create: { userId, productId: item.productId },
                update: {},
            });
        }

        return order;
    }

    async findByUser(userId: number) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: number) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } } },
        });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }
}
