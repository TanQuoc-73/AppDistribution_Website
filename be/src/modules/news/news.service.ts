import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.news.findMany({
        where: { isPublished: true },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          cover_image: true,
          isPublished: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          profiles: { select: { id: true, username: true, displayName: true } },
        },
      }),
      this.prisma.news.count({ where: { isPublished: true } }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.news.findUnique({
      where: { slug },
      include: {
        profiles: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        products: { select: { id: true, name: true, slug: true, thumbnailUrl: true } },
      },
    });
    if (!article || !article.isPublished) throw new NotFoundException('News article not found');
    return article;
  }
}
