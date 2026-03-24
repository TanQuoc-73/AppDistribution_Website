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
};

export default function AdminProductsPage() {
  const [result, setResult] = useState<PaginatedProducts | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = (p: number) => {
    setLoading(true);
    adminApi
      .getProducts({ page: p, limit: 20 })
      .then((res) => setResult({ data: res.data.data as any, meta: res.data.meta }))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(page); }, [page]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
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
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
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
        });
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
        });
      }
      setModalOpen(false);
      fetchProducts(page);
    } catch {
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
    if (!confirm(`Xoá "${name}"? Hành động này không thể hoàn tác.`)) return;
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
            <Plus className="h-4 w-4" /> Thêm mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-800">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-800 bg-stone-900/80 text-left text-stone-400">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Developer</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
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
                  Không có sản phẩm
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
                      {p.isFree ? 'Miễn phí' : `$${Number(p.price).toFixed(2)}`}
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
                        title={featured ? 'Bỏ featured' : 'Đặt featured'}
                      >
                        <Star className={`h-4 w-4 ${featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded p-1.5 text-stone-400 transition hover:bg-amber-900/30 hover:text-amber-300"
                          title="Sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="rounded p-1.5 text-stone-400 transition hover:bg-red-900/30 hover:text-red-400"
                          title="Xoá"
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
            Trước
          </button>
          <span className="text-sm text-stone-500">
            {page} / {result.meta.totalPages}
          </span>
          <button
            disabled={page >= result.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-stone-700 px-3 py-1.5 text-sm text-stone-300 transition hover:bg-stone-800 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        wide
      >
        <form
          onSubmit={(e) => { e.preventDefault(); handleSave(); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-stone-400">Tên *</label>
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
                placeholder="ten-san-pham"
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Mô tả ngắn</label>
            <input
              value={form.shortDescription}
              onChange={(e) => set('shortDescription', e.target.value)}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Mô tả chi tiết</label>
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
              <label className="mb-1 block text-sm text-stone-400">Giá ($)</label>
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
              <label className="mb-1 block text-sm text-stone-400">Giảm giá (%)</label>
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
              <label className="mb-1 block text-sm text-stone-400">Độ tuổi</label>
              <select
                value={form.ageRating}
                onChange={(e) => set('ageRating', e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              >
                <option value="everyone">Everyone</option>
                <option value="teen">Teen</option>
                <option value="mature">Mature</option>
                <option value="adults_only">Adults Only</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={form.isFree}
              onChange={(e) => set('isFree', e.target.checked)}
              className="rounded border-stone-600"
            />
            Miễn phí
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-300 transition hover:bg-stone-800"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={saving || !form.name || !form.slug}
              className="rounded-lg bg-amber-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              {saving ? 'Đang lưu…' : editingId ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
