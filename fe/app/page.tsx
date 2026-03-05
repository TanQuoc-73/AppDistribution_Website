import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import HeroBanner from "@/components/store/hero-banner"
import FeaturedProducts from "@/components/store/featured-products"
import Categories from "@/components/store/categories"
import TrendingProducts from "@/components/store/trending-products"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-autumn-bg">

      <Navbar />

      <HeroBanner />

      <div className="space-y-0">
        <FeaturedProducts />
        <Categories />
        <TrendingProducts />
      </div>

      <Footer />

    </main>
  )
}