'use client';

import { useQuery } from '@tanstack/react-query';
import { developerApi } from '@/lib/api/endpoints';
import Image from 'next/image';
import Link from 'next/link';

export default function DeveloperProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['developer', 'products'],
    queryFn: async () => {
      const res = await developerApi.getMyProducts();
      return (res.data?.data ?? res.data ?? []) as any[];
    },
  });

  if (isLoading) return <div className="py-10 text-center text-neutral-400">Đang tải…</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sản phẩm của tôi</h1>
        <Link
          href="/developer/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {!data?.length ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-neutral-400">Bạn chưa có sản phẩm nào.</p>
          <Link href="/developer/products/new" className="rounded bg-blue-600 px-6 py-2 text-white">
            Tạo sản phẩm đầu tiên
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-800 bg-neutral-900 text-left text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Phiên bản</th>
                <th className="px-4 py-3">Tải về</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {data.map((product: any) => (
                <tr key={product.id} className="bg-neutral-950 hover:bg-neutral-900">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.thumbnailUrl ? (
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-neutral-800">
                          <Image src={product.thumbnailUrl} alt={product.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-14 shrink-0 rounded bg-neutral-800" />
                      )}
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-neutral-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white">
                    {product.isFree ? (
                      <span className="text-green-400">Miễn phí</span>
                    ) : (
                      `$${parseFloat(product.price).toFixed(2)}`
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">
                    {product.versions?.[0]?.version ? `v${product.versions[0].version}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {product._count?.library ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      product.is_active ? 'bg-green-900 text-green-300' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {product.is_active ? 'Hoạt động' : 'Tạm ẩn'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/developer/products/${product.id}`}
                      className="rounded border border-neutral-700 px-3 py-1 text-xs text-neutral-300 hover:border-neutral-500"
                    >
                      Quản lý
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
