'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { developerApi, categoriesApi, tagsApi } from '@/lib/api/endpoints';
import Link from 'next/link';

const AGE_RATINGS = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'teen', label: 'Teen (13+)' },
  { value: 'mature', label: 'Mature (17+)' },
  { value: 'adults_only', label: 'Adults Only (18+)' },
];

const emptyForm = {
  name: '',
  shortDescription: '',
  description: '',
  thumbnailUrl: '',
  price: 0,
  discountPercent: 0,
  isFree: false,
  ageRating: 'everyone',
  releaseDate: '',
  categoryIds: [] as string[],
  tagIds: [] as string[],
  downloadUrl: '',
  versionString: '1.0.0',
  fileSize: '',
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoriesApi.getFlat();
      return (res.data?.data ?? []) as any[];
    },
  });

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await tagsApi.getAll();
      return (res.data?.data ?? []) as any[];
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => developerApi.createProduct({
      ...form,
      price: Number(form.price),
      discountPercent: Number(form.discountPercent),
      categoryIds: form.categoryIds,
      tagIds: form.tagIds,
      downloadUrl: form.downloadUrl || undefined,
      versionString: form.versionString || undefined,
      fileSize: form.fileSize ? Number(form.fileSize) : undefined,
    } as any),
    onSuccess: (res: any) => {
      const id = res.data?.data?.id ?? res.data?.id;
      if (id) router.push(`/developer/products/${id}`);
      else router.push('/developer/products');
    },
    onError: (err: any) => setError(err?.message ?? 'Failed to create product'),
  });

  function set(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleList(field: 'categoryIds' | 'tagIds', id: string) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(id) ? f[field].filter((x) => x !== id) : [...f[field], id],
    }));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/developer/products" className="text-neutral-400 hover:text-white">←</Link>
        <h1 className="text-2xl font-bold">Create New Product</h1>
      </div>

      <div className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium">Product Name *</label>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Product name"
          />
        </div>

        {/* Short description */}
        <div>
          <label className="mb-1 block text-sm font-medium">Short Description</label>
          <input
            value={form.shortDescription}
            onChange={(e) => set('shortDescription', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Brief description"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium">Detailed Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Full product description…"
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="mb-1 block text-sm font-medium">Thumbnail URL</label>
          <input
            value={form.thumbnailUrl}
            onChange={(e) => set('thumbnailUrl', e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            placeholder="https://..."
          />
        </div>

        {/* Price + discount + free toggle */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.isFree ? 0 : form.price}
              disabled={form.isFree}
              onChange={(e) => set('price', e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.discountPercent}
              onChange={(e) => set('discountPercent', e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={(e) => set('isFree', e.target.checked)}
                className="accent-blue-500"
              />
              Free
            </label>
          </div>
        </div>

        {/* Age rating + release date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Age Rating</label>
            <select
              value={form.ageRating}
              onChange={(e) => set('ageRating', e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              {AGE_RATINGS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Release Date</label>
            <input
              type="date"
              value={form.releaseDate}
              onChange={(e) => set('releaseDate', e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Download / Version info */}
        <div className="border-t border-neutral-800 pt-5">
          <h3 className="mb-3 text-sm font-semibold text-neutral-300">Download & Version</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Download URL</label>
              <input
                value={form.downloadUrl}
                onChange={(e) => set('downloadUrl', e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="https://drive.google.com/file/d/.../view"
              />
              <p className="mt-1 text-xs text-neutral-500">Google Drive links will be auto-converted to direct download</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Version Number</label>
                <input
                  value={form.versionString}
                  onChange={(e) => set('versionString', e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="1.0.0"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">File Size (bytes)</label>
                <input
                  type="number"
                  min="0"
                  value={form.fileSize}
                  onChange={(e) => set('fileSize', e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="52428800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        {categories?.length ? (
          <div>
            <label className="mb-2 block text-sm font-medium">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleList('categoryIds', cat.id)}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    form.categoryIds.includes(cat.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Tags */}
        {tags?.length ? (
          <div>
            <label className="mb-2 block text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleList('tagIds', tag.id)}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    form.tagIds.includes(tag.id)
                      ? 'bg-purple-600 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950/30 p-3 text-sm text-red-400">{error}</div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/developer/products" className="rounded-lg border border-neutral-700 px-5 py-2 text-neutral-300 hover:border-neutral-500">
            Cancel
          </Link>
          <button
            onClick={() => mutate()}
            disabled={isPending || !form.name.trim()}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {isPending ? 'Creating…' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
