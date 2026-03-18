"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ProductCard from "@/components/product/product-card"
import ProductSkeleton from "@/components/product/product-skeleton"
import { productService } from "@/services/product.service"
import { useDebounce } from "@/hooks/useDebounce"
import type { Product, Category } from "@/types/product"

const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low → High", value: "price-asc" },
    { label: "Price: High → Low", value: "price-desc" },
]

const PAGE_SIZE = 12

export default function StorePage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Read from URL
    const [search, setSearch] = useState(searchParams.get("search") ?? "")
    const [category, setCategory] = useState(searchParams.get("category") ?? "All")
    const [sort, setSort] = useState(searchParams.get("sort") ?? "newest")
    const [page, setPage] = useState(Number(searchParams.get("page") ?? 1))

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const debouncedSearch = useDebounce(search, 350)

    // Sync URL params
    const updateUrl = useCallback((params: Record<string, string | number>) => {
        const sp = new URLSearchParams(searchParams.toString())
        Object.entries(params).forEach(([k, v]) => {
            if (v && String(v) !== "" && String(v) !== "All" && String(v) !== "1") {
                sp.set(k, String(v))
            } else {
                sp.delete(k)
            }
        })
        router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
    }, [pathname, router, searchParams])

    // Fetch categories once
    useEffect(() => {
        productService.getCategories().then(setCategories).catch(() => { })
    }, [])

    // Fetch products whenever filters change
    useEffect(() => {
        setLoading(true)
        setError("")
        productService.getProducts({
            search: debouncedSearch || undefined,
            category: category !== "All" ? category : undefined,
            sort,
            page,
            limit: PAGE_SIZE,
        })
            .then(({ data, total }) => {
                setProducts(data)
                setTotal(total)
            })
            .catch(() => setError("Failed to load products. Please try again."))
            .finally(() => setLoading(false))
    }, [debouncedSearch, category, sort, page])

    // Reset page on filter change
    const handleSearch = (v: string) => { setSearch(v); setPage(1); updateUrl({ search: v, category, sort, page: 1 }) }
    const handleCategory = (v: string) => { setCategory(v); setPage(1); updateUrl({ search, category: v, sort, page: 1 }) }
    const handleSort = (v: string) => { setSort(v); setPage(1); updateUrl({ search, category, sort: v, page: 1 }) }
    const handlePage = (p: number) => { setPage(p); updateUrl({ search, category, sort, page: p }) }

    const totalPages = Math.ceil(total / PAGE_SIZE)

    return (
        <main className="min-h-screen bg-autumn-bg">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-autumn-text">Store</h1>
                    {!loading && (
                        <p className="text-sm text-autumn-muted mt-1">
                            {total} {total === 1 ? "product" : "products"} found
                        </p>
                    )}
                </div>

                {/* Filters bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8 flex-wrap">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search apps…"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-autumn-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-autumn-primary/30 focus:border-autumn-primary transition"
                    />

                    {/* Category */}
                    <select
                        value={category}
                        onChange={(e) => handleCategory(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-autumn-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-autumn-primary/30 focus:border-autumn-primary transition"
                    >
                        <option value="All">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => handleSort(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-autumn-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-autumn-primary/30 focus:border-autumn-primary transition"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div className="text-center py-12 text-rose-500">
                        <p>{error}</p>
                        <button
                            onClick={() => { setPage(1); setSearch(""); setCategory("All") }}
                            className="mt-4 px-4 py-2 rounded-lg bg-autumn-primary text-white text-sm hover:bg-autumn-primary-hover transition"
                        >
                            Reset filters
                        </button>
                    </div>
                )}

                {/* Grid */}
                {!error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading
                            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductSkeleton key={i} />)
                            : products.length > 0
                                ? products.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        id={p.id}
                                        name={p.name}
                                        price={Number(p.price)}
                                        image={p.thumbnail ?? "/images/app1.jpg"}
                                        rating={p.rating}
                                    />
                                ))
                                : (
                                    <div className="col-span-full text-center py-24 text-autumn-muted">
                                        <p className="text-lg">No products found.</p>
                                        <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                                    </div>
                                )
                        }
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-10">
                        <button
                            onClick={() => handlePage(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg border border-autumn-border text-sm hover:bg-autumn-surface disabled:opacity-40 transition"
                        >
                            ← Prev
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            const p = i + 1
                            if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                                return (
                                    <button
                                        key={p}
                                        onClick={() => handlePage(p)}
                                        className={`w-9 h-9 rounded-lg text-sm transition ${p === page
                                            ? "bg-autumn-primary text-white font-semibold"
                                            : "border border-autumn-border hover:bg-autumn-surface"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                )
                            }
                            if (Math.abs(p - page) === 2) {
                                return <span key={p} className="text-autumn-muted text-sm">…</span>
                            }
                            return null
                        })}

                        <button
                            onClick={() => handlePage(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-lg border border-autumn-border text-sm hover:bg-autumn-surface disabled:opacity-40 transition"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
