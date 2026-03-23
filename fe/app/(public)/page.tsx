import Link from 'next/link';
import { bannersApi, productsApi, categoriesApi } from '@/lib/api/endpoints';
import ProductGrid from '@/components/product/ProductGrid';

export default async function HomePage() {
  const [bannersRes, featuredRes, categoriesRes] = await Promise.allSettled([
    bannersApi.getActive(),
    productsApi.getAll({ sort: 'popular', limit: 8 }),
    categoriesApi.getAll(),
  ]);

  const banners = bannersRes.status === 'fulfilled' ? bannersRes.value.data.data : [];
  const featured = featuredRes.status === 'fulfilled' ? featuredRes.value.data.data : [];
  const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data.data : [];

  return (
    <div>
      {/* Hero / banners */}
      {banners.length > 0 && (
        <section className="relative h-[480px] bg-neutral-900">
          <div className="mx-auto flex h-full max-w-7xl items-end px-4 pb-10">
            <div className="max-w-lg">
              <h1 className="mb-3 text-4xl font-bold text-white">{banners[0].title}</h1>
              {banners[0].linkUrl && (
                <Link
                  href={banners[0].linkUrl}
                  className="inline-block rounded bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-500"
                >
                  Explore
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto max-w-7xl px-4 py-10">
        {/* Categories */}
        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-white">Browse by Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/store?categoryId=${cat.id}`}
                  className="rounded-full border border-neutral-700 px-4 py-1.5 text-sm text-neutral-300 transition hover:border-neutral-400 hover:text-white"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Popular Apps</h2>
            <Link href="/store" className="text-sm text-blue-400 hover:text-blue-300">
              View all →
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      </div>
    </div>
  );
}
