'use client';

import { useMyRefunds } from '@/hooks/useRefunds';
import { RotateCcw } from 'lucide-react';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-900/30 text-yellow-400',
  approved: 'bg-green-900/30 text-green-400',
  rejected: 'bg-red-900/30 text-red-400',
};

export default function RefundsPage() {
  const { data: refunds, isLoading } = useMyRefunds();

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <RotateCcw className="h-6 w-6 text-amber-400" />
        <h1 className="text-2xl font-bold text-amber-50">My Refund Requests</h1>
      </div>

      {!refunds?.length ? (
        <div className="rounded-xl border border-amber-900/20 bg-amber-950/10 py-16 text-center">
          <RotateCcw className="mx-auto mb-3 h-10 w-10 text-amber-800/40" />
          <p className="text-amber-400/50">No refund requests.</p>
          <p className="mt-1 text-sm text-amber-400/30">
            You can request refunds from your{' '}
            <Link href="/orders" className="text-amber-400 hover:text-amber-300">order history</Link>.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {refunds.map((r: any) => (
            <div key={r.id} className="rounded-xl border border-amber-900/20 bg-amber-950/15 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-amber-100">
                    {r.order_items?.product_name || 'Product'}
                  </p>
                  <p className="mt-0.5 text-sm text-amber-100/50">{r.reason}</p>
                  <p className="mt-1 text-xs text-amber-400/30">
                    Requested: {new Date(r.requested_at).toLocaleDateString()}
                    {r.processed_at && ` · Processed: ${new Date(r.processed_at).toLocaleDateString()}`}
                  </p>
                  {r.admin_notes && (
                    <p className="mt-1 text-xs text-amber-300/60">Admin notes: {r.admin_notes}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[r.status] || 'text-stone-400'}`}>
                    {r.status}
                  </span>
                  <span className="text-sm font-medium text-amber-300">
                    ${Number(r.order_items?.final_price || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
