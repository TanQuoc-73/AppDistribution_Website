import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';

@Injectable()
export class ProductVersionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByProduct(productId: string) {
    return this.prisma.productVersion.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(productId: string, dto: CreateVersionDto) {
    // Mark all previous versions as not latest
    await this.prisma.productVersion.updateMany({
      where: { productId, isLatest: true },
      data: { isLatest: false },
    });
    // Create new version as latest
    return this.prisma.productVersion.create({
      data: {
        ...dto,
        productId,
        isLatest: true,
      },
    });
  }

  async update(versionId: string, dto: UpdateVersionDto) {
    return this.prisma.productVersion.update({
      where: { id: versionId },
      data: dto,
    });
  }

  async remove(versionId: string) {
    return this.prisma.productVersion.delete({
      where: { id: versionId },
    });
  }

  async setLatest(versionId: string) {
    const version = await this.prisma.productVersion.findUnique({ where: { id: versionId } });
    if (!version) throw new NotFoundException('Version not found');
    // Mark all as not latest
    await this.prisma.productVersion.updateMany({
      where: { productId: version.productId },
      data: { isLatest: false },
    });
    // Set this as latest
    return this.prisma.productVersion.update({
      where: { id: versionId },
      data: { isLatest: true },
    });
  }
}
