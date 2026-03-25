'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Check, ShoppingCart, Download } from 'lucide-react';
import { useAddToCart } from '@/hooks/useCart';
import { useLibrary } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCartFlyStore } from '@/stores/useCartFlyStore';
import { libraryApi, downloadsApi } from '@/lib/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface Props {
  productId: string;
  isFree: boolean;
  thumbnailUrl?: string | null;
}

export default function AddToCartButton({ productId, isFree, thumbnailUrl }: Props) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate, isPending } = useAddToCart();
  const triggerFly = useCartFlyStore((s) => s.trigger);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const [claiming, setClaiming] = useState(false);

  const inCart = useCartStore((s) => s.items.some((i) => i.productId === productId));
  const { data: library } = useLibrary();
  const purchased = library?.some((item: any) => item.id === productId) ?? false;

  async function handleClaimFree() {
    if (!user) {
      router.push('/login');
      return;
    }
    setClaiming(true);
    try {
      await libraryApi.claimFree(productId);
      queryClient.invalidateQueries({ queryKey: ['library'] });
      // Trigger download immediately
      const res = await downloadsApi.download(productId);
      const url = res.data?.data?.downloadUrl;
      if (url) window.open(url, '_blank');
      else router.push('/library');
    } catch {
      router.push('/library');
    } finally {
      setClaiming(false);
    }
  }

  function handleClick() {
    if (!user) {
      router.push('/login');
      return;
    }
    if (inCart || purchased) return;
    mutate(productId, {
      onSuccess: () => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          triggerFly(cx, cy, thumbnailUrl ?? null);
        }
      },
    });
  }

  if (purchased) {
    return (
      <Link
        href="/library"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700/30 py-2.5 text-center font-semibold text-emerald-300 ring-1 ring-emerald-700/50 transition hover:bg-emerald-700/50"
      >
        <Check className="h-4 w-4" />
        Đã mua — Vào thư viện
      </Link>
    );
  }

  // Free products: claim + download directly, skip cart/checkout
  if (isFree) {
    return (
      <button
        ref={buttonRef}
        onClick={handleClaimFree}
        disabled={claiming}
        className="flex w-full items-center justify-center gap-2 btn-autumn rounded-xl py-2.5 font-semibold text-white disabled:opacity-60"
      >
        <Download className="h-4 w-4" />
        {claiming ? 'Đang xử lý…' : 'Tải miễn phí'}
      </button>
    );
  }

  if (inCart) {
    return (
      <Link
        href="/cart"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700/20 py-2.5 text-center font-semibold text-amber-300 ring-1 ring-amber-700/50 transition hover:bg-amber-700/40"
      >
        <ShoppingCart className="h-4 w-4" />
        Đã có trong giỏ hàng
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={isPending}
      className="btn-autumn w-full rounded-xl py-2.5 font-semibold text-white disabled:opacity-60"
    >
      {isPending ? 'Đang thêm…' : 'Thêm vào giỏ'}
    </button>
  );
}
