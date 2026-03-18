"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import api from "@/services/api"
import { productService } from "@/services/product.service"
import { useAuthStore } from "@/store/authStore"

interface LibraryItem {
    id: string
    productId: string
    licenseKey: string | null
    purchaseDate: string
    product: {
        id: string
        name: string
        thumbnail: string | null
        versions?: { version: string; downloadUrl: string | null }[]
    }
}

export default function LibraryPage() {
    const router = useRouter()
    const { isLoggedIn, hasHydrated } = useAuthStore()
    const [items, setItems] = useState<LibraryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState<string | null>(null)

    useEffect(() => {
        // Đợi Zustand hydrate xong rồi mới quyết định redirect
        if (!hasHydrated) return

        // Nếu chưa đăng nhập thì chuyển sang trang login
        if (!isLoggedIn) {
            router.replace("/auth/login?redirect=/library")
            return
        }

        api.get("/library")
            .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false))
    }, [isLoggedIn, hasHydrated, router])

    const handleDownload = async (productId: string) => {
        setDownloading(productId)
        try {
            const versions = await productService.getVersions(productId)
            const latest = versions[0]
            if (latest?.downloadUrl) {
                window.open(latest.downloadUrl, "_blank")
            } else {
                alert("No download available for this product yet.")
            }
        } catch {
            alert("Failed to fetch download link.")
        } finally {
            setDownloading(null)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-autumn-bg">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <h1 className="text-3xl font-extrabold text-autumn-text mb-8">My Library</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-autumn-border p-5 flex items-center gap-4 animate-pulse">
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
                    <div className="text-6xl mb-6">📚</div>
                    <h1 className="text-2xl font-bold text-autumn-text mb-2">Your library is empty</h1>
                    <p className="text-autumn-muted mb-6">Purchase apps from the store to see them here.</p>
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
                <h1 className="text-3xl font-extrabold text-autumn-text mb-8">My Library</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => {
                        const latestVersion = item.product.versions?.[0]
                        return (
                            <div key={item.id} className="bg-white rounded-2xl border border-autumn-border p-5 shadow-sm flex items-center gap-4">
                                <img
                                    src={item.product.thumbnail ?? "/images/app1.jpg"}
                                    alt={item.product.name}
                                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <Link href={`/store/product/${item.product.id}`}>
                                        <h3 className="font-semibold text-autumn-text truncate hover:text-autumn-primary transition">{item.product.name}</h3>
                                    </Link>
                                    {latestVersion && (
                                        <p className="text-xs text-autumn-muted">v{latestVersion.version}</p>
                                    )}
                                    {item.licenseKey && (
                                        <p className="text-xs text-autumn-muted mt-1 font-mono truncate" title={item.licenseKey}>
                                            🔑 {item.licenseKey.substring(0, 16)}…
                                        </p>
                                    )}
                                    <p className="text-xs text-autumn-muted mt-1">
                                        Purchased: {new Date(item.purchaseDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDownload(item.product.id)}
                                    disabled={downloading === item.product.id}
                                    className="px-3 py-2 rounded-lg bg-autumn-primary text-white text-xs font-semibold hover:bg-autumn-primary-hover transition disabled:opacity-60 flex-shrink-0"
                                >
                                    {downloading === item.product.id ? "…" : "⬇ Download"}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Footer />
        </main>
    )
}
