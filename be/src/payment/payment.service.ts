import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) {
        this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY', ''));
    }

    // Stripe payment
    async createStripePaymentIntent(amount: number, currency = 'usd') {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // cents
            currency,
        });
        return { clientSecret: paymentIntent.client_secret };
    }

    async confirmStripePayment(paymentIntentId: string) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        return { status: paymentIntent.status };
    }

    // VNPay payment (mock)
    async createVnpayPaymentUrl(orderId: number, amount: number) {
        const tmnCode = this.config.get<string>('VNPAY_TMN_CODE');
        // In production: generate HMAC-signed URL with all VNPay params
        return {
            paymentUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TmnCode=${tmnCode}&vnp_Amount=${amount * 100}&vnp_TxnRef=${orderId}`,
        };
    }

    // Update order status after payment
    async updateOrderStatus(orderId: number, status: 'COMPLETED' | 'CANCELLED') {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }
}
