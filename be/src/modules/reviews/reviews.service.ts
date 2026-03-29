import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all approved reviews for a product, including author info and vote counts.
   */
  async findByProduct(productId: string, page = 1, limit = 20, currentUserId?: string) {
    const skip = (page - 1) * limit;
    const product = await this.prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) throw new NotFoundException('Product not found');
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId, is_approved: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profiles: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
          reviewVotes: currentUserId
            ? {
                where: { user_id: currentUserId },
                select: { isHelpful: true },
              }
            : false,
        },
      }),
      this.prisma.review.count({ where: { productId, is_approved: true } }),
    ]);
    const avgResult = await this.prisma.review.aggregate({
      where: { productId, is_approved: true },
      _avg: { rating: true },
    });
    // Map user_vote for each review
    const reviewsWithVote = data.map((r) => ({
      ...r,
      author: r.profiles,
      user_vote: r.reviewVotes?.[0]?.isHelpful ?? null,
    }));
    return {
      data: reviewsWithVote,
      averageRating: (avgResult._avg?.rating ?? 0).toFixed(1),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Create a review. User must own the product (in user_library).
   * One review per user per product (enforced by DB unique constraint).
   */
  async create(userId: string, dto: CreateReviewDto) {
    // Check ownership
    const owned = await this.prisma.userLibrary.findUnique({
      where: { user_id_productId: { user_id: userId, productId: dto.productId } },
    });
    if (!owned) {
      throw new ForbiddenException('You must own this product to leave a review');
    }

    // Try to create review, rely on DB unique constraint
    try {
      return await this.prisma.review.create({
        data: {
          user_id: userId,
          productId: dto.productId,
          rating: dto.rating,
          title: dto.title ?? null,
          comment: dto.comment ?? null,
        },
        include: {
          profiles: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException('You have already reviewed this product');
      }
      throw err;
    }
  }

  /**
   * Update own review.
   */
  async update(reviewId: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.user_id !== userId) throw new ForbiddenException('You can only edit your own review');

    const data: any = {};
    if (dto.rating !== undefined) data.rating = dto.rating;
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.comment !== undefined) data.comment = dto.comment;

    return this.prisma.review.update({
      where: { id: reviewId },
      data,
      include: {
        profiles: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });
  }

  /**
   * Delete own review. Admins can also delete.
   */
  async remove(reviewId: string, userId: string, userRole: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.user_id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only delete your own review');
    }

    await this.prisma.reviewVote.deleteMany({ where: { reviewId } });
    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Review deleted' };
  }

  /**
   * Vote on a review (helpful / not helpful).
   * DB trigger fn_update_review_helpful_count automatically recalculates helpful_count.
   */
  async vote(reviewId: string, userId: string, isHelpful: boolean) {
    return this.prisma.$transaction(async (tx) => {
      // Check review exists
      const review = await tx.review.findUnique({ where: { id: reviewId } });
      if (!review) throw new NotFoundException('Review not found');
      // Prevent voting own review
      if (review.user_id === userId) throw new ForbiddenException('You cannot vote your own review');
      // Upsert vote
      await tx.reviewVote.upsert({
        where: { reviewId_user_id: { reviewId, user_id: userId } },
        update: { isHelpful },
        create: { reviewId, user_id: userId, isHelpful },
      });
      // Recalculate helpful count
      const helpfulCount = await tx.reviewVote.count({
        where: { reviewId, isHelpful: true },
      });
      await tx.review.update({
        where: { id: reviewId },
        data: { helpfulCount },
      });
      return { helpfulCount };
    });
  }

  /**
   * Vote or change vote on a review. Atomic counter update, no COUNT().
   */
  async voteReview(reviewId: string, userId: string, isHelpful: boolean) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch review
      const review = await tx.review.findUnique({ where: { id: reviewId } });
      if (!review) throw new NotFoundException('Review not found');
      if (review.user_id === userId) throw new ForbiddenException('You cannot vote your own review');
      // 2. Fetch existing vote
      const existing = await tx.reviewVote.findUnique({
        where: { reviewId_user_id: { reviewId, user_id: userId } },
      });
      if (!existing) {
        // New vote
        await tx.reviewVote.create({
          data: { reviewId, user_id: userId, isHelpful },
        });
        if (isHelpful) {
          await tx.review.update({ where: { id: reviewId }, data: { helpfulCount: { increment: 1 } } });
        }
        return { voted: true, isHelpful };
      }
      if (existing.isHelpful === isHelpful) {
        // No change
        return { voted: true, isHelpful };
      }
      // Change vote
      await tx.reviewVote.update({
        where: { reviewId_user_id: { reviewId, user_id: userId } },
        data: { isHelpful },
      });
      if (isHelpful) {
        // unhelpful → helpful
        await tx.review.update({ where: { id: reviewId }, data: { helpfulCount: { increment: 1 } } });
      } else {
        // helpful → unhelpful
        await tx.review.update({ where: { id: reviewId }, data: { helpfulCount: { decrement: 1 } } });
      }
      return { voted: true, isHelpful };
    });
  }

  /**
   * Remove vote on a review. Atomic counter update, no COUNT().
   */
  async removeVote(reviewId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch review
      const review = await tx.review.findUnique({ where: { id: reviewId } });
      if (!review) throw new NotFoundException('Review not found');
      if (review.user_id === userId) throw new ForbiddenException('You cannot vote your own review');
      // 2. Fetch existing vote
      const existing = await tx.reviewVote.findUnique({
        where: { reviewId_user_id: { reviewId, user_id: userId } },
      });
      if (!existing) {
        // No vote to remove
        return { removed: false };
      }
      await tx.reviewVote.delete({ where: { reviewId_user_id: { reviewId, user_id: userId } } });
      if (existing.isHelpful) {
        await tx.review.update({ where: { id: reviewId }, data: { helpfulCount: { decrement: 1 } } });
      }
      return { removed: true };
    });
  }

  /**
   * Get the current user's review for a specific product (if it exists).
   */
  async getMyReview(userId: string, productId: string) {
    const review = await this.prisma.review.findUnique({
      where: { user_id_productId: { user_id: userId, productId } },
      include: {
        profiles: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });
    return review;
  }
}
