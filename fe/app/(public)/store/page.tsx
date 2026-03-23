'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';
import type { QueryProductParams } from '@/types';

export default function StorePage() {
  const [params, setParams] = useState<QueryProductParams>({ page: 1, limit: 20, sort: 'newest' });
  const { data, isLoading } = useProducts(params);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Store</h1>
        <select
          value={params.sort}
          onChange={(e) => setParams((p) => ({ ...p, sort: e.target.value as QueryProductParams['sort'] }))}
          className="rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>

      <ProductGrid products={data?.data ?? []} isLoading={isLoading} />

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            disabled={params.page === 1}
            onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
            className="rounded border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Previous
          </button>
          <span className="flex items-center px-4 text-sm text-neutral-400">
            Page {params.page} / {data.meta.totalPages}
          </span>
          <button
            disabled={params.page === data.meta.totalPages}
            onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
            className="rounded border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
