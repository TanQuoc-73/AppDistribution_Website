'use client';

import { use } from 'react';
import { useProduct } from '@/hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import { versionsApi } from '@/lib/api/endpoints';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/product/AddToCartButton';
import type { ProductVersion } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);
  const { data: product, isLoading, error } = useProduct(slug);

  // Fetch all versions for this product
  const { data: versions } = useQuery({
    queryKey: ['product-versions-public', slug],
    queryFn: async () => {
      const res = await versionsApi.getBySlug(slug);
      return (res.data?.data ?? []) as ProductVersion[];
    },
    enabled: !!slug && !isLoading && !error,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-2/3 rounded bg-amber-900/20" />
            <div className="mb-8 h-4 w-1/4 rounded bg-amber-900/15" />
            <div className="aspect-video w-full rounded-2xl bg-amber-900/20" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  const rating = product.averageRating ? parseFloat(product.averageRating) : 0;
  const devName = product.developer?.companyName || (product.developer as any)?.name;

  const finalPrice = product.isFree
    ? 'Miễn phí'
    : product.discountPercent > 0
      ? `$${(parseFloat(product.price) * (1 - product.discountPercent / 100)).toFixed(2)}`
      : `$${parseFloat(product.price).toFixed(2)}`;

  const cats = product.categories?.map((c: any) => c.category ?? c) ?? [];
  const tagsList = product.tags?.map((t: any) => t.tag ?? t) ?? [];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-amber-900/20 bg-amber-950/20">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-amber-400/50">
            <Link href="/store" className="transition hover:text-amber-300">Store</Link>
            <span>/</span>
            {cats.length > 0 && (
              <>
                <Link href={`/store?categoryId=${cats[0].id}`} className="transition hover:text-amber-300">
                  {cats[0].name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-amber-200/80">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: main info */}
          <div className="lg:col-span-2">
            <h1 className="mb-2 text-3xl font-bold text-amber-50">{product.name}</h1>
            {devName && (
              <p className="mb-1 text-amber-400/60">{devName}</p>
            )}
            {/* Rating inline */}
            <div className="mb-6 flex items-center gap-3 text-sm text-amber-400/50">
              <span className="text-amber-500">★</span> {rating.toFixed(1)}
              {product.reviewCount != null && (
                <span>· {product.reviewCount} đánh giá</span>
              )}
              {product.totalDownloads != null && product.totalDownloads > 0 && (
                <span>· {product.totalDownloads.toLocaleString()} lượt tải</span>
              )}
            </div>

            {/* Main image */}
            {product.thumbnailUrl && (
              <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-2xl border border-amber-900/20 bg-amber-950/30">
                <Image
                  src={product.thumbnailUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Screenshots gallery */}
            {product.media && product.media.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-lg font-semibold text-amber-100">Ảnh chụp màn hình</h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.media.map((m) => (
                    <div key={m.id} className="relative h-36 w-64 shrink-0 overflow-hidden rounded-xl border border-amber-900/20 bg-amber-950/30">
                      <Image src={m.url} alt={m.caption || ''} fill className="object-cover" sizes="256px" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-semibold text-amber-100">Giới thiệu</h2>
              {product.shortDescription && (
                <p className="mb-3 text-sm italic text-amber-300/60">{product.shortDescription}</p>
              )}
              <div className="prose prose-invert max-w-none text-amber-100/70">
                <p className="whitespace-pre-line">{product.description}</p>
              </div>
            </div>

            {/* Tags */}
            {tagsList.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-lg font-semibold text-amber-100">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {tagsList.map((t: any) => (
                    <Link
                      key={t.id}
                      href={`/store?tag=${t.slug}`}
                      className="rounded-full border border-amber-800/30 px-3 py-1 text-xs text-amber-200/70 transition hover:border-amber-600/40 hover:text-amber-100"
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Version history */}
            {versions && versions.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-lg font-semibold text-amber-100">Lịch sử phiên bản</h2>
                <div className="space-y-3">
                  {versions.map((v) => (
                    <div key={v.id} className="rounded-xl border border-amber-900/25 bg-amber-950/20 p-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-amber-50">v{v.version}</span>
                        {v.isLatest && (
                          <span className="rounded-full bg-amber-600/20 px-2 py-0.5 text-xs font-medium text-amber-300">
                            Mới nhất
                          </span>
                        )}
                        <span className="ml-auto text-xs text-amber-400/40">
                          {new Date(v.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      {v.fileSize && (
                        <p className="mt-1 text-xs text-amber-400/50">
                          Kích thước: {(v.fileSize / 1024 / 1024).toFixed(1)} MB
                        </p>
                      )}
                      {v.changelog && (
                        <p className="mt-2 whitespace-pre-line text-sm text-amber-100/60">{v.changelog}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System requirements */}
            {product.platforms && product.platforms.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-semibold text-amber-100">Yêu cầu hệ thống</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {product.platforms.map((p) => (
                    <div key={p.id} className="rounded-xl border border-amber-900/25 bg-amber-950/20 p-4">
                      <h3 className="mb-2 text-sm font-semibold text-amber-300">{(p as any).platform || p.platformName}</h3>
                      <dl className="space-y-1 text-xs text-amber-100/60">
                        {((p as any).min_os || p.minimumOs) && <div><dt className="inline font-medium text-amber-200/70">OS tối thiểu:</dt> {(p as any).min_os || p.minimumOs}</div>}
                        {(p.recommendedOs || (p as any).recommended_os) && <div><dt className="inline font-medium text-amber-200/70">OS đề nghị:</dt> {p.recommendedOs || (p as any).recommended_os}</div>}
                        {((p as any).min_memory_mb || p.minimumRam) && <div><dt className="inline font-medium text-amber-200/70">RAM tối thiểu:</dt> {(p as any).min_memory_mb || p.minimumRam} MB</div>}
                        {((p as any).min_storage_mb || p.storageRequired) && <div><dt className="inline font-medium text-amber-200/70">Dung lượng:</dt> {(p as any).min_storage_mb || p.storageRequired} MB</div>}
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: purchase panel (sticky) */}
          <div>
            <div className="sticky top-4 rounded-2xl border border-amber-900/25 bg-gradient-to-b from-amber-950/40 to-amber-950/20 p-6">
              {product.thumbnailUrl && (
                <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-amber-950/30">
                  <Image src={product.thumbnailUrl} alt={product.name} fill className="object-cover" />
                </div>
              )}

              <div className="mb-4 flex items-center gap-3">
                {product.discountPercent > 0 && !product.isFree && (
                  <>
                    <span className="rounded-md bg-gradient-to-r from-green-600 to-emerald-600 px-2 py-0.5 text-sm font-bold text-white">
                      -{product.discountPercent}%
                    </span>
                    <span className="text-sm text-amber-600/50 line-through">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                  </>
                )}
                <span className={`text-2xl font-bold ${product.isFree ? 'text-amber-400' : 'text-amber-50'}`}>
                  {finalPrice}
                </span>
              </div>

              <AddToCartButton productId={product.id} isFree={product.isFree} thumbnailUrl={product.thumbnailUrl} />

              <div className="mt-4 space-y-2 border-t border-amber-900/20 pt-4 text-xs text-amber-400/50">
                <div className="flex items-center justify-between">
                  <span>Đánh giá</span>
                  <span className="text-amber-300">
                    <span className="text-amber-500">★</span> {rating.toFixed(1)} ({product.reviewCount ?? 0})
                  </span>
                </div>
                {product.releaseDate && (
                  <div className="flex items-center justify-between">
                    <span>Ngày phát hành</span>
                    <span className="text-amber-300">{new Date(product.releaseDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
                {product.ageRating && (
                  <div className="flex items-center justify-between">
                    <span>Độ tuổi</span>
                    <span className="text-amber-300 capitalize">{product.ageRating.replace('_', ' ')}</span>
                  </div>
                )}
                {versions && versions.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Phiên bản</span>
                    <span className="text-amber-300">
                      v{versions.find((v) => v.isLatest)?.version ?? versions[0]?.version}
                    </span>
                  </div>
                )}
              </div>

              {/* Categories links */}
              {cats.length > 0 && (
                <div className="mt-4 border-t border-amber-900/20 pt-4">
                  <span className="text-xs text-amber-400/50">Danh mục:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {cats.map((c: any) => (
                      <Link key={c.id} href={`/store?categoryId=${c.id}`} className="rounded-full bg-amber-900/20 px-2 py-0.5 text-xs text-amber-300/80 transition hover:bg-amber-900/30">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
