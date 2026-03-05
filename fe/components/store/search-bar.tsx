"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

const mockProducts = [
    { id: 1, name: "AI Image Generator", image: "/images/app1.jpg", price: 19.99 },
    { id: 2, name: "Code Editor Pro", image: "/images/app2.jpg", price: 29.99 },
    { id: 3, name: "Cloud Storage Plus", image: "/images/app3.jpg", price: 9.99 },
    { id: 4, name: "Photo Retouch Studio", image: "/images/app4.jpg", price: 14.99 },
    { id: 5, name: "Video Editor Pro", image: "/images/app5.jpg", price: 39.99 },
    { id: 6, name: "3D Design Studio", image: "/images/app6.jpg", price: 49.99 },
    { id: 7, name: "Music Producer Suite", image: "/images/app7.jpg", price: 34.99 },
    { id: 8, name: "Task Manager Elite", image: "/images/app8.jpg", price: 12.99 },
]

export default function SearchBar() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<typeof mockProducts>([])
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setOpen(false)
            return
        }
        const timer = setTimeout(() => {
            const filtered = mockProducts.filter((p) =>
                p.name.toLowerCase().includes(query.toLowerCase())
            )
            setResults(filtered)
            setOpen(true)
        }, 300)
        return () => clearTimeout(timer)
    }, [query])

    // Close on click outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    return (
        <div ref={wrapperRef} className="relative w-full max-w-xs">
            <input
                type="text"
                placeholder="Search apps…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                className="w-full px-4 py-2 rounded-lg border border-autumn-border bg-white text-sm text-autumn-text placeholder-autumn-muted/60 focus:outline-none focus:ring-2 focus:ring-autumn-primary/30 focus:border-autumn-primary transition-all duration-200"
            />

            {/* Dropdown */}
            {open && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-autumn-border overflow-hidden z-50 max-h-80 overflow-y-auto">
                    {results.map((p) => (
                        <Link
                            key={p.id}
                            href={`/store/product/${p.id}`}
                            onClick={() => { setOpen(false); setQuery("") }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-autumn-surface transition-colors duration-150"
                        >
                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-autumn-text truncate">{p.name}</p>
                                <p className="text-xs text-autumn-accent font-semibold">${p.price.toFixed(2)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {open && query && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-autumn-border p-4 text-sm text-autumn-muted text-center z-50">
                    No results found
                </div>
            )}
        </div>
    )
}
