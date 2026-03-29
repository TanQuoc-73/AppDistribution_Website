'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/endpoints';
import Modal from '@/components/ui/Modal';
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react';

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons', page],
    queryFn: async () => {
      const res = await adminApi.getCoupons({ page, limit: 20 });
      return res.data?.data ?? res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (d: any) => adminApi.createCoupon(d),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...d }: any) => adminApi.updateCoupon(id, d),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteCoupon(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }),
  });

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    code: '', description: '', discountType: 'percentage' as string,
    discountValue: 10, minOrderValue: 0, maxDiscount: 0,
    maxUses: 0, isActive: true, validFrom: '', validUntil: '',
  });

  const coupons = data?.data ?? data ?? [];
  const meta = data?.meta;

  function openCreate() {
    setForm({ code: '', description: '', discountType: 'percentage', discountValue: 10, minOrderValue: 0, maxDiscount: 0, maxUses: 0, isActive: true, validFrom: '', validUntil: '' });
    setModal('create');
  }
  function openEdit(c: any) {
    setForm({
      code: c.code, description: c.description || '', discountType: c.discount_type,
      discountValue: Number(c.discountValue), minOrderValue: Number(c.min_order_value || 0),
      maxDiscount: Number(c.max_discount || 0), maxUses: c.max_uses || 0,
      isActive: c.isActive, validFrom: c.validFrom?.slice(0, 10) || '',
      validUntil: c.validUntil?.slice(0, 10) || '',
    });
    setEditing(c);
    setModal('edit');
  }
  function handleSubmit() {
    const payload: any = {
      code: form.code, description: form.description || undefined,
      discountType: form.discountType, discountValue: form.discountValue,
      minOrderValue: form.minOrderValue || undefined,
      maxDiscount: form.maxDiscount || undefined,
      maxUses: form.maxUses || undefined, isActive: form.isActive,
      validFrom: form.validFrom || undefined, validUntil: form.validUntil || undefined,
    };
    if (modal === 'create') {
      createMutation.mutate(payload, { onSuccess: () => setModal(null) });
    } else {
      updateMutation.mutate({ id: editing.id, ...payload }, { onSuccess: () => setModal(null) });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500">
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-stone-500">Loading…</div>
      ) : coupons.length === 0 ? (
        <div className="py-10 text-center text-stone-500">No coupons found.</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-stone-800">
            <table className="w-full text-sm">
              <thead className="bg-stone-900 text-left text-xs text-stone-400">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Used</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Valid Until</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {coupons.map((c: any) => (
                  <tr key={c.id} className="bg-stone-900/50 transition hover:bg-stone-800/50">
                    <td className="px-4 py-3 font-mono font-medium text-amber-300">{c.code}</td>
                    <td className="px-4 py-3 capitalize text-stone-300">{c.discount_type}</td>
                    <td className="px-4 py-3 text-stone-300">
                      {c.discount_type === 'percentage' ? `${c.discountValue}%` : `$${Number(c.discountValue).toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3 text-stone-400">{c.usedCount}{c.max_uses ? `/${c.max_uses}` : ''}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-400">{c.validUntil ? new Date(c.validUntil).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(c)} className="mr-2 rounded p-1 text-stone-400 transition hover:text-amber-400"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm(`Delete coupon "${c.code}"?`)) deleteMutation.mutate(c.id); }} className="rounded p-1 text-stone-400 transition hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
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

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Create Coupon' : 'Edit Coupon'} wide>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Code</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Discount Type</label>
            <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Discount Value</label>
            <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Max Discount ($)</label>
            <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Min Order Value ($)</label>
            <input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Max Uses (0=unlimited)</label>
            <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Valid From</label>
            <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Valid Until</label>
            <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600" />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-300">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600" />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-amber-500" />
            <label className="text-sm text-stone-300">Active</label>
          </div>
          <div className="col-span-2">
            <button onClick={handleSubmit} disabled={!form.code || !form.discountValue} className="w-full rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50">
              {modal === 'create' ? 'Create Coupon' : 'Update Coupon'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
