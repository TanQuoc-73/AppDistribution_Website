"use client"

import { useEffect, useState } from "react"
import ProductCard from "../product/product-card"
import { ProductCardSkeleton } from "../ui/loading"
import ErrorDisplay from "../ui/error"
import { productService } from "@/services/product.service"

type FeaturedProduct = {
  id: number
  name: string
  price: number
  image: string | null
  rating: number | null
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const data = await productService.getFeatured()
        if (!cancelled) {
          setProducts(data as unknown as FeaturedProduct[])
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load featured apps.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-autumn-text">
          Featured Apps
        </h2>
        <a
          href="/store"
          className="text-sm font-medium text-autumn-primary hover:text-autumn-primary-hover transition-colors duration-200"
        >
          View all →
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : error ? (
        <ErrorDisplay
          title="Couldn't load featured apps"
          message={error}
        />
      ) : products.length === 0 ? (
        <p className="text-autumn-muted">No featured apps yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              image={p.image || "/images/app-placeholder.jpg"}
              rating={p.rating ?? 0}
            />
          ))}
        </div>
      )}
    </section>
  )
}