'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { paymentsApi } from '@/lib/api/endpoints';
import type { MockPaymentMethod } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

const PAYMENT_METHODS: { id: MockPaymentMethod; label: string; icon: string; desc: string }[] = [
  { id: 'credit_card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, JCB (Demo)' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', desc: 'Vietcombank, BIDV, Techcombank (Demo)' },
  { id: 'paypal_mock', label: 'PayPal', icon: '🅿️', desc: 'Pay via PayPal (Demo)' },
  { id: 'wallet', label: 'E-Wallet', icon: '👜', desc: 'MoMo, ZaloPay (Demo)' },
];

type CheckoutStep = 'review' | 'payment' | 'success';

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useCart();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const [step, setStep] = useState<CheckoutStep>('review');
  const [selectedMethod, setSelectedMethod] = useState<MockPaymentMethod>('credit_card');
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ transactionId: string; orderId: string } | null>(null);

  if (isLoading) return <div className="py-20 text-center text-neutral-400">Loading cart…</div>;

  if (!items?.length && step !== 'success') {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-neutral-400">Your cart is empty.</p>
        <Link href="/store" className="rounded bg-blue-600 px-6 py-2 text-white">Back to Store</Link>
      </div>
    );
  }

  const subtotal = (items ?? []).reduce((sum, item) => {
    const price = parseFloat(item.product.price);
    const disc = item.product.discountPercent ?? 0;
    return sum + price * (1 - disc / 100);
  }, 0);

  async function handlePlaceOrder() {
    if (!items?.length) return;
    setError(null);
    setIsProcessing(true);
    try {
      // Step 1: Create order
      const order = await createOrder({
        productIds: items.map((i) => i.productId),
        couponCode: couponCode.trim() || undefined,
      });
      if (!order?.id) throw new Error('Failed to create order');

      // Step 2: Mock payment
      const payRes = await paymentsApi.mockPay({ orderId: order.id, method: selectedMethod });
      const payData = payRes.data?.data;
      if (!payData?.success) throw new Error('Payment failed');

      setSuccessData({ transactionId: payData.transactionId, orderId: order.id });
      setStep('success');

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['library'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (err: any) {
      setError(err?.message ?? 'An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  // ─── Success screen ──────────────────────────────────────────────────────────
  if (step === 'success' && successData) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <div className="mb-6 text-6xl">✅</div>
        <h1 className="mb-2 text-2xl font-bold text-green-400">Payment Successful!</h1>
        <p className="mb-1 text-neutral-400">Transaction ID: <span className="font-mono text-white">{successData.transactionId}</span></p>
        <p className="mb-6 text-neutral-400">Order ID: <span className="font-mono text-white">{successData.orderId.slice(0, 8).toUpperCase()}</span></p>
        <p className="mb-8 text-neutral-300">Products have been added to your <strong>Library</strong>.</p>
        <div className="flex justify-center gap-4">
          <Link href="/library" className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-500">
            Go to Library
          </Link>
          <Link href="/store" className="rounded border border-neutral-700 px-6 py-2 text-neutral-300 hover:border-neutral-500">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Payment method */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="mb-4 text-lg font-semibold">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                    selectedMethod === m.id
                      ? 'border-blue-500 bg-blue-950'
                      : 'border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.id}
                    checked={selectedMethod === m.id}
                    onChange={() => setSelectedMethod(m.id)}
                    className="accent-blue-500"
                  />
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <p className="font-medium">{m.label}</p>
                    <p className="text-sm text-neutral-400">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Coupon code */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="mb-4 text-lg font-semibold">Coupon Code</h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter coupon code (optional)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Demo notice */}
          <div className="rounded-lg border border-yellow-800 bg-yellow-950/30 p-4 text-sm text-yellow-300">
            <strong>⚠️ Demo:</strong> This is a test environment. No real transactions occur.
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-3">
              {(items ?? []).map((item) => {
                const price = parseFloat(item.product.price);
                const disc = item.product.discountPercent ?? 0;
                const finalPrice = price * (1 - disc / 100);
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.product.thumbnailUrl && (
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-neutral-800">
                        <Image src={item.product.thumbnailUrl} alt={item.product.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{item.product.name}</p>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {item.product.isFree ? 'Free' : `$${finalPrice.toFixed(2)}`}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t border-neutral-700 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/30 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing || isCreatingOrder}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {isProcessing || isCreatingOrder ? 'Processing…' : `Checkout $${subtotal.toFixed(2)}`}
          </button>

          <Link href="/cart" className="block text-center text-sm text-neutral-400 hover:text-white">
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
