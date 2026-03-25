'use client';

import { use, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, versionsApi, categoriesApi, tagsApi } from '@/lib/api/endpoints';
import Link from 'next/link';
import Image from 'next/image';
import type { ProductVersion } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

// ─── Version modal ─────────────────────────────────────────────────────────────
function VersionModal({
  productId,
  existingVersion,
  onClose,
}: {
  productId: string;
  existingVersion?: ProductVersion | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    version: existingVersion?.version ?? '',
    changelog: existingVersion?.changelog ?? '',
    downloadUrl: existingVersion?.downloadUrl ?? '',
    fileSize: existingVersion?.fileSize?.toString() ?? '',
    isLatest: existingVersion?.isLatest ?? false,
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      existingVersion
        ? versionsApi.update(productId, existingVersion.id, {
            ...form,
            fileSize: form.fileSize ? Number(form.fileSize) : undefined,
          })
        : versionsApi.create(productId, {
            ...form,
            fileSize: form.fileSize ? Number(form.fileSize) : undefined,
          }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer-product', productId] });
      onClose();
    },
    onError: (err: any) => setError(err?.message ?? 'Lỗi khi lưu phiên bản'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl border border-neutral-700 bg-neutral-900 p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {existingVersion ? 'Chỉnh sửa phiên bản' : 'Thêm phiên bản mới'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Số phiên bản *</label>
            <input
              value={form.version}
              onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
              placeholder="1.0.0"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">URL tải về</label>
            <input
              value={form.downloadUrl}
              onChange={(e) => setForm((f) => ({ ...f, downloadUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Kích thước file (bytes)</label>
            <input
              type="number"
              value={form.fileSize}
              onChange={(e) => setForm((f) => ({ ...f, fileSize: e.target.value }))}
              placeholder="52428800"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Changelog</label>
            <textarea
              value={form.changelog}
              onChange={(e) => setForm((f) => ({ ...f, changelog: e.target.value }))}
              rows={4}
              placeholder="Những thay đổi trong phiên bản này…"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.isLatest}
              onChange={(e) => setForm((f) => ({ ...f, isLatest: e.target.checked }))}
              className="accent-blue-500"
            />
            Đặt làm phiên bản mới nhất
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300">Huỷ</button>
          <button
            onClick={() => mutate()}
            disabled={isPending || !form.version.trim()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {isPending ? 'Đang lưu…' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DeveloperProductDetailPage({ params }: Props) {
  const { id: productId } = use(params);
  const qc = useQueryClient();

  const { data: productData, isLoading } = useQuery({
    queryKey: ['developer-product', productId],
    queryFn: async () => {
      const res = await productsApi.getAll({ limit: 1 }); // fallback — we'll use getBySlug on actual slug
      // Actually fetch full detail including versions by fetching product list admin isn't available here,
      // so we fetch the public API by ID isn't supported — but versions are available via getVersions
      return null; // handled separately below
    },
    enabled: false, // disabled, handled differently below
  });

  // Fetch versions for this product ID
  const { data: versions, isLoading: versionsLoading } = useQuery({
    queryKey: ['versions', productId],
    queryFn: async () => {
      // We fetch by slug but we have product ID — use admin or developer API
      // products/:slug/versions uses slug, but here we have ID
      // Workaround: call the developer.getMyProducts to find the product
      const res = await import('@/lib/api/endpoints').then((m) => m.developerApi.getMyProducts());
      const products = (res.data?.data ?? res.data ?? []) as any[];
      return products;
    },
  });

  // Find THIS product from the developer's products list
  const product = versions?.find((p: any) => p.id === productId);

  // Fetch product versions separately
  const { data: productVersions, isLoading: pvLoading } = useQuery({
    queryKey: ['product-versions', productId],
    queryFn: async () => {
      if (!product?.slug) return [];
      const res = await versionsApi.getBySlug(product.slug);
      return (res.data?.data ?? []) as ProductVersion[];
    },
    enabled: !!product?.slug,
  });

  const [versionModal, setVersionModal] = useState<{ open: boolean; existing?: ProductVersion | null }>({ open: false });
  const [editForm, setEditForm] = useState<any>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch categories & tags for editing
  const { data: allCategories } = useQuery({
    queryKey: ['categories-flat'],
    queryFn: async () => {
      const res = await categoriesApi.getFlat();
      return (res.data?.data ?? res.data ?? []) as any[];
    },
  });
  const { data: allTags } = useQuery({
    queryKey: ['all-tags'],
    queryFn: async () => {
      const res = await tagsApi.getAll();
      return (res.data?.data ?? res.data ?? []) as any[];
    },
  });

  useEffect(() => {
    if (product && !editForm) {
      const existingCatIds = (product.categories ?? []).map((c: any) => (c.category ?? c).id ?? c.categoryId);
      const existingTagIds = (product.tags ?? []).map((t: any) => (t.tag ?? t).id ?? t.tagId);
      // Get latest version info for inline editing
      const latestVer = product.versions?.[0];
      setEditForm({
        name: product.name ?? '',
        shortDescription: product.shortDescription ?? '',
        description: product.description ?? '',
        thumbnailUrl: product.thumbnailUrl ?? '',
        price: product.price ?? 0,
        discountPercent: product.discountPercent ?? 0,
        isFree: product.isFree ?? false,
        categoryIds: existingCatIds,
        tagIds: existingTagIds,
        downloadUrl: latestVer?.downloadUrl ?? '',
        versionString: latestVer?.version ?? '',
        fileSize: latestVer?.fileSize?.toString() ?? '',
      });
    }
  }, [product, editForm]);

  const { mutate: saveProduct, isPending: isSaving } = useMutation({
    mutationFn: () =>
      import('@/lib/api/endpoints').then((m) =>
        m.developerApi.updateProduct(productId, {
          name: editForm?.name,
          shortDescription: editForm?.shortDescription,
          description: editForm?.description,
          thumbnailUrl: editForm?.thumbnailUrl,
          price: Number(editForm?.price),
          discountPercent: Number(editForm?.discountPercent),
          isFree: editForm?.isFree,
          categoryIds: editForm?.categoryIds ?? [],
          tagIds: editForm?.tagIds ?? [],
          downloadUrl: editForm?.downloadUrl || undefined,
          versionString: editForm?.versionString || undefined,
          fileSize: editForm?.fileSize ? Number(editForm.fileSize) : undefined,
        }),
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['versions', productId] });
      setSaveError(null);
    },
    onError: (err: any) => setSaveError(err?.message ?? 'Lưu thất bại'),
  });

  const { mutate: deleteVersion } = useMutation({
    mutationFn: (versionId: string) => versionsApi.remove(productId, versionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['product-versions', productId] }),
  });

  if (versionsLoading) return <div className="py-10 text-center text-neutral-400">Đang tải…</div>;
  if (!product) return (
    <div className="py-10 text-center text-neutral-400">
      Sản phẩm không tìm thấy. <Link href="/developer/products" className="text-blue-400">← Quay lại</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/developer/products" className="text-neutral-400 hover:text-white">←</Link>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-neutral-400">{product.slug}</p>
        </div>
        <span className={`ml-auto rounded-full px-3 py-1 text-xs ${
          product.is_active ? 'bg-green-900 text-green-300' : 'bg-neutral-800 text-neutral-400'
        }`}>
          {product.is_active ? 'Hoạt động' : 'Tạm ẩn'}
        </span>
      </div>

      {/* Edit basic info */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-4 text-lg font-semibold">Thông tin cơ bản</h2>
        {editForm && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-neutral-400">Tên sản phẩm</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-400">URL thumbnail</label>
                <input
                  value={editForm.thumbnailUrl}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, thumbnailUrl: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-400">Mô tả ngắn</label>
              <input
                value={editForm.shortDescription}
                onChange={(e) => setEditForm((f: any) => ({ ...f, shortDescription: e.target.value }))}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-xs text-neutral-400">Giá ($)</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.isFree ? 0 : editForm.price}
                  disabled={editForm.isFree}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, price: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-400">Giảm giá (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.discountPercent}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, discountPercent: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editForm.isFree}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, isFree: e.target.checked }))}
                    className="accent-blue-500"
                  />
                  Miễn phí
                </label>
              </div>
            </div>

            {/* Download / Version info */}
            <div className="border-t border-neutral-800 pt-4">
              <h3 className="mb-3 text-xs font-semibold text-neutral-300">Link tải & Phiên bản</h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-neutral-400">URL tải về</label>
                  <input
                    value={editForm.downloadUrl}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, downloadUrl: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    placeholder="https://drive.google.com/file/d/.../view"
                  />
                  <p className="mt-1 text-xs text-neutral-500">Link Google Drive sẽ tự động chuyển sang link tải trực tiếp</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs text-neutral-400">Số phiên bản</label>
                    <input
                      value={editForm.versionString}
                      onChange={(e) => setEditForm((f: any) => ({ ...f, versionString: e.target.value }))}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                      placeholder="1.0.0"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-neutral-400">Kích thước file (bytes)</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.fileSize}
                      onChange={(e) => setEditForm((f: any) => ({ ...f, fileSize: e.target.value }))}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                      placeholder="52428800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            {allCategories && allCategories.length > 0 && (
              <div>
                <label className="mb-2 block text-xs text-neutral-400">Danh mục</label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat: any) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setEditForm((f: any) => ({
                          ...f,
                          categoryIds: f.categoryIds?.includes(cat.id)
                            ? f.categoryIds.filter((id: string) => id !== cat.id)
                            : [...(f.categoryIds ?? []), cat.id],
                        }))
                      }
                      className={`rounded-full px-3 py-1 text-xs transition ${
                        editForm.categoryIds?.includes(cat.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {allTags && allTags.length > 0 && (
              <div>
                <label className="mb-2 block text-xs text-neutral-400">Thẻ tag</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag: any) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() =>
                        setEditForm((f: any) => ({
                          ...f,
                          tagIds: f.tagIds?.includes(tag.id)
                            ? f.tagIds.filter((id: string) => id !== tag.id)
                            : [...(f.tagIds ?? []), tag.id],
                        }))
                      }
                      className={`rounded-full px-3 py-1 text-xs transition ${
                        editForm.tagIds?.includes(tag.id)
                          ? 'bg-purple-600 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {saveError && <p className="text-sm text-red-400">{saveError}</p>}
            <div className="flex justify-end">
              <button
                onClick={() => saveProduct()}
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
              >
                {isSaving ? 'Đang lưu…' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Versions */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quản lý phiên bản</h2>
          <button
            onClick={() => setVersionModal({ open: true, existing: null })}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            + Thêm phiên bản
          </button>
        </div>

        {pvLoading ? (
          <p className="text-sm text-neutral-400">Đang tải phiên bản…</p>
        ) : !productVersions?.length ? (
          <p className="text-sm text-neutral-500">Chưa có phiên bản nào. Thêm phiên bản đầu tiên để người dùng có thể tải về.</p>
        ) : (
          <div className="divide-y divide-neutral-800">
            {productVersions.map((v) => (
              <div key={v.id} className="flex items-start justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">v{v.version}</span>
                    {v.isLatest && (
                      <span className="rounded-full bg-green-900 px-2 py-0.5 text-xs text-green-300">Mới nhất</span>
                    )}
                    <span className="text-xs text-neutral-500">
                      {new Date(v.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  {v.fileSize && (
                    <p className="mt-0.5 text-xs text-neutral-400">
                      Kích thước: {(v.fileSize / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                  {v.downloadUrl && (
                    <a
                      href={v.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 block truncate text-xs text-blue-400 hover:underline"
                    >
                      {v.downloadUrl}
                    </a>
                  )}
                  {v.changelog && (
                    <p className="mt-1 text-xs text-neutral-400 whitespace-pre-line line-clamp-2">{v.changelog}</p>
                  )}
                </div>
                <div className="ml-4 flex gap-2 shrink-0">
                  <button
                    onClick={() => setVersionModal({ open: true, existing: v })}
                    className="rounded border border-neutral-700 px-3 py-1 text-xs text-neutral-300 hover:border-neutral-500"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Xoá phiên bản v${v.version}?`)) deleteVersion(v.id);
                    }}
                    className="rounded border border-red-900 px-3 py-1 text-xs text-red-400 hover:border-red-700"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-center">
          <p className="text-2xl font-bold text-white">{product._count?.library ?? 0}</p>
          <p className="text-sm text-neutral-400">Lượt mua</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-center">
          <p className="text-2xl font-bold text-white">{product._count?.reviews ?? 0}</p>
          <p className="text-sm text-neutral-400">Đánh giá</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-center">
          <p className="text-2xl font-bold text-white">{productVersions?.length ?? 0}</p>
          <p className="text-sm text-neutral-400">Phiên bản</p>
        </div>
      </div>

      {/* Version modal */}
      {versionModal.open && (
        <VersionModal
          productId={productId}
          existingVersion={versionModal.existing}
          onClose={() => {
            setVersionModal({ open: false });
            qc.invalidateQueries({ queryKey: ['product-versions', productId] });
          }}
        />
      )}
    </div>
  );
}
