'use client';

import { libraryApi } from '@/lib/api/endpoints';
import { useQuery } from '@tanstack/react-query';
import ProductGrid from '@/components/product/ProductGrid';

export default function LibraryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: async () => {
      const res = await libraryApi.getAll();
      return res.data.data;
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Library</h1>
      <ProductGrid products={data ?? []} isLoading={isLoading} />
    </div>
  );
}
