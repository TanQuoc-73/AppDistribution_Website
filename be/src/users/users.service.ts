import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, avatar: true, role: true, createdAt: true },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateProfile(userId: number, data: { name?: string; avatar?: string }) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, email: true, name: true, avatar: true, role: true },
        });
    }

    async getUserLibrary(userId: number) {
        return this.prisma.userLibrary.findMany({
            where: { userId },
            include: {
                product: {
                    include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
                },
            },
        });
    }

    async getUserWishlist(userId: number) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            include: { product: true },
        });
    }
}
