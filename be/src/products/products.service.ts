import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll(query?: { search?: string; category?: string; sort?: string }) {
        const where: any = {};

        if (query?.search) {
            where.name = { contains: query.search, mode: 'insensitive' };
        }
        if (query?.category) {
            where.category = { name: query.category };
        }

        let orderBy: any = { createdAt: 'desc' };
        if (query?.sort === 'price-asc') orderBy = { price: 'asc' };
        else if (query?.sort === 'price-desc') orderBy = { price: 'desc' };

        return this.prisma.product.findMany({
            where,
            orderBy,
            include: { category: true, developer: true },
        });
    }

    async findById(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                developer: true,
                versions: { orderBy: { createdAt: 'desc' } },
                reviews: { include: { user: { select: { username: true, avatarUrl: true } } } },
                screenshots: true,
            },
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async getFeatured() {
        return this.prisma.product.findMany({
            take: 8,
            orderBy: { createdAt: 'desc' },
            include: { category: true },
        });
    }

    async getTrending() {
        return this.prisma.product.findMany({
            take: 8,
            orderBy: { createdAt: 'desc' },
            include: { category: true },
        });
    }

    async getByCategory(name: string) {
        return this.prisma.product.findMany({
            where: { category: { name } },
            include: { category: true },
        });
    }

    async create(data: {
        name: string;
        description: string;
        price: number;
        thumbnail?: string;
        categoryId: string;
        developerId: string;
        releaseDate?: Date;
    }) {
        return this.prisma.product.create({ data });
    }

    async update(id: string, data: Partial<{
        name: string;
        description: string;
        price: number;
        thumbnail: string;
        categoryId: string;
        releaseDate: Date;
    }>) {
        return this.prisma.product.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prisma.product.delete({ where: { id } });
    }

    // Product versions
    async getVersions(productId: string) {
        return this.prisma.productVersion.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createVersion(productId: string, data: {
        version: string;
        downloadUrl: string;
        fileSize?: number;
        changelog?: string;
    }) {
        return this.prisma.productVersion.create({
            data: { ...data, productId },
        });
    }
}
