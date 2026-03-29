import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const tags = await this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
    return { data: tags };
  }

  async create(dto: CreateTagDto) {
    // Check uniqueness for both name and slug
    const existingName = await this.prisma.tag.findUnique({ where: { name: dto.name } });
    if (existingName) throw new ConflictException(`Tag name "${dto.name}" already exists`);

    const existingSlug = await this.prisma.tag.findUnique({ where: { slug: dto.slug } });
    if (existingSlug) throw new ConflictException(`Tag slug "${dto.slug}" already exists`);

    return this.prisma.tag.create({
      data: { name: dto.name, slug: dto.slug },
    });
  }

  async update(id: string, dto: UpdateTagDto) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');

    if (dto.name && dto.name !== tag.name) {
      const conflict = await this.prisma.tag.findUnique({ where: { name: dto.name } });
      if (conflict) throw new ConflictException(`Tag name "${dto.name}" already exists`);
    }
    if (dto.slug && dto.slug !== tag.slug) {
      const conflict = await this.prisma.tag.findUnique({ where: { slug: dto.slug } });
      if (conflict) throw new ConflictException(`Tag slug "${dto.slug}" already exists`);
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.slug !== undefined) data.slug = dto.slug;

    return this.prisma.tag.update({ where: { id }, data });
  }

  async remove(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!tag) throw new NotFoundException('Tag not found');
    if (tag._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete tag used by ${tag._count.products} product(s). Remove tag from products first.`,
      );
    }

    await this.prisma.tag.delete({ where: { id } });
    return { message: 'Tag deleted' };
  }
}
