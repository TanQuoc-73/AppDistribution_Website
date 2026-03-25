import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async getLibrary(userId: string) {
    const entries = await this.prisma.userLibrary.findMany({
      where: { user_id: userId },
      orderBy: { acquiredAt: 'desc' },
      include: {
        product: {
          include: {
            developer: { select: { id: true, name: true } },
            versions: {
              where: { isLatest: true },
              take: 1,
              select: { id: true, version: true, downloadUrl: true, fileSize: true },
            },
            categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
          },
        },
      },
    });
    return entries.map((e) => ({
      ...e.product,
      acquiredAt: e.acquiredAt,
      licenseKey: e.license_key,
      latestVersion: e.product.versions[0] ?? null,
    }));
  }

  async checkOwnership(userId: string, productId: string): Promise<boolean> {
    const entry = await this.prisma.userLibrary.findUnique({
      where: { user_id_productId: { user_id: userId, productId } },
    });
    return !!entry;
  }

  /** Add free product to library on first request (if isFree) */
  async claimFree(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isFree: true, is_active: true },
    });
    if (!product?.isFree) throw new Error('Product is not free');
    return this.prisma.userLibrary.upsert({
      where: { user_id_productId: { user_id: userId, productId } },
      create: { user_id: userId, productId },
      update: {},
    });
  }
}
