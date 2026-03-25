import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { randomUUID } from 'crypto';

export type MockPaymentMethod = 'bank_transfer' | 'credit_card' | 'paypal_mock' | 'wallet';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Thanh toán giả lập: luôn thành công, cập nhật đơn hàng và thêm sản phẩm vào thư viện.
   */
  async mockPay(userId: string, orderId: string, method: MockPaymentMethod) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.user_id !== userId) throw new ForbiddenException('Not your order');
    if (order.status === 'completed') throw new BadRequestException('Order already paid');
    if (order.status === 'cancelled') throw new BadRequestException('Order has been cancelled');

    const transactionId = `MOCK-${randomUUID().split('-')[0].toUpperCase()}`;
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      // 1. Record payment
      await tx.payment.create({
        data: {
          orderId,
          gateway: `mock_${method}`,
          amount: order.totalPrice,
          currency: 'USD',
          status: 'paid',
          transactionId,
          paidAt: now,
          gateway_response: { mock: true, method, processedAt: now.toISOString() },
        },
      });

      // 2. Update order status  
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'completed',
          payment_status: 'paid',
          payment_method: method === 'bank_transfer' ? 'bank_transfer' : 'credit_card',
        },
      });

      // 3. Add each product to user's library (skip if already owned)
      for (const item of order.orderItems) {
        await tx.userLibrary.upsert({
          where: { user_id_productId: { user_id: userId, productId: item.productId } },
          create: {
            user_id: userId,
            productId: item.productId,
            order_item_id: item.id,
          },
          update: {},
        });
      }

      // 4. Create purchase notification
      await tx.notification.create({
        data: {
          user_id: userId,
          type: 'order',
          title: 'Thanh toán thành công',
          message: `Đơn hàng #${orderId.slice(0, 8).toUpperCase()} đã được xử lý. Bạn có thể tải về từ thư viện.`,
          link_url: `/library`,
        },
      });

      return { success: true, transactionId, orderId, paidAt: now };
    });
  }

  async getByOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, user_id: userId },
      select: { id: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
