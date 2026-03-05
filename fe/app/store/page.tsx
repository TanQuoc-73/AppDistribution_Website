"use client"

import { useState, useMemo } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ProductCard from "@/components/product/product-card"

const allProducts = [
    { id: 1, name: "AI Image Generator", price: 19.99, image: "/images/app1.jpg", rating: 4.8, category: "AI Tools" },
    { id: 2, name: "Code Editor Pro", price: 29.99, image: "/images/app2.jpg", rating: 4.6, category: "Developer Tools" },
    { id: 3, name: "Cloud Storage Plus", price: 9.99, image: "/images/app3.jpg", rating: 4.3, category: "Office" },
    { id: 4, name: "Photo Retouch Studio", price: 14.99, image: "/images/app4.jpg", rating: 4.7, category: "Design" },
    { id: 5, name: "Video Editor Pro", price: 39.99, image: "/images/app5.jpg", rating: 4.9, category: "Design" },
    { id: 6, name: "3D Design Studio", price: 49.99, image: "/images/app6.jpg", rating: 4.5, category: "Design" },
    { id: 7, name: "Music Producer Suite", price: 34.99, image: "/images/app7.jpg", rating: 4.4, category: "Design" },
    { id: 8, name: "Task Manager Elite", price: 12.99, image: "/images/app8.jpg", rating: 4.7, category: "Office" },
    { id: 9, name: "Space Explorer", price: 4.99, image: "/images/app1.jpg", rating: 4.2, category: "Game" },
    { id: 10, name: "Git Dashboard", price: 19.99, image: "/images/app2.jpg", rating: 4.8, category: "Developer Tools" },
    { id: 11, name: "ChatBot Builder", price: 24.99, image: "/images/app3.jpg", rating: 4.1, category: "AI Tools" },
    { id: 12, name: "Spreadsheet Pro", price: 15.99, image: "/images/app4.jpg", rating: 4.0, category: "Office" },
]

const categories = ["All", "Game", "Developer Tools", "AI Tools", "Office", "Design"]
const sortOptions = [
    { label: "Popular", value: "popular" },
    { label: "Newest", value: "newest" },
    { label: "Price Low to High", value: "price-asc" },
    { label: "Price High to Low", value: "price-desc" },
]

export default function StorePage() {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [maxPrice, setMaxPrice] = useState(100)
    const [sort, setSort] = useState("popular")

    const filtered = useMemo(() => {
        let list = allProducts

        if (search) {
            list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        }
        if (category !== "All") {
            list = list.filter((p) => p.category === category)
        }
        list = list.filter((p) => p.price <= maxPrice)

        switch (sort) {
            case "price-asc":
                list = [...list].sort((a, b) => a.price - b.price)
                break
            case "price-desc":
                list = [...list].sort((a, b) => b.price - a.price)
                break
            case "newest":
                list = [...list].sort((a, b) => b.id - a.id)
                break
            default:
                list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        }

        return list
    }, [search, category, maxPrice, sort])

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">Store</h1>

                {/* Filters bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search apps…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />

                    {/* Category */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    {/* Price filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 whitespace-nowrap">Max $</label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-28 accent-indigo-600"
                        />
                        <span className="text-sm font-medium text-gray-700 w-10">${maxPrice}</span>
                    </div>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                        {sortOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>

                </div>

                {/* Product grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filtered.map((p) => (
                            <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} image={p.image} rating={p.rating} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 text-gray-400">
                        <p className="text-lg">No products found.</p>
                    </div>
                )}

            </div>

            <Footer />
        </main>
    )
}
