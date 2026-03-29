'use client';

import { Heart } from 'lucide-react';
import { useCheckWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { useAuthStore } from '@/stores/useAuthStore';

interface Props {
  productId: string;
  size?: 'sm' | 'md';
}

export default function WishlistButton({ productId, size = 'md' }: Props) {
  const user = useAuthStore((s) => s.user);
  const { data: wishlisted } = useCheckWishlist(productId);
  const { mutate: add, isPending: isAdding } = useAddToWishlist();
  const { mutate: remove, isPending: isRemoving } = useRemoveFromWishlist();

  if (!user) return null;

  const pending = isAdding || isRemoving;
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlisted) {
          remove(productId);
        } else {
          add(productId);
        }
      }}
      disabled={pending}
      className={`flex items-center justify-center gap-1.5 rounded-lg border transition ${
        wishlisted
          ? 'border-pink-600/40 bg-pink-600/10 text-pink-400 hover:bg-pink-600/20'
          : 'border-amber-800/30 bg-amber-950/20 text-amber-400/50 hover:border-amber-700/40 hover:text-amber-300'
      } ${size === 'sm' ? 'p-1.5' : 'px-3 py-2 text-sm'} disabled:opacity-50`}
      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={`${iconSize} ${wishlisted ? 'fill-pink-400' : ''}`} />
      {size === 'md' && (
        <span>{wishlisted ? 'Wishlisted' : 'Wishlist'}</span>
      )}
    </button>
  );
}
