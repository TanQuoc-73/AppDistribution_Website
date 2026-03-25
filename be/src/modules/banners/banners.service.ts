import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async findActive() {
    const now = new Date();
    return this.prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [{ valid_from: null }, { valid_from: { lte: now } }],
        AND: [{ OR: [{ valid_until: null }, { valid_until: { gte: now } }] }],
      },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
