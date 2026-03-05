"use client"

import { useState } from "react"
import { use } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ProductCard from "@/components/product/product-card"

const allProducts = [
    { id: 1, name: "AI Image Generator", price: 19.99, image: "/images/app1.jpg", rating: 4.8, category: "ai-tools" },
    { id: 2, name: "Code Editor Pro", price: 29.99, image: "/images/app2.jpg", rating: 4.6, category: "developer-tools" },
    { id: 3, name: "Cloud Storage Plus", price: 9.99, image: "/images/app3.jpg", rating: 4.3, category: "office" },
    { id: 4, name: "Photo Retouch Studio", price: 14.99, image: "/images/app4.jpg", rating: 4.7, category: "design" },
    { id: 5, name: "Video Editor Pro", price: 39.99, image: "/images/app5.jpg", rating: 4.9, category: "design" },
    { id: 6, name: "3D Design Studio", price: 49.99, image: "/images/app6.jpg", rating: 4.5, category: "design" },
    { id: 7, name: "Music Producer Suite", price: 34.99, image: "/images/app7.jpg", rating: 4.4, category: "design" },
    { id: 8, name: "Task Manager Elite", price: 12.99, image: "/images/app8.jpg", rating: 4.7, category: "office" },
    { id: 9, name: "Space Explorer", price: 4.99, image: "/images/app1.jpg", rating: 4.2, category: "game" },
    { id: 10, name: "Git Dashboard", price: 19.99, image: "/images/app2.jpg", rating: 4.8, category: "developer-tools" },
    { id: 11, name: "ChatBot Builder", price: 24.99, image: "/images/app3.jpg", rating: 4.1, category: "ai-tools" },
    { id: 12, name: "Spreadsheet Pro", price: 15.99, image: "/images/app4.jpg", rating: 4.0, category: "office" },
]

const ITEMS_PER_PAGE = 8

const slugToTitle: Record<string, string> = {
    game: "Game",
    "developer-tools": "Developer Tools",
    "ai-tools": "AI Tools",
    office: "Office",
    design: "Design",
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [page, setPage] = useState(1)

    const title = slugToTitle[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    const products = allProducts.filter((p) => p.category === slug)

    const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE))
    const paginated = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-500 mb-8">{products.length} app{products.length !== 1 ? "s" : ""} found</p>

                {paginated.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {paginated.map((p) => (
                            <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.image} rating={p.rating} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 text-gray-400">
                        <p className="text-lg">No products in this category yet.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            ← Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition ${n === page
                                        ? "bg-indigo-600 text-white"
                                        : "border border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {n}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-100 transition"
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
