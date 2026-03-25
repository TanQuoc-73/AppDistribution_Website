'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Leaf } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi, tagsApi } from '@/lib/api/endpoints';
import ProductGrid from '@/components/product/ProductGrid';
import type { QueryProductParams, Category, Tag } from '@/types';

function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoriesApi.getAll();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await tagsApi.getAll();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default function StorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive initial params from URL query string
  const [params, setParams] = useState<QueryProductParams>(() => ({
    page: Number(searchParams.get('page')) || 1,
    limit: 20,
    sort: (searchParams.get('sort') as QueryProductParams['sort']) || 'newest',
    search: searchParams.get('search') || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    tag: searchParams.get('tag') || undefined,
    isFree: searchParams.get('isFree') === 'true' ? true : undefined,
  }));

  const [searchInput, setSearchInput] = useState(params.search || '');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useProducts(params);
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  // Sync params to URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (params.search) sp.set('search', params.search);
    if (params.categoryId) sp.set('categoryId', params.categoryId);
    if (params.tag) sp.set('tag', params.tag);
    if (params.sort && params.sort !== 'newest') sp.set('sort', params.sort);
    if (params.isFree) sp.set('isFree', 'true');
    if (params.page && params.page > 1) sp.set('page', String(params.page));
    const qs = sp.toString();
    router.replace(`/store${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [params, router]);

  const updateFilter = useCallback((update: Partial<QueryProductParams>) => {
    setParams((p) => ({ ...p, ...update, page: 1 }));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ search: searchInput.trim() || undefined });
  };

  const clearAllFilters = () => {
    setParams({ page: 1, limit: 20, sort: 'newest' });
    setSearchInput('');
  };

  const hasActiveFilters = !!(params.search || params.categoryId || params.tag || params.isFree);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-amber-900/30 bg-gradient-to-b from-amber-950/40 to-transparent">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-50">Store</h1>
              <p className="text-sm text-amber-200/60">
                {data?.meta?.total ?? 0} apps available
              </p>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400/60" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search apps..."
                className="w-full rounded-xl border border-amber-800/30 bg-amber-950/30 py-2.5 pl-10 pr-4 text-sm text-amber-50 placeholder-amber-400/40 outline-none transition focus:border-amber-600/50 focus:ring-1 focus:ring-amber-600/30"
              />
            </div>
            <button
              type="submit"
              className="btn-autumn rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-800/30 bg-amber-950/30 px-4 py-2.5 text-sm text-amber-200/80 transition hover:border-amber-600/40 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-4 space-y-5">
              {/* Sort */}
              <div className="rounded-xl border border-amber-900/25 bg-amber-950/20 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400/70">Sort</h3>
                <select
                  value={params.sort}
                  onChange={(e) => updateFilter({ sort: e.target.value as QueryProductParams['sort'] })}
                  className="w-full rounded-lg border border-amber-800/30 bg-amber-950/40 px-3 py-2 text-sm text-amber-50 outline-none focus:border-amber-600/50"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Price filter */}
              <div className="rounded-xl border border-amber-900/25 bg-amber-950/20 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400/70">Price</h3>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-100/80 transition hover:text-amber-50">
                    <input
                      type="radio"
                      name="price"
                      checked={!params.isFree}
                      onChange={() => updateFilter({ isFree: undefined })}
                      className="accent-amber-500"
                    />
                    All
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-100/80 transition hover:text-amber-50">
                    <input
                      type="radio"
                      name="price"
                      checked={params.isFree === true}
                      onChange={() => updateFilter({ isFree: true })}
                      className="accent-amber-500"
                    />
                    Free
                  </label>
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="rounded-xl border border-amber-900/25 bg-amber-950/20 p-4">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400/70">Categories</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => updateFilter({ categoryId: undefined })}
                      className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
                        !params.categoryId
                          ? 'bg-amber-600/20 font-medium text-amber-300'
                          : 'text-amber-100/70 hover:bg-amber-900/20 hover:text-amber-100'
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat: Category) => (
                      <button
                        key={cat.id}
                        onClick={() => updateFilter({ categoryId: cat.id })}
                        className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
                          params.categoryId === cat.id
                            ? 'bg-amber-600/20 font-medium text-amber-300'
                            : 'text-amber-100/70 hover:bg-amber-900/20 hover:text-amber-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="rounded-xl border border-amber-900/25 bg-amber-950/20 p-4">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400/70">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t: Tag) => (
                      <button
                        key={t.id}
                        onClick={() => updateFilter({ tag: params.tag === t.slug ? undefined : t.slug })}
                        className={`rounded-full px-2.5 py-1 text-xs transition ${
                          params.tag === t.slug
                            ? 'bg-amber-600 font-medium text-white'
                            : 'border border-amber-800/30 text-amber-200/70 hover:border-amber-600/40 hover:text-amber-100'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear all */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full rounded-xl border border-amber-800/30 py-2 text-sm text-amber-400 transition hover:bg-amber-900/20 hover:text-amber-300"
                >
                  ✕ Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Active filters pills */}
            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-amber-400/60">Filtering:</span>
                {params.search && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-900/30 px-2.5 py-1 text-xs text-amber-200">
                    &quot;{params.search}&quot;
                    <button onClick={() => { updateFilter({ search: undefined }); setSearchInput(''); }} className="ml-0.5 text-amber-400 hover:text-white">✕</button>
                  </span>
                )}
                {params.categoryId && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-900/30 px-2.5 py-1 text-xs text-amber-200">
                    {categories.find((c: Category) => c.id === params.categoryId)?.name || 'Category'}
                    <button onClick={() => updateFilter({ categoryId: undefined })} className="ml-0.5 text-amber-400 hover:text-white">✕</button>
                  </span>
                )}
                {params.tag && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-900/30 px-2.5 py-1 text-xs text-amber-200">
                    #{params.tag}
                    <button onClick={() => updateFilter({ tag: undefined })} className="ml-0.5 text-amber-400 hover:text-white">✕</button>
                  </span>
                )}
                {params.isFree && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-900/30 px-2.5 py-1 text-xs text-amber-200">
                    Free
                    <button onClick={() => updateFilter({ isFree: undefined })} className="ml-0.5 text-amber-400 hover:text-white">✕</button>
                  </span>
                )}
              </div>
            )}

            <ProductGrid products={data?.data ?? []} isLoading={isLoading} />

            {/* Pagination */}
            {data?.meta && data.meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  disabled={params.page === 1}
                  onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                  className="rounded-lg border border-amber-800/30 bg-amber-950/30 px-4 py-2 text-sm text-amber-200 transition hover:border-amber-600/40 disabled:opacity-40"
                >
                  ← Previous
                </button>
                {/* Page numbers */}
                {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    const current = params.page ?? 1;
                    return p === 1 || p === data.meta!.totalPages || Math.abs(p - current) <= 2;
                  })
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-1 text-amber-600/40">…</span>
                      )}
                      <button
                        onClick={() => setParams((prev) => ({ ...prev, page: p }))}
                        className={`h-9 min-w-[36px] rounded-lg text-sm font-medium transition ${
                          p === (params.page ?? 1)
                            ? 'bg-amber-600 text-white'
                            : 'text-amber-200/70 hover:bg-amber-900/30'
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  disabled={params.page === data.meta.totalPages}
                  onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                  className="rounded-lg border border-amber-800/30 bg-amber-950/30 px-4 py-2 text-sm text-amber-200 transition hover:border-amber-600/40 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
