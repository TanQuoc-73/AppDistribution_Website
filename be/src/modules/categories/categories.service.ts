import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

  async findAllFlat() {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { products: true } } },
    });
    return { data: categories };
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Parent category không tồn tại');
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        iconUrl: dto.iconUrl,
        parentId: dto.parentId ?? null,
        sort_order: dto.sort_order ?? 0,
      },
    });
    return { data: category };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category không tồn tại');

    if (dto.slug && dto.slug !== category.slug) {
      const conflict = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
      if (conflict) throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        iconUrl: dto.iconUrl,
        parentId: dto.parentId,
        sort_order: dto.sort_order,
      },
    });
    return { data: updated };
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { children: true, products: true } } },
    });
    if (!category) throw new NotFoundException('Category không tồn tại');
    if (category._count.children > 0) {
      throw new ConflictException('Category có danh mục con, hãy xoá chúng trước');
    }

    await this.prisma.category.delete({ where: { id } });
    return { data: { id } };
  }
}
