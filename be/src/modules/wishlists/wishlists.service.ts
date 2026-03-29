import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class WishlistsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * Get all wishlist items for the current user, with product info.
   */
  async getWishlist(userId: string) {
    const entries = await this.prisma.wishlist.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            thumbnailUrl: true,
            price: true,
            discountPercent: true,
            isFree: true,
            is_active: true,
            releaseDate: true,
            developer: { select: { id: true, name: true } },
          },
        },
      },
    });

    return entries.map((e) => ({
      wishlistId: e.id,
      addedAt: e.created_at,
      ...e.product,
    }));
  }

  /**
   * Add a product to wishlist. Prevent duplicates.
   */
  /**
   * Add a product to wishlist. Prevent duplicates, ensure profile, validate product, and ownership.
   */
  async add(userId: string, productId: string) {
    // 1. Ensure user profile exists (upsert if missing)
    let profile;
    try {
      profile = await this.prisma.profile.findUnique({ where: { id: userId } });
      if (!profile) {
        // Fallback: create profile if missing (should rarely happen if triggers work)
        profile = await this.prisma.profile.upsert({
          where: { id: userId },
          update: {},
          create: { id: userId, username: userId.slice(0, 8) }, // fallback username
        });
      }
    } catch (e) {
      throw new BadRequestException('User profile not found');
    }

    // 2. Validate product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, is_active: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (!product.is_active) throw new BadRequestException('Product is not available');

    // 3. Prevent duplicate wishlist items
    const existing = await this.prisma.wishlist.findUnique({
      where: { user_id_productId: { user_id: userId, productId } },
    });
    if (existing) throw new BadRequestException('Product already in wishlist');

    // 4. Prevent adding owned products
    const owned = await this.prisma.userLibrary.findUnique({
      where: { user_id_productId: { user_id: userId, productId } },
    });
    if (owned) throw new BadRequestException('You already own this product');

    // 5. All checks passed, create wishlist entry safely
    try {
      return await this.prisma.wishlist.create({
        data: { user_id: userId, productId },
      });
    } catch (err) {
      // Handle possible FK error (should not happen)
      if (err.code === 'P2003') {
        throw new BadRequestException('User profile not found');
      }
      throw err;
    }
  }

  /**
   * Remove a product from wishlist.
   */
  async remove(userId: string, productId: string) {
    await this.prisma.wishlist.deleteMany({
      where: { user_id: userId, productId },
    });
    return { message: 'Removed from wishlist' };
  }

  /**
   * Check if a product is in the user's wishlist.
   */
  async check(userId: string, productId: string): Promise<{ wishlisted: boolean }> {
    const entry = await this.prisma.wishlist.findUnique({
      where: { user_id_productId: { user_id: userId, productId } },
    });
    return { wishlisted: !!entry };
  }
}
