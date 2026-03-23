'use client';

import { useAddToCart } from '@/hooks/useCart';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

interface Props {
  productId: string;
  isFree: boolean;
}

export default function AddToCartButton({ productId, isFree }: Props) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate, isPending } = useAddToCart();

  function handleClick() {
    if (!user) {
      router.push('/login');
      return;
    }
    mutate(productId);
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="w-full rounded bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
    >
      {isPending ? 'Adding…' : isFree ? 'Get for Free' : 'Add to Cart'}
    </button>
  );
}
