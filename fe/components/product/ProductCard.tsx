import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice =
    product.isFree
      ? 'Free'
      : product.discountPercent > 0
        ? (parseFloat(product.price) * (1 - product.discountPercent / 100)).toFixed(2)
        : parseFloat(product.price).toFixed(2);

  return (
    <Link
      href={`/store/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition hover:border-neutral-600"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-800">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-600">
            No image
          </div>
        )}
        {product.discountPercent > 0 && (
          <span className="absolute right-2 top-2 rounded bg-green-600 px-1.5 py-0.5 text-xs font-bold text-white">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-white">{product.name}</h3>
        {product.developer && (
          <p className="text-xs text-neutral-500">{product.developer.companyName}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Rating */}
          <span className="text-xs text-neutral-400">
            ★ {parseFloat(product.averageRating).toFixed(1)} ({product.reviewCount})
          </span>

          {/* Price */}
          <div className="flex items-center gap-1">
            {product.discountPercent > 0 && !product.isFree && (
              <span className="text-xs text-neutral-500 line-through">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            )}
            <span className="text-sm font-semibold text-white">
              {product.isFree ? 'Free' : `$${discountedPrice}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
