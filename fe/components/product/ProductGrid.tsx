import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-amber-900/20 bg-amber-950/20">
            <div className="aspect-video w-full rounded-t-2xl bg-amber-900/20" />
            <div className="p-3">
              <div className="mb-2 h-4 rounded bg-amber-900/20" />
              <div className="h-3 w-1/2 rounded bg-amber-900/15" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="mb-4 text-4xl">🍂</div>
        <p className="text-lg font-medium text-amber-200/60">Không tìm thấy ứng dụng nào</p>
        <p className="mt-1 text-sm text-amber-400/40">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
