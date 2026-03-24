'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { adminApi } from '@/lib/api/endpoints';
import Modal from '@/components/ui/Modal';
import type { Order } from '@/types';

interface PaginatedOrders {
  data: (Order & { profiles?: { id: string; username: string; avatarUrl?: string } })[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface OrderDetailItem {
  id: string;
  quantity: number;
  unitPrice: string;
  product?: { id: string; name: string; slug: string; thumbnailUrl?: string };
}

interface OrderDetail {
  id: string;
  status: string;
  totalPrice: string;
  createdAt: string;
  profiles?: { id: string; username: string; avatarUrl?: string };
  orderItems: OrderDetailItem[];
}

const statusColors: Record<string, string> = {
  pending:   'bg-amber-900/60 text-amber-300',
  completed: 'bg-emerald-900/60 text-emerald-300',
  cancelled: 'bg-stone-700 text-stone-300',
  refunded:  'bg-blue-900/60 text-blue-300',
};

export default function AdminOrdersPage() {
  const [result, setResult] = useState<PaginatedOrders | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOrders = (p: number) => {
    setLoading(true);
    adminApi
      .getOrders({ page: p, limit: 20 })
      .then((res) => setResult({ data: res.data.data as any, meta: res.data.meta }))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  async function handleStatusChange(id: string, status: string) {
    try {
      await adminApi.updateOrderStatus(id, status);
      fetchOrders(page);
      if (detail?.id === id) setDetail((d) => d ? { ...d, status: status as any } : null);
    } catch {}
  }

  async function openDetail(id: string) {
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await adminApi.getOrderDetail(id);
      setDetail((res.data.data ?? res.data) as unknown as OrderDetail);
    } catch {
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-100">Orders</h1>
        <span className="text-sm text-stone-500">{result?.meta.total ?? 0} total</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-800">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-800 bg-stone-900/80 text-left text-stone-400">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Người mua</th>
              <th className="px-4 py-3">Sản phẩm</th>
              <th className="px-4 py-3">Tổng</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-3">
                    <div className="h-5 w-full animate-pulse rounded bg-stone-800" />
                  </td>
                </tr>
              ))
            ) : result?.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                  Không có đơn hàng
                </td>
              </tr>
            ) : (
              result?.data.map((o) => (
                <tr key={o.id} className="hover:bg-stone-900/40">
                  <td className="px-4 py-3 font-mono text-xs text-stone-400">
                    {o.id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3 text-stone-300">
                    {(o as any).profiles?.username ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-stone-400">
                    {o.orderItems?.length ?? (o as any)._count?.orderItems ?? 0}
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-200">
                    ${Number(o.totalPrice).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="rounded border border-stone-700 bg-stone-800 px-2 py-1 text-xs text-stone-200 outline-none"
                    >
                      {(['pending', 'completed', 'cancelled', 'refunded'] as const).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-xs">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openDetail(o.id)}
                      className="rounded p-1.5 text-stone-400 transition hover:bg-amber-900/30 hover:text-amber-300"
                      title="Chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {result && result.meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-stone-700 px-3 py-1.5 text-sm text-stone-300 transition hover:bg-stone-800 disabled:opacity-40"
          >
            Trước
          </button>
          <span className="text-sm text-stone-500">{page} / {result.meta.totalPages}</span>
          <button
            disabled={page >= result.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-stone-700 px-3 py-1.5 text-sm text-stone-300 transition hover:bg-stone-800 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        open={detailLoading || !!detail}
        onClose={() => { setDetail(null); setDetailLoading(false); }}
        title="Chi tiết đơn hàng"
        wide
      >
        {detailLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </div>
        ) : detail ? (
          <div className="space-y-5">
            {/* Header info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-stone-500">ID:</span>
                <span className="ml-2 font-mono text-stone-300">{detail.id}</span>
              </div>
              <div>
                <span className="text-stone-500">Trạng thái:</span>
                <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[detail.status] ?? ''}`}>
                  {detail.status}
                </span>
              </div>
              <div>
                <span className="text-stone-500">Người mua:</span>
                <span className="ml-2 text-stone-200">
                  {detail.profiles?.username ?? '—'}
                </span>
              </div>
              <div>
                <span className="text-stone-500">Ngày tạo:</span>
                <span className="ml-2 text-stone-300">{new Date(detail.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Items list */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-stone-300">Sản phẩm ({detail.orderItems.length})</h3>
              <div className="divide-y divide-stone-800 rounded-lg border border-stone-800">
                {detail.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-4 py-3">
                    {item.product?.thumbnailUrl ? (
                      <img src={item.product.thumbnailUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-800 text-xs text-stone-500">N/A</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-stone-200">{item.product?.name ?? 'Deleted product'}</p>
                      <p className="text-xs text-stone-500">{item.product?.slug ?? ''}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-stone-300">x{item.quantity}</p>
                      <p className="text-stone-400">${Number(item.unitPrice).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-end border-t border-stone-800 pt-4 text-lg">
              <span className="mr-4 text-stone-400">Tổng cộng:</span>
              <span className="font-bold text-amber-400">${Number(detail.totalPrice).toFixed(2)}</span>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
