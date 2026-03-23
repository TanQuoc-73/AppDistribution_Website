'use client';

import { useOrder } from '@/hooks/useOrders';

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: Props) {
  // unwrap params via React.use() — ok in client component
  const { id } = (params as unknown as { id: string });
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <div className="py-20 text-center text-neutral-400">Loading…</div>;
  if (!order) return <div className="py-20 text-center text-neutral-400">Order not found.</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Order Details</h1>
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
        <p className="mb-1 text-sm text-neutral-400">Order ID</p>
        <p className="mb-4 font-mono text-white">{order.id}</p>

        <p className="mb-1 text-sm text-neutral-400">Status</p>
        <p className="mb-4 capitalize text-white">{order.status}</p>

        <p className="mb-1 text-sm text-neutral-400">Items</p>
        <ul className="mb-4 space-y-1">
          {order.orderItems?.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-neutral-300">{item.product?.name ?? item.productId}</span>
              <span className="text-white">${parseFloat(item.priceAtOrder).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-neutral-700 pt-3 text-right">
          <p className="text-neutral-400 text-sm">
            Discount: -${parseFloat(order.discountAmount).toFixed(2)}
          </p>
          <p className="text-lg font-bold text-white">
            Total: ${parseFloat(order.totalPrice).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
