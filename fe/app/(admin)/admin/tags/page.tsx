'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi, adminApi } from '@/lib/api/endpoints';
import Modal from '@/components/ui/Modal';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

export default function AdminTagsPage() {
  const queryClient = useQueryClient();
  const { data: tagsData, isLoading } = useQuery({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const res = await tagsApi.getAll();
      return res.data?.data?.data ?? res.data?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; slug: string }) => adminApi.createTag(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tags'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; slug?: string }) => adminApi.updateTag(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tags'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteTag(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tags'] }),
  });

  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; tag?: any } | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  function openCreate() {
    setName(''); setSlug('');
    setModal({ mode: 'create' });
  }
  function openEdit(tag: any) {
    setName(tag.name); setSlug(tag.slug);
    setModal({ mode: 'edit', tag });
  }
  function handleSubmit() {
    if (modal?.mode === 'create') {
      createMutation.mutate({ name, slug }, { onSuccess: () => setModal(null) });
    } else if (modal?.mode === 'edit') {
      updateMutation.mutate({ id: modal.tag.id, name, slug }, { onSuccess: () => setModal(null) });
    }
  }

  const tags = tagsData ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tags</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500">
          <Plus className="h-4 w-4" /> Create Tag
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-stone-500">Loading…</div>
      ) : tags.length === 0 ? (
        <div className="py-10 text-center text-stone-500">No tags found.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-800">
          <table className="w-full text-sm">
            <thead className="bg-stone-900 text-left text-xs text-stone-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {tags.map((tag: any) => (
                <tr key={tag.id} className="bg-stone-900/50 transition hover:bg-stone-800/50">
                  <td className="px-4 py-3 font-medium text-stone-200">
                    <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-amber-500" />{tag.name}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-400">{tag.slug}</td>
                  <td className="px-4 py-3 text-stone-400">{tag._count?.products ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(tag)} className="mr-2 rounded p-1 text-stone-400 transition hover:text-amber-400">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { if (confirm(`Delete tag "${tag.name}"?`)) deleteMutation.mutate(tag.id); }}
                      className="rounded p-1 text-stone-400 transition hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'create' ? 'Create Tag' : 'Edit Tag'}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Name</label>
            <input value={name} onChange={(e) => { setName(e.target.value); if (modal?.mode === 'create') setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')); }} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-300">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-600" />
          </div>
          <button onClick={handleSubmit} disabled={!name || !slug} className="w-full rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50">
            {modal?.mode === 'create' ? 'Create' : 'Update'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
