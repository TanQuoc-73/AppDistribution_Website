import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DevelopersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.developer.findMany({
      select: { id: true, name: true, slug: true, logoUrl: true },
      orderBy: { name: 'asc' },
    });
  }

  async getMyProfile(userId: string) {
    const dev = await this.prisma.developer.findFirst({ where: { user_id: userId } });
    if (!dev) throw new NotFoundException('Developer profile not found');
    return dev;
  }

  async getMyProducts(userId: string) {
    const dev = await this.prisma.developer.findFirst({
      where: { user_id: userId },
      select: { id: true },
    });
    if (!dev) throw new NotFoundException('Developer profile not found');
    return this.prisma.product.findMany({
      where: { developerId: dev.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { library: true, reviews: true } },
        versions: {
          where: { isLatest: true },
          take: 1,
          select: { version: true, downloadUrl: true },
        },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });
  }

  async updateMyProfile(userId: string, data: { name?: string; description?: string; logoUrl?: string; website?: string; country?: string }) {
    const dev = await this.prisma.developer.findFirst({ where: { user_id: userId } });
    if (!dev) throw new NotFoundException('Developer profile not found');
    return this.prisma.developer.update({ where: { id: dev.id }, data });
  }

  async getStats(userId: string) {
    const dev = await this.prisma.developer.findFirst({ where: { user_id: userId }, select: { id: true } });
    if (!dev) throw new NotFoundException('Developer profile not found');
    const [totalProducts, totalDownloads] = await Promise.all([
      this.prisma.product.count({ where: { developerId: dev.id } }),
      this.prisma.userLibrary.count({ where: { product: { developerId: dev.id } } }),
    ]);
    return { totalProducts, totalDownloads };
  }
}
