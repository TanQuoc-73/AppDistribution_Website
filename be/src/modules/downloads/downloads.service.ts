import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DownloadsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Convert Google Drive sharing links to direct download URLs.
   * Supports formats:
   *   https://drive.google.com/file/d/FILE_ID/view...
   *   https://drive.google.com/open?id=FILE_ID
   */
  private toDirectDownloadUrl(url: string): string {
    // Pattern 1: /file/d/FILE_ID/...
    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
    }
    // Pattern 2: /open?id=FILE_ID
    const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      return `https://drive.google.com/uc?export=download&id=${openMatch[1]}`;
    }
    return url;
  }

  /**
   * Kiểm tra quyền sở hữu, trả về URL tải về và ghi lại lịch sử.
   * - Sản phẩm miễn phí: ai cũng tải được (cần đăng nhập)
   * - Sản phẩm trả phí: chỉ người đã mua (có trong library) mới tải được
   */
  async download(userId: string, productId: string, versionId?: string, ipAddress?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (!product.is_active) throw new BadRequestException('Product is not available');

    // Check ownership for paid products
    if (!product.isFree) {
      const owned = await this.prisma.userLibrary.findUnique({
        where: { user_id_productId: { user_id: userId, productId } },
      });
      if (!owned) throw new ForbiddenException('You must purchase this product before downloading');
    }

    // Resolve version
    let version = versionId
      ? product.versions.find((v) => v.id === versionId)
      : product.versions.find((v) => v.isLatest) ?? product.versions[0];

    if (!version) throw new NotFoundException('No downloadable version found');
    if (!version.downloadUrl) throw new NotFoundException('Download URL not available for this version');

    // Log download history (non-blocking)
    this.prisma.downloadHistory
      .create({
        data: {
          user_id: userId,
          product_id: productId,
          versionId: version.id,
          ipAddress: ipAddress ?? null,
        },
      })
      .catch(() => {}); // best-effort

    return {
      downloadUrl: this.toDirectDownloadUrl(version.downloadUrl),
      version: version.version,
      changelog: version.changelog,
      fileSize: version.fileSize ? Number(version.fileSize) : null,
      productName: product.name,
    };
  }

  async getHistory(userId: string) {
    return this.prisma.downloadHistory.findMany({
      where: { user_id: userId },
      orderBy: { downloadedAt: 'desc' },
      take: 50,
      include: {
        products: { select: { id: true, name: true, slug: true, thumbnailUrl: true } },
        version: { select: { version: true } },
      },
    });
  }
}
