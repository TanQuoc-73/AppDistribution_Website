'use client';

import { useMyOrders } from '@/hooks/useOrders';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  completed: 'text-green-400',
  pending: 'text-yellow-400',
  cancelled: 'text-red-400',
  refunded: 'text-neutral-400',
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) return <div className="py-20 text-center text-neutral-400">Loading orders…</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>

      {!orders?.length ? (
        <p className="text-neutral-400">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition hover:border-neutral-600"
            >
              <div>
                <p className="font-mono text-sm text-neutral-300">{order.id.slice(0, 8)}…</p>
                <p className="text-sm text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold capitalize ${statusColors[order.status]}`}>
                  {order.status}
                </p>
                <p className="text-white">${parseFloat(order.totalPrice).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
