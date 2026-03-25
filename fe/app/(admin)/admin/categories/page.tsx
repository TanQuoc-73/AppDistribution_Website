'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, ChevronRight } from 'lucide-react';
import { categoriesApi } from '@/lib/api/endpoints';
import Modal from '@/components/ui/Modal';
import type { Category } from '@/types';

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  iconUrl: '',
  parentId: '',
  sort_order: 0,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCategories = () => {
    setLoading(true);
    categoriesApi
      .getFlat()
      .then((res) => setCategories(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  function openCreate() {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditTarget(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      iconUrl: cat.iconUrl ?? '',
      parentId: cat.parentId ?? '',
      sort_order: (cat as any).sort_order ?? 0,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        iconUrl: form.iconUrl.trim() || undefined,
        parentId: form.parentId.trim() || undefined,
        sort_order: Number(form.sort_order),
      };
      if (editTarget) {
        await categoriesApi.update(editTarget.id, payload);
      } else {
        await categoriesApi.create(payload);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'An error occurred';
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"? This action cannot be undone.`)) return;
    try {
      await categoriesApi.remove(cat.id);
      fetchCategories();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Cannot delete';
      alert(msg);
    }
  }

  // Build parent name lookup
  const parentMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const rootCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.filter((c) => !!c.parentId);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-100">Categories</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-stone-800" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 py-16 text-center text-stone-500">
          No categories yet.{' '}
          <button onClick={openCreate} className="text-amber-400 hover:underline">Create now</button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-800">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-800 bg-stone-900/80 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {/* Root categories first, then children indented */}
              {rootCategories.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  parentName={null}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
              {childCategories.map((child) => (
                <CategoryRow
                  key={child.id}
                  cat={child}
                  parentName={parentMap[child.parentId!] ?? '?'}
                  indented
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Category' : 'Add New Category'}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); handleSave(); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-stone-400">Name *</label>
              <input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    slug: f.slug === slugify(f.name) ? slugify(name) : f.slug,
                  }));
                }}
                required
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-stone-400">Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
                placeholder="games, productivity…"
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-stone-400">Icon URL</label>
              <input
                value={form.iconUrl}
                onChange={(e) => setForm((f) => ({ ...f, iconUrl: e.target.value }))}
                placeholder="https://…"
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-stone-400">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">Parent Category</label>
            <select
              value={form.parentId}
              onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            >
              <option value="">— None (root) —</option>
              {rootCategories
                .filter((c) => c.id !== editTarget?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
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
              className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60"
            >
              {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function CategoryRow({
  cat,
  parentName,
  indented = false,
  onEdit,
  onDelete,
}: {
  cat: Category;
  parentName: string | null;
  indented?: boolean;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}) {
  return (
    <tr className="hover:bg-stone-900/40">
      <td className="px-4 py-3">
        <div className={`flex items-center gap-1.5 ${indented ? 'pl-5' : ''}`}>
          {indented && <ChevronRight className="h-3.5 w-3.5 text-stone-600" />}
          <span className="font-medium text-stone-200">{cat.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-stone-500">{cat.slug}</td>
      <td className="px-4 py-3 text-stone-400">{parentName ?? <span className="text-stone-600">—</span>}</td>
      <td className="px-4 py-3 text-stone-500">{(cat as any).sort_order ?? 0}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(cat)}
            className="rounded p-1.5 text-stone-400 transition hover:bg-amber-900/30 hover:text-amber-300"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(cat)}
            className="rounded p-1.5 text-stone-400 transition hover:bg-red-900/30 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
