'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Globe, EyeOff } from 'lucide-react';
import { adminApi } from '@/lib/api/endpoints';
import Modal from '@/components/ui/Modal';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

interface PaginatedNews {
  data: NewsItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  cover_image: '',
  content: '',
  isPublished: true,
};

export default function AdminNewsPage() {
  const [result, setResult] = useState<PaginatedNews | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchNews = (p: number) => {
    setLoading(true);
    adminApi
      .getNews({ page: p, limit: 20 })
      .then((res: any) => setResult({ data: res.data.data, meta: res.data.meta }))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNews(page); }, [page]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(item: NewsItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt ?? '',
      cover_image: item.cover_image ?? '',
      content: '',
      isPublished: item.isPublished,
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
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt || undefined,
        cover_image: form.cover_image || undefined,
        isPublished: form.isPublished,
      };
      if (editingId) {
        await adminApi.updateNews(editingId, payload);
      } else {
        await adminApi.createNews(payload);
      }
      setModalOpen(false);
      fetchNews(page);
    } catch (err: any) {
      setFormError(err?.message ?? 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(item: NewsItem) {
    try {
      await adminApi.updateNews(item.id, { isPublished: !item.isPublished });
      fetchNews(page);
    } catch {}
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Xoá bài viết "${title}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await adminApi.deleteNews(id);
      fetchNews(page);
    } catch {}
  }

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-100">News</h1>
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
              <th className="px-4 py-3">Tiêu đề</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
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
                  Chưa có bài viết nào
                </td>
              </tr>
            ) : (
              result?.data.map((item) => (
                <tr key={item.id} className="hover:bg-stone-900/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.cover_image ? (
                        <img src={item.cover_image} alt="" className="h-8 w-12 rounded object-cover" />
                      ) : (
                        <div className="h-8 w-12 rounded bg-stone-800" />
                      )}
                      <span className="font-medium text-stone-200 truncate max-w-[240px]">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-xs">{item.slug}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                        item.isPublished
                          ? 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-stone-700 text-stone-400 hover:bg-stone-600'
                      }`}
                    >
                      {item.isPublished ? <><Globe className="h-3 w-3" /> Published</> : <><EyeOff className="h-3 w-3" /> Draft</>}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded p-1.5 text-stone-400 transition hover:bg-amber-900/30 hover:text-amber-300"
                        title="Sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="rounded p-1.5 text-stone-400 transition hover:bg-red-900/30 hover:text-red-400"
                        title="Xoá"
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

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        wide
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-stone-400">Tiêu đề *</label>
              <input
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-stone-400">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="tieu-de-bai-viet"
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Ảnh bìa (URL)</label>
            <input
              value={form.cover_image}
              onChange={(e) => set('cover_image', e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Mô tả ngắn</label>
            <input
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Nội dung {!editingId && '*'}</label>
            <textarea
              required={!editingId}
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={6}
              placeholder={editingId ? 'Để trống nếu không muốn thay đổi nội dung' : ''}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={form.isPublished}
              onChange={(e) => set('isPublished', e.target.checked)}
              className="h-4 w-4 rounded border-stone-600 bg-stone-800 accent-amber-500"
            />
            <label htmlFor="isPublished" className="text-sm text-stone-300">Xuất bản ngay</label>
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
              Huỷ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
