import { productsApi } from '@/lib/api/endpoints';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/product/AddToCartButton';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product;
  try {
    const res = await productsApi.getBySlug(slug);
    product = res.data.data;
  } catch {
    notFound();
  }

  const finalPrice = product.isFree
    ? 'Free'
    : product.discountPercent > 0
      ? `$${(parseFloat(product.price) * (1 - product.discountPercent / 100)).toFixed(2)}`
      : `$${parseFloat(product.price).toFixed(2)}`;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: main info */}
        <div className="lg:col-span-2">
          <h1 className="mb-2 text-3xl font-bold text-white">{product.name}</h1>
          <p className="mb-4 text-neutral-400">{product.developer?.companyName}</p>

          {product.thumbnailUrl && (
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg bg-neutral-800">
              <Image
                src={product.thumbnailUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-neutral-300">{product.description}</p>
          </div>
        </div>

        {/* Right: purchase panel */}
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          {product.thumbnailUrl && (
            <div className="relative mb-4 aspect-video overflow-hidden rounded bg-neutral-800">
              <Image src={product.thumbnailUrl} alt={product.name} fill className="object-cover" />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3">
            {product.discountPercent > 0 && !product.isFree && (
              <>
                <span className="rounded bg-green-700 px-2 py-0.5 text-sm font-bold text-white">
                  -{product.discountPercent}%
                </span>
                <span className="text-sm text-neutral-500 line-through">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </>
            )}
            <span className="text-2xl font-bold text-white">{finalPrice}</span>
          </div>

          <AddToCartButton productId={product.id} isFree={product.isFree} />

          <p className="mt-3 text-xs text-neutral-500">
            ★ {parseFloat(product.averageRating).toFixed(1)} · {product.reviewCount} reviews
          </p>
        </div>
      </div>
    </div>
  );
}
