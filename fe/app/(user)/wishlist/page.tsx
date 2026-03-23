'use client';

import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { data: products, isLoading } = useWishlist();
  const { mutate: remove } = useRemoveFromWishlist();

  if (isLoading) return <div className="py-20 text-center text-neutral-400">Loading…</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Wishlist</h1>
      {!products?.length ? (
        <p className="text-neutral-400">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                onClick={() => remove(product.id)}
                className="absolute right-2 top-2 rounded bg-black/50 px-2 py-1 text-xs text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
