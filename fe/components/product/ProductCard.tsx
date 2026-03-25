import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon } from 'lucide-react';
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

  const rating = product.averageRating ? parseFloat(product.averageRating) : 0;
  const devName = product.developer?.companyName || (product.developer as any)?.name;

  return (
    <Link
      href={`/store/${product.slug}`}
      className="autumn-card group flex flex-col overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-amber-950/30">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-amber-800/50">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        {product.discountPercent > 0 && !product.isFree && (
          <span className="absolute right-2 top-2 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 px-1.5 py-0.5 text-xs font-bold text-white shadow-lg">
            -{product.discountPercent}%
          </span>
        )}
        {product.isFree && (
          <span className="absolute left-2 top-2 rounded-md bg-amber-600 px-1.5 py-0.5 text-xs font-bold text-white">
            FREE
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-amber-50">{product.name}</h3>
        {devName && (
          <p className="text-xs text-amber-400/50">{devName}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Rating */}
          <span className="text-xs text-amber-400/70">
            <span className="text-amber-500">★</span> {rating.toFixed(1)}
            {product.reviewCount != null && <span className="text-amber-600/50"> ({product.reviewCount})</span>}
          </span>

          {/* Price */}
          <div className="flex items-center gap-1.5">
            {product.discountPercent > 0 && !product.isFree && (
              <span className="text-xs text-amber-600/40 line-through">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            )}
            <span className={`text-sm font-semibold ${product.isFree ? 'text-amber-400' : 'text-amber-50'}`}>
              {product.isFree ? 'Free' : `$${discountedPrice}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
