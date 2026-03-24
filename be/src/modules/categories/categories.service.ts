import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { sort_order: 'asc' },
      include: {
        children: {
          orderBy: { sort_order: 'asc' },
        },
        _count: { select: { products: true } },
      },
      where: { parentId: null },
    });
    return { data: categories };
  }
}
