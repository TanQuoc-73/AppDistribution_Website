'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/endpoints';
import Modal from '@/components/ui/Modal';
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-900/30 text-yellow-400',
  approved: 'bg-green-900/30 text-green-400',
  rejected: 'bg-red-900/30 text-red-400',
};

export default function AdminRefundsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-refunds', page],
    queryFn: async () => {
      const res = await adminApi.getRefunds({ page, limit: 20 });
      return res.data?.data ?? res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, adminNotes }: { id: string; adminNotes?: string }) => adminApi.approveRefund(id, adminNotes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-refunds'] }),
  });
  const rejectMutation = useMutation({
    mutationFn: ({ id, adminNotes }: { id: string; adminNotes?: string }) => adminApi.rejectRefund(id, adminNotes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-refunds'] }),
  });

  const [modal, setModal] = useState<{ refund: any; action: 'approve' | 'reject' } | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const refunds = data?.data ?? data ?? [];
  const meta = data?.meta;

  function handleProcess() {
    if (!modal) return;
    const fn = modal.action === 'approve' ? approveMutation : rejectMutation;
    fn.mutate({ id: modal.refund.id, adminNotes: adminNotes || undefined }, { onSuccess: () => { setModal(null); setAdminNotes(''); } });
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <RotateCcw className="h-6 w-6 text-amber-400" />
        <h1 className="text-2xl font-bold">Refund Requests</h1>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-stone-500">Loading…</div>
      ) : refunds.length === 0 ? (
        <div className="py-10 text-center text-stone-500">No refund requests.</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-stone-800">
            <table className="w-full text-sm">
              <thead className="bg-stone-900 text-left text-xs text-stone-400">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {refunds.map((r: any) => (
                  <tr key={r.id} className="bg-stone-900/50 transition hover:bg-stone-800/50">
                    <td className="px-4 py-3 text-stone-300">{r.profiles?.username || '—'}</td>
                    <td className="px-4 py-3 text-stone-200">{r.order_items?.product_name || '—'}</td>
                    <td className="px-4 py-3 text-amber-300">${Number(r.order_items?.final_price || 0).toFixed(2)}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-stone-400">{r.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[r.status] || 'text-stone-400'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-400">{new Date(r.requested_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      {r.status === 'pending' && (
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => { setModal({ refund: r, action: 'approve' }); setAdminNotes(''); }}
                            className="rounded p-1 text-green-400 transition hover:bg-green-900/20"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => { setModal({ refund: r, action: 'reject' }); setAdminNotes(''); }}
                            className="rounded p-1 text-red-400 transition hover:bg-red-900/20"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: meta.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`rounded px-3 py-1 text-sm ${page === i + 1 ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal ? `${modal.action === 'approve' ? 'Approve' : 'Reject'} Refund` : ''}
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-stone-800/50 p-3 text-sm">
            <p className="text-stone-400">Product: <span className="text-stone-200">{modal?.refund?.order_items?.product_name}</span></p>
            <p className="text-stone-400">Amount: <span className="text-amber-300">${Number(modal?.refund?.order_items?.final_price || 0).toFixed(2)}</span></p>
            <p className="mt-1 text-stone-400">Reason: <span className="text-stone-200">{modal?.refund?.reason}</span></p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Admin Notes (optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600"
              placeholder="Notes about this decision..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold text-white transition disabled:opacity-50 ${
                modal?.action === 'approve' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              {modal?.action === 'approve' ? 'Approve Refund' : 'Reject Refund'}
            </button>
            <button onClick={() => setModal(null)} className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-400 hover:text-stone-200">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
