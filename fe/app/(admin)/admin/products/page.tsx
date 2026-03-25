'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { adminApi } from '@/lib/api/endpoints';
import Modal from '@/components/ui/Modal';
import type { Product } from '@/types';

interface PaginatedProducts {
  data: (Product & { is_active?: boolean; is_featured?: boolean })[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const emptyForm = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  thumbnailUrl: '',
  price: 0,
  discountPercent: 0,
  isFree: false,
  ageRating: 'everyone',
  developerId: '',
  releaseDate: '',
  downloadUrl: '',
  versionString: '1.0.0',
  fileSize: '',
};

export default function AdminProductsPage() {
  const [result, setResult] = useState<PaginatedProducts | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [developers, setDevelopers] = useState<{ id: string; name: string }[]>([]);

  const fetchProducts = (p: number) => {
    setLoading(true);
    adminApi
      .getProducts({ page: p, limit: 20 })
      .then((res) => setResult({ data: res.data.data as any, meta: res.data.meta }))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(page); }, [page]);

  useEffect(() => {
    adminApi.getDevelopers()
      .then((res: any) => setDevelopers(res.data?.data ?? res.data ?? []))
      .catch(() => {});
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(p: Product & { is_active?: boolean; is_featured?: boolean }) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription ?? '',
      description: p.description ?? '',
      thumbnailUrl: p.thumbnailUrl ?? '',
      price: Number(p.price),
      discountPercent: Number(p.discountPercent),
      isFree: p.isFree,
      ageRating: p.ageRating ?? 'everyone',
      developerId: p.developerId ?? '',
      releaseDate: p.releaseDate ? p.releaseDate.slice(0, 10) : '',
      downloadUrl: (p as any).versions?.[0]?.downloadUrl ?? '',
      versionString: (p as any).versions?.[0]?.version ?? '',
      fileSize: (p as any).versions?.[0]?.fileSize?.toString() ?? '',
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await adminApi.updateProduct(editingId, {
          name: form.name,
          slug: form.slug,
          shortDescription: form.shortDescription || undefined,
          description: form.description || undefined,
          thumbnailUrl: form.thumbnailUrl || undefined,
          price: form.price,
          discountPercent: form.discountPercent,
          isFree: form.isFree,
          ageRating: form.ageRating,
          developerId: form.developerId || undefined,
          releaseDate: form.releaseDate || undefined,
          downloadUrl: form.downloadUrl || undefined,
          versionString: form.versionString || undefined,
          fileSize: form.fileSize ? Number(form.fileSize) : undefined,
        } as any);
      } else {
        await adminApi.createProduct({
          name: form.name,
          slug: form.slug,
          shortDescription: form.shortDescription || undefined,
          description: form.description || undefined,
          thumbnailUrl: form.thumbnailUrl || undefined,
          price: form.price,
          discountPercent: form.discountPercent,
          isFree: form.isFree,
          ageRating: form.ageRating,
          developerId: form.developerId || undefined,
          releaseDate: form.releaseDate || undefined,
          downloadUrl: form.downloadUrl || undefined,
          versionString: form.versionString || undefined,
          fileSize: form.fileSize ? Number(form.fileSize) : undefined,
        } as any);
      }
      setModalOpen(false);
      fetchProducts(page);
    } catch (err: any) {
      setFormError(err?.message ?? 'An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    try {
      await adminApi.updateProductStatus(id, !currentActive);
      fetchProducts(page);
    } catch {}
  }

  async function handleToggleFeatured(id: string, p: Product & { is_featured?: boolean }) {
    try {
      await adminApi.updateProduct(id, { is_featured: !p.is_featured });
      fetchProducts(page);
    } catch {}
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    try {
      await adminApi.deleteProduct(id);
      fetchProducts(page);
    } catch {}
  }

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-100">Products</h1>
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Developer</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-4 py-3">
                    <div className="h-5 w-full animate-pulse rounded bg-stone-800" />
                  </td>
                </tr>
              ))
            ) : result?.data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                  No products found
                </td>
              </tr>
            ) : (
              result?.data.map((p) => {
                const active = (p as any).is_active !== false;
                const featured = !!(p as any).is_featured;
                return (
                  <tr key={p.id} className="hover:bg-stone-900/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.thumbnailUrl ? (
                          <img src={p.thumbnailUrl} alt="" className="h-8 w-8 rounded object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded bg-stone-800" />
                        )}
                        <div>
                          <span className="font-medium text-stone-200">{p.name}</span>
                          <p className="text-xs text-stone-500 truncate max-w-[200px]">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-400">
                      {(p.developer as any)?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-stone-300">
                      {p.isFree ? 'Free' : `$${Number(p.price).toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(p.id, active)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          active
                            ? 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-900'
                            : 'bg-red-900/60 text-red-300 hover:bg-red-900'
                        }`}
                      >
                        {active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleFeatured(p.id, p)}
                        className={`transition ${featured ? 'text-amber-400' : 'text-stone-600 hover:text-amber-400'}`}
                        title={featured ? 'Unfeature' : 'Set as Featured'}
                      >
                        <Star className={`h-4 w-4 ${featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded p-1.5 text-stone-400 transition hover:bg-amber-900/30 hover:text-amber-300"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="rounded p-1.5 text-stone-400 transition hover:bg-red-900/30 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
          <span className="text-sm text-stone-500">
            {page} / {result.meta.totalPages}
          </span>
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
        title={editingId ? 'Edit Product' : 'Add New Product'}
        wide
      >
        <form
          onSubmit={(e) => { e.preventDefault(); handleSave(); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-stone-400">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-stone-400">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="product-slug"
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Short Description</label>
            <input
              value={form.shortDescription}
              onChange={(e) => set('shortDescription', e.target.value)}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Full Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Thumbnail URL</label>
            <input
              value={form.thumbnailUrl}
              onChange={(e) => set('thumbnailUrl', e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm text-stone-400">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-stone-400">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.discountPercent}
                onChange={(e) => set('discountPercent', parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-stone-400">Age Rating</label>
              <select
                value={form.ageRating}
                onChange={(e) => set('ageRating', e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              >
                <option value="everyone">Everyone</option>
                <option value="teen">Teen</option>
                <option value="mature">Mature</option>
                <option value="adult">Adult</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-stone-400">Developer</label>
              <select
                value={form.developerId}
                onChange={(e) => set('developerId', e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              >
                <option value="">— Select developer —</option>
                {developers.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-stone-400">Release Date</label>
              <input
                type="date"
                value={form.releaseDate}
                onChange={(e) => set('releaseDate', e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={form.isFree}
              onChange={(e) => set('isFree', e.target.checked)}
              className="rounded border-stone-600"
            />
            Free
          </label>

          {/* Download / Version */}
          <div className="border-t border-stone-700 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-stone-300">Download & Version</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm text-stone-400">Download URL</label>
                <input
                  value={form.downloadUrl}
                  onChange={(e) => set('downloadUrl', e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
                />
                <p className="mt-1 text-xs text-stone-500">Google Drive links will be auto-converted to direct download</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-stone-400">Version Number</label>
                  <input
                    value={form.versionString}
                    onChange={(e) => set('versionString', e.target.value)}
                    placeholder="1.0.0"
                    className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-stone-400">File Size (bytes)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.fileSize}
                    onChange={(e) => set('fileSize', e.target.value)}
                    placeholder="52428800"
                    className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
                  />
                </div>
              </div>
            </div>
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
              disabled={saving || !form.name || !form.slug}
              className="rounded-lg bg-amber-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
