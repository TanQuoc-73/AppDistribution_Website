"use client"

import { useState } from "react"

type Props = {
    images: string[]
    alt?: string
}

export default function ProductGallery({ images, alt = "Product image" }: Props) {
    const [activeIndex, setActiveIndex] = useState(0)

    if (!images.length) return null

    return (
        <div className="space-y-4">
            {/* Main image */}
            <div className="rounded-xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(197,106,58,0.06)] border border-autumn-border">
                <img
                    src={images[activeIndex]}
                    alt={`${alt} - main`}
                    className="w-full aspect-[4/3] object-cover transition-opacity duration-300"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((src, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${idx === activeIndex
                                ? "border-autumn-primary ring-2 ring-autumn-primary/20"
                                : "border-autumn-border hover:border-autumn-muted"
                                }`}
                        >
                            <img
                                src={src}
                                alt={`${alt} thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
