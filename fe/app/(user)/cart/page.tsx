'use client';

import { useCart, useRemoveFromCart, useClearCart } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { data: items, isLoading } = useCart();
  const { mutate: removeItem } = useRemoveFromCart();
  const { mutate: clearCart } = useClearCart();
  const router = useRouter();

  if (isLoading) return <div className="py-20 text-center text-neutral-400">Loading cart…</div>;

  const total = (items ?? []).reduce((sum, item) => {
    const price = parseFloat(item.product.price);
    const disc = item.product.discountPercent;
    return sum + price * (1 - disc / 100);
  }, 0);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Giỏ hàng</h1>

      {!items?.length ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-neutral-400">Giỏ hàng trống.</p>
          <Link href="/store" className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-500">
            Khám phá cửa hàng
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
              {item.product.thumbnailUrl && (
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-neutral-800">
                  <Image src={item.product.thumbnailUrl} alt={item.product.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <Link href={`/store/${item.product.slug}`} className="font-medium hover:text-blue-400">
                  {item.product.name}
                </Link>
                <p className="text-sm text-neutral-400">
                  {item.product.isFree ? 'Miễn phí' : `$${(parseFloat(item.product.price) * (1 - item.product.discountPercent / 100)).toFixed(2)}`}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Xoá
              </button>
            </div>
          ))}

          <div className="mt-4 flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <span className="text-lg font-semibold">Tổng: ${total.toFixed(2)}</span>
            <div className="flex gap-3">
              <button onClick={() => clearCart()} className="text-sm text-neutral-400 hover:text-white">
                Xoá giỏ
              </button>
              <button
                onClick={() => router.push('/checkout')}
                className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-500"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

