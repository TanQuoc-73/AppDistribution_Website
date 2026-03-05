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
            where.category = { slug: query.category };
        }

        let orderBy: any = { createdAt: 'desc' };
        if (query?.sort === 'price-asc') orderBy = { price: 'asc' };
        else if (query?.sort === 'price-desc') orderBy = { price: 'desc' };
        else if (query?.sort === 'popular') orderBy = { downloads: 'desc' };

        return this.prisma.product.findMany({
            where,
            orderBy,
            include: { category: true, developer: true },
        });
    }

    async findById(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                developer: { include: { user: { select: { name: true } } } },
                versions: { orderBy: { createdAt: 'desc' } },
                reviews: { include: { user: { select: { name: true, avatar: true } } } },
            },
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async getFeatured() {
        return this.prisma.product.findMany({
            take: 8,
            orderBy: { rating: 'desc' },
            include: { category: true },
        });
    }

    async getTrending() {
        return this.prisma.product.findMany({
            take: 8,
            orderBy: { downloads: 'desc' },
            include: { category: true },
        });
    }

    async getByCategory(slug: string) {
        return this.prisma.product.findMany({
            where: { category: { slug } },
            include: { category: true },
        });
    }

    async create(data: {
        name: string;
        description: string;
        price: number;
        image?: string;
        screenshots?: string[];
        categoryId: number;
        developerId: number;
    }) {
        return this.prisma.product.create({ data });
    }

    async update(id: number, data: Partial<{
        name: string;
        description: string;
        price: number;
        image: string;
        screenshots: string[];
        categoryId: number;
    }>) {
        return this.prisma.product.update({ where: { id }, data });
    }

    async delete(id: number) {
        return this.prisma.product.delete({ where: { id } });
    }

    // Product versions
    async getVersions(productId: number) {
        return this.prisma.productVersion.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createVersion(productId: number, data: {
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
