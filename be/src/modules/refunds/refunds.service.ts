import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { ProcessRefundDto } from './dto/process-refund.dto';

@Injectable()
export class RefundsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * User: request a refund for an order item.
   */
  async request(userId: string, dto: CreateRefundDto) {
    // Verify the order item exists and belongs to the user
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: dto.orderItemId },
      include: {
        order: { select: { id: true, user_id: true, status: true, payment_status: true } },
      },
    });

    if (!orderItem) throw new NotFoundException('Order item not found');
    if (orderItem.order.user_id !== userId) {
      throw new ForbiddenException('This order does not belong to you');
    }
    if (orderItem.order.status !== 'completed') {
      throw new BadRequestException('Only completed orders can be refunded');
    }
    if (orderItem.order.payment_status !== 'paid') {
      throw new BadRequestException('Only paid orders can be refunded');
    }

    // Check if a refund already exists for this order item
    const existingRefund = await this.prisma.refund.findFirst({
      where: { order_item_id: dto.orderItemId, status: { not: 'rejected' } },
    });
    if (existingRefund) {
      throw new BadRequestException('A refund request already exists for this item');
    }

    return this.prisma.refund.create({
      data: {
        order_item_id: dto.orderItemId,
        user_id: userId,
        reason: dto.reason,
        status: 'pending',
      },
      include: {
        order_items: {
          select: { id: true, product_name: true, final_price: true },
        },
      },
    });
  }

  /**
   * User: get my refund requests.
   */
  async findMyRefunds(userId: string) {
    return this.prisma.refund.findMany({
      where: { user_id: userId },
      orderBy: { requested_at: 'desc' },
      include: {
        order_items: {
          select: {
            id: true,
            product_name: true,
            final_price: true,
            product: { select: { id: true, slug: true, thumbnailUrl: true } },
          },
        },
      },
    });
  }

  /**
   * Admin: list all refund requests with pagination.
   */
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.refund.findMany({
        skip,
        take: limit,
        orderBy: { requested_at: 'desc' },
        include: {
          profiles: { select: { id: true, username: true, avatarUrl: true } },
          order_items: {
            select: {
              id: true,
              product_name: true,
              final_price: true,
              orderId: true,
            },
          },
        },
      }),
      this.prisma.refund.count(),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /**
   * Admin: approve a refund. Updates order status and removes product from library.
   */
  async approve(refundId: string, dto: ProcessRefundDto) {
    const refund = await this.prisma.refund.findUnique({
      where: { id: refundId },
      include: {
        order_items: {
          include: { order: true },
        },
      },
    });

    if (!refund) throw new NotFoundException('Refund request not found');
    if (refund.status !== 'pending') {
      throw new BadRequestException('This refund has already been processed');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Update refund status
      const updated = await tx.refund.update({
        where: { id: refundId },
        data: {
          status: 'approved',
          admin_notes: dto.adminNotes ?? null,
          processed_at: new Date(),
        },
      });

      // 2. Update order status to refunded
      await tx.order.update({
        where: { id: refund.order_items.orderId },
        data: { status: 'refunded', payment_status: 'refunded' },
      });

      // 3. Remove product from user library
      await tx.userLibrary.deleteMany({
        where: {
          user_id: refund.user_id,
          productId: refund.order_items.productId,
        },
      });

      // 4. Create notification for user
      await tx.notification.create({
        data: {
          user_id: refund.user_id,
          type: 'order',
          title: 'Yêu cầu hoàn tiền được chấp nhận',
          message: `Yêu cầu hoàn tiền cho "${refund.order_items.product_name}" đã được chấp nhận.`,
          link_url: '/orders',
        },
      });

      return updated;
    });
  }

  /**
   * Admin: reject a refund.
   */
  async reject(refundId: string, dto: ProcessRefundDto) {
    const refund = await this.prisma.refund.findUnique({ where: { id: refundId } });
    if (!refund) throw new NotFoundException('Refund request not found');
    if (refund.status !== 'pending') {
      throw new BadRequestException('This refund has already been processed');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.refund.update({
        where: { id: refundId },
        data: {
          status: 'rejected',
          admin_notes: dto.adminNotes ?? null,
          processed_at: new Date(),
        },
      });

      // Notify user
      await tx.notification.create({
        data: {
          user_id: refund.user_id,
          type: 'order',
          title: 'Yêu cầu hoàn tiền bị từ chối',
          message: `Yêu cầu hoàn tiền của bạn đã bị từ chối.${dto.adminNotes ? ` Lý do: ${dto.adminNotes}` : ''}`,
          link_url: '/orders',
        },
      });

      return result;
    });

    return updated;
  }
}
