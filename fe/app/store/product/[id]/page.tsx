"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ProductGallery from "@/components/product/product-gallery"
import ProductReviews from "@/components/product/product-reviews"

/* ── Mock data ────────────────────────────────────────────── */
const mockProducts: Record<string, {
    id: number
    name: string
    developer: string
    description: string
    price: number
    rating: number
    image: string
    screenshots: string[]
    reviews: { user: string; rating: number; comment: string; date: string }[]
}> = {
    "1": {
        id: 1,
        name: "AI Image Generator",
        developer: "NovaTech Labs",
        description:
            "Transform your creative ideas into stunning images with our state-of-the-art AI engine. Supports multiple art styles, resolution up to 4K, batch processing, and seamless export to all popular formats. Perfect for designers, marketers, and content creators.",
        price: 19.99,
        rating: 4.8,
        image: "/images/app1.jpg",
        screenshots: ["/images/app1.jpg", "/images/app2.jpg", "/images/app3.jpg"],
        reviews: [
            { user: "Alice", rating: 5, comment: "Incredible quality! Changed my workflow completely.", date: "2026-02-15" },
            { user: "Bob", rating: 4, comment: "Great tool, a few UI tweaks would make it perfect.", date: "2026-02-10" },
            { user: "Carol", rating: 5, comment: "Best AI image tool I've ever used.", date: "2026-01-28" },
        ],
    },
    "2": {
        id: 2,
        name: "Code Editor Pro",
        developer: "DevStack Inc.",
        description:
            "A powerful code editor built for speed. Features intelligent autocompletion, real-time collaboration, built-in terminal, Git integration, and support for 50+ programming languages with customisable themes.",
        price: 29.99,
        rating: 4.6,
        image: "/images/app2.jpg",
        screenshots: ["/images/app2.jpg", "/images/app3.jpg", "/images/app4.jpg"],
        reviews: [
            { user: "Dave", rating: 5, comment: "Finally a lightweight yet powerful editor!", date: "2026-02-20" },
            { user: "Eve", rating: 4, comment: "Love the Git integration.", date: "2026-02-05" },
        ],
    },
}

/* ── Star rating helper ───────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg
                    key={s}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-300"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="ml-2 text-sm text-gray-500">{Number(rating).toFixed(1)}</span>
        </div>
    )
}

/* ── Page component ───────────────────────────────────────── */
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [wishlisted, setWishlisted] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)

    const { id } = use(params)
    const product = mockProducts[id]

    if (!product) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h1>
                    <Link href="/" className="text-indigo-600 hover:underline">Go back home</Link>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* ── Top section: Gallery + Info ────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Left — Gallery */}
                    <ProductGallery images={[product.image, ...product.screenshots]} alt={product.name} />

                    {/* Right — Product info */}
                    <div className="flex flex-col gap-5">

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                            {product.name}
                        </h1>

                        <p className="text-sm text-gray-500">
                            by <span className="font-medium text-indigo-600">{product.developer}</span>
                        </p>

                        <Stars rating={product.rating} />

                        <p className="text-3xl font-bold text-indigo-600">
                            ${Number(product.price).toFixed(2)}
                        </p>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                            <button
                                onClick={() => setAddedToCart(true)}
                                className={`flex-1 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 ${addedToCart
                                    ? "bg-emerald-500 text-white"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
                                    }`}
                            >
                                {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
                            </button>

                            <button
                                onClick={() => setWishlisted(!wishlisted)}
                                className={`flex-1 py-3.5 rounded-xl font-semibold text-base border-2 transition-all duration-300 ${wishlisted
                                    ? "border-rose-500 text-rose-500 bg-rose-50"
                                    : "border-gray-300 text-gray-700 hover:border-rose-400 hover:text-rose-500"
                                    }`}
                            >
                                {wishlisted ? "♥ Wishlisted" : "♡ Wishlist"}
                            </button>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                    </div>

                </div>

                {/* ── Screenshots ───────────────────────────────────── */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Screenshots</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {product.screenshots.map((src, idx) => (
                            <div key={idx} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200">
                                <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full aspect-video object-cover" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Reviews ───────────────────────────────────────── */}
                <section className="mt-16 mb-8">
                    <ProductReviews reviews={product.reviews} />
                </section>

            </div>

            <Footer />
        </main>
    )
}
