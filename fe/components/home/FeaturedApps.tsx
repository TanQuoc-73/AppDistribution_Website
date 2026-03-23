'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/endpoints';
import type { Product } from '@/types';

function ProductSkeletonCard() {
  return (
    <div className="autumn-card overflow-hidden">
      <div className="aspect-video w-full animate-pulse bg-stone-800" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-stone-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-stone-800" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-stone-800" />
      </div>
    </div>
  );
}

function AppCard({ product }: { product: Product }) {
  const discountedPrice =
    product.isFree
      ? 'Free'
      : product.discountPercent > 0
        ? `$${(parseFloat(product.price) * (1 - product.discountPercent / 100)).toFixed(2)}`
        : `$${parseFloat(product.price).toFixed(2)}`;

  return (
    <Link href={`/store/${product.slug}`} className="autumn-card group flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg,#1e1208,#2d1600)' }}
          >
            📦
          </div>
        )}
        {/* Discount badge */}
        {product.discountPercent > 0 && (
          <span className="absolute right-2 top-2 rounded-md bg-green-700 px-2 py-0.5 text-xs font-bold text-green-100">
            -{product.discountPercent}%
          </span>
        )}
        {product.isFree && (
          <span className="absolute right-2 top-2 rounded-md bg-emerald-700 px-2 py-0.5 text-xs font-bold text-emerald-100">
            Free
          </span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
          <span className="translate-y-3 rounded-xl bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View App
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-stone-100">{product.name}</h3>
        {product.developer && (
          <p className="text-xs text-stone-500">{product.developer.companyName}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-xs text-amber-500">
            ★ {parseFloat(product.averageRating).toFixed(1)}{' '}
            <span className="text-stone-600">({product.reviewCount})</span>
          </span>
          <div className="flex items-baseline gap-1.5">
            {product.discountPercent > 0 && !product.isFree && (
              <span className="text-xs text-stone-600 line-through">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            )}
            <span
              className={`text-sm font-bold ${
                product.isFree ? 'text-emerald-400' : 'text-stone-100'
              }`}
            >
              {discountedPrice}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedApps() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const res = await productsApi.getAll({ limit: 8 });
      const d = res.data?.data as Product[] | { items: Product[] } | undefined;
      return (Array.isArray(d) ? d : (d as { items: Product[] } | undefined)?.items ?? []) as Product[];
    },
  });

  const products = data ?? [];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-600">
              🍂 Hand Picked
            </p>
            <h2 className="text-2xl font-bold text-stone-50 lg:text-3xl">Featured Apps</h2>
          </div>
          <Link
            href="/store"
            className="flex items-center gap-1 text-sm text-amber-500 transition hover:text-amber-400"
          >
            View All
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeletonCard key={i} />)
            : products.length > 0
              ? products.map((p) => <AppCard key={p.id} product={p} />)
              : Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="autumn-card flex aspect-[3/4] flex-col items-center justify-center gap-3 text-stone-600"
                  >
                    <span className="text-4xl opacity-30">📦</span>
                    <span className="text-xs">No apps yet</span>
                  </div>
                ))}
        </div>
      </div>
    </section>
  );
}
