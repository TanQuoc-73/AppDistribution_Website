'use client';

import { useState } from 'react';
import { useOrder } from '@/hooks/useOrders';
import { useRequestRefund } from '@/hooks/useRefunds';
import Modal from '@/components/ui/Modal';

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = (params as unknown as { id: string });
  const { data: order, isLoading } = useOrder(id);
  const { mutate: requestRefund, isPending: isRefunding } = useRequestRefund();

  const [refundModal, setRefundModal] = useState<{ itemId: string; productName: string } | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundSuccess, setRefundSuccess] = useState(false);

  if (isLoading) return <div className="py-20 text-center text-neutral-400">Loading…</div>;
  if (!order) return <div className="py-20 text-center text-neutral-400">Order not found.</div>;

  const canRefund = order.status === 'completed';

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-amber-50">Order Details</h1>
      <div className="rounded-xl border border-amber-900/20 bg-amber-950/15 p-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-amber-400/50">Order ID</p>
            <p className="font-mono text-sm text-amber-50">{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-amber-400/50">Status</p>
            <p className="text-sm font-medium capitalize text-amber-50">{order.status}</p>
          </div>
          <div>
            <p className="text-xs text-amber-400/50">Date</p>
            <p className="text-sm text-amber-50">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <h2 className="mb-2 text-sm font-semibold text-amber-200">Items</h2>
        <div className="space-y-2">
          {order.orderItems?.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-amber-900/15 bg-amber-950/10 p-3">
              <div>
                <p className="text-sm font-medium text-amber-100">{(item as any).product_name || item.product?.name || item.productId}</p>
                <p className="text-xs text-amber-400/50">${parseFloat((item as any).final_price || item.priceAtOrder).toFixed(2)}</p>
              </div>
              {canRefund && (
                <button
                  onClick={() => setRefundModal({ itemId: item.id, productName: (item as any).product_name || item.product?.name || 'Product' })}
                  className="rounded-lg border border-red-800/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-950/20"
                >
                  Request Refund
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-amber-900/20 pt-3 text-right space-y-1">
          <p className="text-sm text-amber-400/50">
            Discount: -${parseFloat(order.discountAmount).toFixed(2)}
          </p>
          <p className="text-lg font-bold text-amber-50">
            Total: ${parseFloat(order.totalPrice).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Refund modal */}
      <Modal
        open={!!refundModal}
        onClose={() => { setRefundModal(null); setRefundReason(''); setRefundSuccess(false); }}
        title={refundSuccess ? 'Refund Requested' : `Request Refund — ${refundModal?.productName}`}
      >
        {refundSuccess ? (
          <div className="text-center py-4">
            <p className="text-green-400 mb-2">✓ Your refund request has been submitted.</p>
            <p className="text-sm text-stone-400">Our team will review your request and get back to you.</p>
            <button
              onClick={() => { setRefundModal(null); setRefundSuccess(false); }}
              className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-300">Reason for refund</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={4}
                placeholder="Please explain why you want a refund..."
                className="w-full resize-none rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white placeholder-stone-500 outline-none focus:border-amber-600"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!refundModal || !refundReason.trim()) return;
                  requestRefund(
                    { orderItemId: refundModal.itemId, reason: refundReason },
                    { onSuccess: () => setRefundSuccess(true) },
                  );
                }}
                disabled={isRefunding || !refundReason.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {isRefunding ? 'Submitting...' : 'Submit Refund Request'}
              </button>
              <button
                onClick={() => { setRefundModal(null); setRefundReason(''); }}
                className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-400 transition hover:text-stone-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
