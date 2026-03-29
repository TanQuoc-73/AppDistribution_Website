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
    // 1. Fetch order and check status
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.user_id !== userId) throw new ForbiddenException('Not your order');
    if (order.status === 'completed') {
      // Idempotent: already paid, return success
      return { success: true, transactionId: 'ALREADY_PAID', orderId };
    }
    if (order.status === 'cancelled') throw new BadRequestException('Order has been cancelled');

    // 2. Check for existing payment (idempotency)
    const existingPayment = await this.prisma.payment.findFirst({
      where: { orderId, status: 'paid' },
    });
    if (existingPayment) {
      // Idempotent: already paid, return success
      return { success: true, transactionId: existingPayment.transactionId, orderId };
    }

    const transactionId = `MOCK-${randomUUID().split('-')[0].toUpperCase()}`;
    const now = new Date();

    // 3. Transaction: create payment, update order, grant library
    await this.prisma.$transaction(async (tx) => {
      // Record payment (if not exists)
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

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'completed',
          payment_status: 'paid',
          payment_method: method === 'bank_transfer' ? 'bank_transfer' : 'credit_card',
        },
      });

      // Bulk upsert user library (grant access, idempotent)

      await Promise.all(order.orderItems.map(item =>
        tx.userLibrary.upsert({
          where: { user_id_productId: { user_id: userId, productId: item.productId } },
          update: {},
          create: {
            user_id: userId,
            productId: item.productId,
            order_item_id: item.id,
          },
        })
      ));
    });

    return { success: true, transactionId, orderId };
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
