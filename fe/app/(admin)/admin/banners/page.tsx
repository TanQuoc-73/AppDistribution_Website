'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/api/endpoints';
import Modal from '@/components/ui/Modal';

interface BannerItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface PaginatedBanners {
  data: BannerItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const emptyForm = {
  title: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: 0,
  isActive: true,
};

export default function AdminBannersPage() {
  const [result, setResult] = useState<PaginatedBanners | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchBanners = (p: number) => {
    setLoading(true);
    adminApi
      .getBanners({ page: p, limit: 20 })
      .then((res: any) => setResult({ data: res.data.data, meta: res.data.meta }))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(page); }, [page]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(item: BannerItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl ?? '',
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        title: form.title,
        imageUrl: form.imageUrl,
        linkUrl: form.linkUrl || undefined,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      };
      if (editingId) {
        await adminApi.updateBanner(editingId, payload);
      } else {
        await adminApi.createBanner(payload);
      }
      setModalOpen(false);
      fetchBanners(page);
    } catch (err: any) {
      setFormError(err?.message ?? 'An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(item: BannerItem) {
    try {
      await adminApi.updateBanner(item.id, { isActive: !item.isActive });
      fetchBanners(page);
    } catch {}
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete banner "${title}"? This action cannot be undone.`)) return;
    try {
      await adminApi.deleteBanner(id);
      fetchBanners(page);
    } catch {}
  }

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-100">Banners</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">{result?.meta.total ?? 0} total</span>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500"
          >
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-800">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-800 bg-stone-900/80 text-left text-stone-400">
            <tr>
              <th className="px-4 py-3">Banner</th>
              <th className="px-4 py-3">Link</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-4 py-3">
                    <div className="h-5 w-full animate-pulse rounded bg-stone-800" />
                  </td>
                </tr>
              ))
            ) : result?.data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                  No banners yet
                </td>
              </tr>
            ) : (
              result?.data.map((item) => (
                <tr key={item.id} className="hover:bg-stone-900/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-10 w-20 rounded object-cover bg-stone-800"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="font-medium text-stone-200">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-xs truncate max-w-[180px]">
                    {item.linkUrl ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-stone-400">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        item.isActive
                          ? 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-red-900/60 text-red-300 hover:bg-red-900'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded p-1.5 text-stone-400 transition hover:bg-amber-900/30 hover:text-amber-300"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="rounded p-1.5 text-stone-400 transition hover:bg-red-900/30 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
            Previous
          </button>
          <span className="text-sm text-stone-500">{page} / {result.meta.totalPages}</span>
          <button
            disabled={page >= result.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-stone-700 px-3 py-1.5 text-sm text-stone-300 transition hover:bg-stone-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Banner' : 'Add New Banner'}
        wide
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-stone-400">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Image URL *</label>
            <input
              required
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Preview" className="mt-2 h-20 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Link URL</label>
            <input
              value={form.linkUrl}
              onChange={(e) => set('linkUrl', e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Display Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set('sortOrder', Number(e.target.value))}
              min={0}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActiveBanner"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-stone-600 bg-stone-800 accent-amber-500"
            />
            <label htmlFor="isActiveBanner" className="text-sm text-stone-300">Active</label>
          </div>

          {formError && (
            <p className="rounded-lg border border-red-800 bg-red-900/40 px-3 py-2 text-sm text-red-300">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-300 transition hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
