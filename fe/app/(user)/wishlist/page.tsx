'use client';

import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/product/ProductCard';
import { Heart, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const { data: products, isLoading } = useWishlist();
  const { mutate: remove, isPending } = useRemoveFromWishlist();

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Heart className="h-6 w-6 text-pink-400" />
        <h1 className="text-2xl font-bold text-amber-50">My Wishlist</h1>
        {products?.length ? (
          <span className="rounded-full bg-amber-600/20 px-2.5 py-0.5 text-xs font-medium text-amber-300">
            {products.length} items
          </span>
        ) : null}
      </div>

      {!products?.length ? (
        <div className="rounded-xl border border-amber-900/20 bg-amber-950/10 py-16 text-center">
          <Heart className="mx-auto mb-3 h-10 w-10 text-amber-800/40" />
          <p className="text-amber-400/50">Your wishlist is empty.</p>
          <p className="mt-1 text-sm text-amber-400/30">Browse the store and add products you like!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product: any) => (
            <div key={product.id} className="group relative">
              <ProductCard product={product} />
              <button
                onClick={(e) => { e.preventDefault(); remove(product.id); }}
                disabled={isPending}
                className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1.5 text-xs text-red-400 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
