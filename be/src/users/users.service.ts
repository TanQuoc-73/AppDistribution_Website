import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, username: true, avatarUrl: true, createdAt: true },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateProfile(userId: string, data: { username?: string; avatarUrl?: string }) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, email: true, username: true, avatarUrl: true },
        });
    }

    async getUserLibrary(userId: string) {
        return this.prisma.userLibrary.findMany({
            where: { userId },
            include: {
                product: {
                    include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
                },
            },
        });
    }

    async getUserWishlist(userId: string) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            include: { product: true },
        });
    }
}
