import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards.js';
import { PaymentService } from './payment.service.js';

@ApiTags('Payment')
@Controller('payment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post('stripe/create-intent')
    @ApiOperation({ summary: 'Create Stripe payment intent' })
    createStripeIntent(@Body() body: { amount: number; currency?: string }) {
        return this.paymentService.createStripePaymentIntent(body.amount, body.currency);
    }

    @Post('stripe/confirm')
    @ApiOperation({ summary: 'Confirm Stripe payment' })
    confirmStripe(@Body() body: { paymentIntentId: string }) {
        return this.paymentService.confirmStripePayment(body.paymentIntentId);
    }

    @Post('vnpay/create-url')
    @ApiOperation({ summary: 'Create VNPay payment URL' })
    createVnpayUrl(@Body() body: { orderId: string; amount: number }) {
        return this.paymentService.createVnpayPaymentUrl(body.orderId, body.amount);
    }

    @Post('order/:id/status')
    @ApiOperation({ summary: 'Update order status after payment' })
    updateStatus(
        @Param('id') id: string,
        @Body() body: { status: 'COMPLETED' | 'CANCELLED' },
    ) {
        return this.paymentService.updateOrderStatus(id, body.status);
    }
}
