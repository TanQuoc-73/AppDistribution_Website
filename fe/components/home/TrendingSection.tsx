'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Flame, Package, Medal, Award, Trophy } from 'lucide-react';
import { productsApi } from '@/lib/api/endpoints';
import type { Product } from '@/types';

const RANK_COLORS = [
  'text-amber-400 border-amber-500/60 bg-amber-500/10',
  'text-stone-300 border-stone-500/60 bg-stone-500/10',
  'text-orange-500 border-orange-700/60 bg-orange-700/10',
];

export default function TrendingSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'trending'],
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
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-600">
              <Flame className="inline h-3.5 w-3.5 -mt-0.5" /> Most Downloaded
            </p>
            <h2 className="text-2xl font-bold text-stone-50 lg:text-3xl">Trending Now</h2>
          </div>
          <Link
            href="/store"
            className="flex items-center gap-1 text-sm text-amber-500 transition hover:text-amber-400"
          >
            See all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-stone-800 bg-stone-900/50 p-4"
                >
                  <div className="h-8 w-8 animate-pulse rounded bg-stone-800" />
                  <div className="h-14 w-14 animate-pulse rounded-xl bg-stone-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-stone-800" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-stone-800" />
                  </div>
                </div>
              ))
            : products.slice(0, 8).map((product, i) => (
                <TrendingCard key={product.id} product={product} rank={i + 1} />
              ))}
        </div>
      </div>
    </section>
  );
}

function TrendingCard({ product, rank }: { product: Product; rank: number }) {
  const price = product.isFree
    ? 'Free'
    : product.discountPercent > 0
      ? `$${(parseFloat(product.price) * (1 - product.discountPercent / 100)).toFixed(2)}`
      : `$${parseFloat(product.price).toFixed(2)}`;

  const rankColor = RANK_COLORS[rank - 1] ?? 'text-stone-500 border-stone-700/40 bg-stone-800/20';

  return (
    <Link
      href={`/store/${product.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-stone-800/80 bg-stone-900/40 p-4 transition-all duration-300 hover:border-amber-800/40 hover:bg-stone-900/80 hover:shadow-lg hover:shadow-amber-900/10"
    >
      {/* Rank badge */}
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${rankColor}`}
      >
        {rank <= 3 ? [<Trophy key="g" className="h-4 w-4" />, <Award key="s" className="h-4 w-4" />, <Medal key="b" className="h-4 w-4" />][rank - 1] : `#${rank}`}
      </div>

      {/* Thumbnail */}
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-stone-800">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#1e1208,#2d1600)' }}
          >
            <Package className="h-6 w-6 text-amber-700/60" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-stone-100 group-hover:text-amber-300">
          {product.name}
        </p>
        {product.developer && (
          <p className="truncate text-xs text-stone-500">{product.developer.companyName}</p>
        )}
        <div className="mt-1 flex items-center gap-3">
          <span className="text-xs text-amber-500">★ {parseFloat(product.averageRating).toFixed(1)}</span>
          <span className="text-xs text-stone-600">
            ⬇ {product.totalDownloads.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        {product.discountPercent > 0 && !product.isFree && (
          <p className="text-xs text-stone-600 line-through">${parseFloat(product.price).toFixed(2)}</p>
        )}
        <p
          className={`text-sm font-bold ${product.isFree ? 'text-emerald-400' : 'text-stone-100'}`}
        >
          {price}
        </p>
        {product.discountPercent > 0 && (
          <span className="text-xs text-green-500">-{product.discountPercent}%</span>
        )}
      </div>
    </Link>
  );
}
