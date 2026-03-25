'use client';

import { useQuery } from '@tanstack/react-query';
import { libraryApi, downloadsApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/stores/useAuthStore';
import Image from 'next/image';
import Link from 'next/link';
import type { LibraryEntry } from '@/types';

function DownloadButton({ product }: { product: LibraryEntry }) {
  const hasUrl = !!product.latestVersion?.downloadUrl;

  async function handleDownload() {
    if (!hasUrl) return;
    try {
      const res = await downloadsApi.download(product.id, product.latestVersion?.id ?? undefined);
      const result = res.data?.data;
      if (result?.downloadUrl) {
        // Open download URL in a new tab
        window.open(result.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      alert(err?.message ?? 'Unable to download. Please try again.');
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={!hasUrl}
      title={hasUrl ? `Download version ${product.latestVersion?.version}` : 'No download available'}
      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {hasUrl ? `Download${product.latestVersion?.version ? ` v${product.latestVersion.version}` : ''}` : 'No file'}
    </button>
  );
}

export default function LibraryPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: async () => {
      const res = await libraryApi.getAll();
      return (res.data?.data ?? []) as LibraryEntry[];
    },
    enabled: !!user,
  });

  if (isLoading) return <div className="py-20 text-center text-neutral-400">Loading library…</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Library</h1>

      {!data?.length ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-neutral-400">Your library is empty. Purchase a product first.</p>
          <Link href="/store" className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-500">
            Browse Store
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative h-36 bg-neutral-800">
                {entry.thumbnailUrl ? (
                  <Image src={entry.thumbnailUrl} alt={entry.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-neutral-600 text-4xl">📦</div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <Link href={`/store/${entry.slug}`} className="mb-1 font-semibold hover:text-blue-400">
                  {entry.name}
                </Link>
                <p className="mb-2 text-xs text-neutral-500">
                  Owned since {new Date(entry.acquiredAt).toLocaleDateString('en-US')}
                </p>
                {entry.latestVersion && (
                  <p className="mb-3 text-xs text-neutral-400">
                    Latest version: <span className="text-white">v{entry.latestVersion.version}</span>
                    {entry.latestVersion.fileSize && (
                      <span className="ml-2 text-neutral-500">
                        ({(entry.latestVersion.fileSize / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    )}
                  </p>
                )}
                {entry.licenseKey && (
                  <p className="mb-3 rounded bg-neutral-800 px-2 py-1 font-mono text-xs text-yellow-400">
                    Key: {entry.licenseKey}
                  </p>
                )}
                <div className="mt-auto flex gap-2">
                  <DownloadButton product={entry} />
                  <Link
                    href={`/store/${entry.slug}`}
                    className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:border-neutral-500"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
