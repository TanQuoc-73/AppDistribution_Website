import ProductCard from "../product/product-card"

const products = [
  {
    id: 5,
    name: "Video Editor Pro",
    price: 39.99,
    image: "/images/app5.jpg",
    rating: 4.9,
  },
  {
    id: 6,
    name: "3D Design Studio",
    price: 49.99,
    image: "/images/app6.jpg",
    rating: 4.5,
  },
  {
    id: 7,
    name: "Music Producer Suite",
    price: 34.99,
    image: "/images/app7.jpg",
    rating: 4.4,
  },
  {
    id: 8,
    name: "Task Manager Elite",
    price: 12.99,
    image: "/images/app8.jpg",
    rating: 4.7,
  },
]

export default function TrendingProducts() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-autumn-text">
          🍂 Trending Apps
        </h2>
        <a href="/store" className="text-sm font-medium text-autumn-primary hover:text-autumn-primary-hover transition-colors duration-200">
          View all →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            image={p.image}
            rating={p.rating}
          />
        ))}
      </div>

    </section>
  )
}