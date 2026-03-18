import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll(query?: { search?: string; category?: string; sort?: string; page?: number; limit?: number }) {
        const where: any = {};

        if (query?.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query?.category) {
            where.category = { name: { equals: query.category, mode: 'insensitive' } };
        }

        let orderBy: any = { createdAt: 'desc' };
        if (query?.sort === 'price-asc') orderBy = { price: 'asc' };
        else if (query?.sort === 'price-desc') orderBy = { price: 'desc' };

        const page = Number(query?.page ?? 1);
        const limit = Number(query?.limit ?? 24);
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    category: true,
                    developer: true,
                    reviews: { select: { rating: true } },
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        const enriched = data.map((p) => ({
            ...p,
            rating: p.reviews.length
                ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
                : null,
            reviews: undefined,
        }));

        return { data: enriched, total, page, limit };
    }

    async getCategories() {
        return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
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

    async update(id: string, userId: string, role: string, data: Partial<{
        name: string;
        description: string;
        price: number;
        thumbnail: string;
        categoryId: string;
        releaseDate: Date;
    }>) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Product not found');
        if (role !== 'ADMIN' && product.developerId !== userId) {
            throw new ForbiddenException('Not authorized to modify this product');
        }
        return this.prisma.product.update({ where: { id }, data });
    }

    async delete(id: string, userId: string, role: string) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Product not found');
        if (role !== 'ADMIN' && product.developerId !== userId) {
            throw new ForbiddenException('Not authorized to modify this product');
        }
        return this.prisma.product.delete({ where: { id } });
    }

    // Product versions
    async getVersions(productId: string) {
        return this.prisma.productVersion.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createVersion(productId: string, userId: string, role: string, data: {
        version: string;
        downloadUrl: string;
        fileSize?: number;
        changelog?: string;
    }) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new NotFoundException('Product not found');
        if (role !== 'ADMIN' && product.developerId !== userId) {
            throw new ForbiddenException('Not authorized to modify this product');
        }

        return this.prisma.productVersion.create({
            data: { ...data, productId },
        });
    }

    async getDeveloperAnalytics(developerId: string) {
        const products = await this.prisma.product.findMany({
            where: { developerId },
            include: {
                versions: { select: { downloadCount: true } },
                orderItems: { select: { price: true } },
            },
            orderBy: { createdAt: 'desc' }
        });

        let totalDownloads = 0;
        let totalRevenue = 0;
        const productsCount = products.length;

        products.forEach(p => {
            p.versions.forEach(v => totalDownloads += v.downloadCount);
            p.orderItems.forEach(oi => totalRevenue += Number(oi.price));
        });

        return {
            totalDownloads,
            totalRevenue,
            productsCount,
            recentProducts: products.slice(0, 5).map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                thumbnail: p.thumbnail,
                createdAt: p.createdAt
            }))
        };
    }

    async downloadVersion(productId: string, versionId: string, userId: string) {
        // 1. Check if user owns the product
        const owns = await this.prisma.userLibrary.findUnique({
            where: { userId_productId: { userId, productId } }
        });

        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new NotFoundException('Product not found');

        // Ensure price logic checks against 0 (using Number)
        if (!owns && Number(product.price) > 0) {
            throw new ForbiddenException('You must purchase this product to download it.');
        }

        const version = await this.prisma.productVersion.findUnique({
            where: { id: versionId }
        });

        if (!version || version.productId !== productId) {
            throw new NotFoundException('Version not found');
        }

        // Increment download count
        await this.prisma.productVersion.update({
            where: { id: versionId },
            data: { downloadCount: { increment: 1 } }
        });

        if (!version.downloadUrl) {
            throw new NotFoundException('Download URL not configured');
        }

        return version.downloadUrl;
    }
}
