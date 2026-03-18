"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ProductGallery from "@/components/product/product-gallery"
import { productService } from "@/services/product.service"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import type { Product } from "@/types/product"
import api from "@/services/api"

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${s <= Math.round(rating) ? "text-amber-400" : "text-autumn-border"}`}
                    viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="ml-2 text-sm text-autumn-muted">{Number(rating).toFixed(1)}</span>
        </div>
    )
}

type Review = { id: string; rating: number; comment: string | null; createdAt: string; user: { username: string | null; avatarUrl: string | null } }

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const addToCart = useCartStore((s) => s.addToCart)
    const inCart = useCartStore((s) => s.items.some((it) => it.product.id === id))
    const { user, isLoggedIn } = useAuthStore()

    const [product, setProduct] = useState<Product | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [wishlisted, setWishlisted] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "versions">("overview")

    // Review form
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewComment, setReviewComment] = useState("")
    const [submittingReview, setSubmittingReview] = useState(false)

    useEffect(() => {
        setLoading(true)
        productService.getProductById(id)
            .then((p) => {
                setProduct(p)
                setReviews((p as any).reviews ?? [])
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [id])

    const handleAddToCart = () => {
        if (!product) return
        if (inCart) {
            router.push("/cart")
            return
        }
        addToCart(product)
    }

    const handleWishlist = async () => {
        if (!isLoggedIn) { router.push("/auth/login"); return }
        setWishlistLoading(true)
        try {
            if (wishlisted) {
                await api.delete(`/wishlist/product/${id}`)
                setWishlisted(false)
            } else {
                await api.post("/wishlist", { productId: id })
                setWishlisted(true)
            }
        } catch { }
        finally { setWishlistLoading(false) }
    }

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoggedIn) { router.push("/auth/login"); return }
        if (!reviewComment.trim()) return
        setSubmittingReview(true)
        try {
            const res = await api.post("/reviews", { productId: id, rating: reviewRating, comment: reviewComment.trim() })
            setReviews([res.data, ...reviews])
            setReviewComment("")
            setReviewRating(5)
        } catch { }
        finally { setSubmittingReview(false) }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-autumn-bg">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="aspect-[4/3] rounded-2xl bg-autumn-surface" />
                        <div className="space-y-4">
                            <div className="h-10 bg-autumn-surface rounded w-3/4" />
                            <div className="h-5 bg-autumn-surface rounded w-1/3" />
                            <div className="h-8 bg-autumn-surface rounded w-1/4" />
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    if (notFound || !product) {
        return (
            <main className="min-h-screen bg-autumn-bg">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-3xl font-bold text-autumn-text mb-4">Product not found</h1>
                    <Link href="/store" className="text-autumn-primary hover:underline">← Back to Store</Link>
                </div>
                <Footer />
            </main>
        )
    }

    const images = [
        product.thumbnail ?? "/images/app1.jpg",
        ...(product.screenshots?.map((s) => s.imageUrl) ?? []),
    ]

    const avgRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null

    return (
        <main className="min-h-screen bg-autumn-bg">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Breadcrumb */}
                <nav className="text-sm text-autumn-muted mb-8 flex items-center gap-2">
                    <Link href="/" className="hover:text-autumn-primary transition">Home</Link>
                    <span>›</span>
                    <Link href="/store" className="hover:text-autumn-primary transition">Store</Link>
                    {product.category && (<><span>›</span><span>{product.category.name}</span></>)}
                    <span>›</span>
                    <span className="text-autumn-text font-medium">{product.name}</span>
                </nav>

                {/* Top: Gallery + Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <ProductGallery images={images} alt={product.name} />

                    <div className="flex flex-col gap-5">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-autumn-text">{product.name}</h1>

                        {product.developer && (
                            <p className="text-sm text-autumn-muted">
                                by <span className="font-medium text-autumn-primary">{product.developer.name}</span>
                            </p>
                        )}

                        {avgRating !== null && <Stars rating={avgRating} />}
                        <p className="text-xs text-autumn-muted">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>

                        <p className="text-3xl font-bold text-autumn-accent">
                            ${Number(product.price).toFixed(2)}
                        </p>

                        {product.category && (
                            <span className="w-fit px-3 py-1 rounded-full bg-autumn-surface text-autumn-primary text-xs font-medium">
                                {product.category.name}
                            </span>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 ${inCart
                                    ? "bg-emerald-500 text-white"
                                    : "bg-autumn-primary text-white hover:bg-autumn-primary-hover hover:shadow-lg hover:shadow-autumn-primary/30"
                                    }`}
                            >
                                {inCart ? "✓ In Cart" : "Add to Cart"}
                            </button>

                            <button
                                onClick={handleWishlist}
                                disabled={wishlistLoading}
                                className={`flex-1 py-3.5 rounded-xl font-semibold text-base border-2 transition-all duration-300 ${wishlisted
                                    ? "border-rose-500 text-rose-500 bg-rose-50"
                                    : "border-autumn-border text-autumn-text hover:border-rose-400 hover:text-rose-500"
                                    } disabled:opacity-60`}
                            >
                                {wishlisted ? "♥ Wishlisted" : "♡ Wishlist"}
                            </button>
                        </div>

                        {product.releaseDate && (
                            <p className="text-xs text-autumn-muted">
                                Released: {new Date(product.releaseDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-14">
                    <div className="flex gap-1 border-b border-autumn-border mb-8">
                        {(["overview", "reviews", "versions"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-3 text-sm font-semibold capitalize transition-colors duration-200 border-b-2 -mb-[1px] ${activeTab === tab
                                    ? "border-autumn-primary text-autumn-primary"
                                    : "border-transparent text-autumn-muted hover:text-autumn-text"
                                    }`}
                            >
                                {tab} {tab === "reviews" && `(${reviews.length})`}
                            </button>
                        ))}
                    </div>

                    {/* Overview */}
                    {activeTab === "overview" && (
                        <div className="prose prose-sm max-w-none text-autumn-text">
                            <p className="leading-relaxed text-autumn-muted whitespace-pre-wrap">
                                {product.description ?? "No description provided."}
                            </p>
                        </div>
                    )}

                    {/* Reviews */}
                    {activeTab === "reviews" && (
                        <div className="space-y-6">
                            {/* Submit form */}
                            <form onSubmit={handleReviewSubmit} className="bg-white rounded-xl border border-autumn-border p-6 shadow-sm">
                                <h3 className="font-semibold text-autumn-text mb-3">Write a Review</h3>
                                <div className="flex items-center gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button key={s} type="button" onClick={() => setReviewRating(s)}>
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                className={`h-6 w-6 transition-colors ${s <= reviewRating ? "text-amber-400" : "text-autumn-border"} hover:text-amber-300`}
                                                viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                                    rows={3} placeholder={isLoggedIn ? "Share your experience…" : "Please login to write a review"}
                                    disabled={!isLoggedIn}
                                    className="w-full px-4 py-3 rounded-lg border border-autumn-border text-sm focus:outline-none focus:ring-2 focus:ring-autumn-primary/30 transition resize-none mb-3 disabled:bg-gray-50"
                                />
                                <button type="submit" disabled={submittingReview || !isLoggedIn}
                                    className="px-6 py-2.5 rounded-lg bg-autumn-primary text-white text-sm font-semibold hover:bg-autumn-primary-hover transition disabled:opacity-60">
                                    {submittingReview ? "Submitting…" : "Submit Review"}
                                </button>
                            </form>

                            {/* Review list */}
                            {reviews.length === 0 ? (
                                <p className="text-autumn-muted text-center py-8">No reviews yet. Be the first!</p>
                            ) : (
                                reviews.map((r) => (
                                    <div key={r.id} className="bg-white rounded-xl border border-autumn-border p-5 shadow-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-autumn-primary flex items-center justify-center text-white text-xs font-bold">
                                                {(r.user.username ?? "U")[0].toUpperCase()}
                                            </div>
                                            <span className="font-medium text-autumn-text text-sm">{r.user.username ?? "Anonymous"}</span>
                                            <Stars rating={r.rating} />
                                            <span className="ml-auto text-xs text-autumn-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {r.comment && <p className="text-autumn-muted text-sm leading-relaxed">{r.comment}</p>}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Versions */}
                    {activeTab === "versions" && (
                        <div className="space-y-4">
                            {(!product.versions || product.versions.length === 0) ? (
                                <p className="text-autumn-muted text-center py-8">No version history available.</p>
                            ) : (
                                product.versions.map((v) => (
                                    <div key={v.id} className="bg-white rounded-xl border border-autumn-border p-5 shadow-sm flex items-start gap-4">
                                        <span className="px-3 py-1 rounded-full bg-autumn-surface text-autumn-primary text-xs font-bold mt-0.5">{v.version}</span>
                                        <div className="flex-1">
                                            {v.changelog && <p className="text-sm text-autumn-muted">{v.changelog}</p>}
                                            <p className="text-xs text-autumn-muted mt-1">{new Date(v.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {v.downloadUrl && (
                                            <a href={v.downloadUrl} target="_blank" rel="noreferrer"
                                                className="px-4 py-2 rounded-lg bg-autumn-primary text-white text-xs font-semibold hover:bg-autumn-primary-hover transition">
                                                Download
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}
