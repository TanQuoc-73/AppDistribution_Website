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
      className="btn-autumn w-full rounded-xl py-2.5 font-semibold text-white disabled:opacity-60"
    >
      {isPending ? 'Đang thêm…' : isFree ? 'Tải miễn phí' : 'Thêm vào giỏ'}
    </button>
  );
}
