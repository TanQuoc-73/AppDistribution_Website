"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { wishlistService } from "@/services/wishlist.service"
import { useCartStore } from "@/store/cartStore"

interface WishlistItem {
    id: string
    productId: string
    createdAt: string
    product: {
        id: string
        name: string
        price: number
        thumbnail: string | null
        category?: { name: string } | null
    }
}

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)
    const [removing, setRemoving] = useState<string | null>(null)
    const addToCart = useCartStore((s) => s.addToCart)

    useEffect(() => {
        wishlistService.getWishlist()
            .then(setItems)
            .catch(() => setItems([]))
            .finally(() => setLoading(false))
    }, [])

    const handleRemove = async (wishlistId: string) => {
        setRemoving(wishlistId)
        try {
            await wishlistService.remove(wishlistId)
            setItems((prev) => prev.filter((i) => i.id !== wishlistId))
        } catch { }
        finally { setRemoving(null) }
    }

    const handleAddToCart = (item: WishlistItem) => {
        addToCart({ id: item.product.id, name: item.product.name, price: item.product.price, thumbnail: item.product.thumbnail })
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-autumn-bg">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
                    <div className="h-10 bg-autumn-surface rounded w-48 mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-autumn-border p-5 flex gap-4">
                                <div className="w-16 h-16 rounded-xl bg-autumn-surface" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-autumn-surface rounded w-3/4" />
                                    <div className="h-3 bg-autumn-surface rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-autumn-bg">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="text-6xl mb-6">🤍</div>
                    <h1 className="text-2xl font-bold text-autumn-text mb-2">Your wishlist is empty</h1>
                    <p className="text-autumn-muted mb-6">Save apps you're interested in to find them later.</p>
                    <Link href="/store" className="px-6 py-3 rounded-xl bg-autumn-primary text-white font-semibold hover:bg-autumn-primary-hover transition">
                        Browse Store
                    </Link>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-autumn-bg">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-extrabold text-autumn-text mb-2">My Wishlist</h1>
                <p className="text-autumn-muted text-sm mb-8">{items.length} item{items.length !== 1 ? "s" : ""}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-autumn-border p-5 shadow-sm flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <img
                                    src={item.product.thumbnail ?? "/images/app1.jpg"}
                                    alt={item.product.name}
                                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <Link href={`/store/product/${item.product.id}`}>
                                        <h3 className="font-semibold text-autumn-text truncate hover:text-autumn-primary transition">{item.product.name}</h3>
                                    </Link>
                                    {item.product.category && (
                                        <span className="text-xs text-autumn-muted">{item.product.category.name}</span>
                                    )}
                                    <p className="text-base font-bold text-autumn-accent mt-1">
                                        ${Number(item.product.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="flex-1 py-2 rounded-lg bg-autumn-primary text-white text-sm font-semibold hover:bg-autumn-primary-hover transition"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    disabled={removing === item.id}
                                    className="px-3 py-2 rounded-lg border border-autumn-border text-autumn-muted text-sm hover:text-rose-500 hover:border-rose-300 transition disabled:opacity-60"
                                >
                                    {removing === item.id ? "…" : "✕"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    )
}
