import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { newsApi } from '@/lib/api/endpoints';
import type { NewsArticle } from '@/types';

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getExcerpt(content: string, maxLength = 150) {
  const text = content.replace(/<[^>]+>/g, '');
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}

export const metadata = {
  title: 'News | AppDistribution',
  description: 'Latest news about apps and the distribution platform.',
};

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1);
  const limit = 12;

  let articles: NewsArticle[] = [];
  let meta = { total: 0, page, limit, totalPages: 1 };

  try {
    const res = await newsApi.getAll({ page, limit });
    articles = res.data.data;
    meta = res.data.meta;
  } catch {
    // show empty state
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero */}
      <section className="border-b border-stone-800/60 bg-gradient-to-b from-stone-900 to-neutral-950 py-16">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-600">
            <Newspaper className="inline -mt-0.5 mr-1 h-3.5 w-3.5" />
            News
          </p>
          <h1 className="text-4xl font-bold text-stone-50 lg:text-5xl">Latest News</h1>
          <p className="mt-3 text-stone-400">
            Latest news about apps and the platform
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-stone-500">
            <Newspaper className="h-12 w-12 opacity-30" />
            <p>No articles yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-800/80 bg-gradient-to-b from-stone-900 to-neutral-950 transition-all duration-300 hover:-translate-y-1 hover:border-amber-800/40 hover:shadow-xl hover:shadow-amber-900/10"
              >
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-800">
                  {article.cover_image ? (
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-950/60 to-stone-900">
                      <Newspaper className="h-12 w-12 text-amber-800/60" />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(article.publishedAt ?? article.createdAt)}
                  </div>
                  <h2 className="line-clamp-2 font-semibold text-stone-100 transition-colors group-hover:text-amber-400">
                    {article.title}
                  </h2>
                  <p className="line-clamp-3 text-sm leading-relaxed text-stone-400">
                    {article.excerpt || getExcerpt(article.content ?? '')}
                  </p>
                  <span className="mt-auto pt-2 text-xs font-medium text-amber-500 transition-colors group-hover:text-amber-400">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/news?page=${page - 1}`}
                className="flex items-center gap-1 rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-300 transition hover:border-amber-700 hover:text-amber-400"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Link>
            )}
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2)
              .map((p) => (
                <Link
                  key={p}
                  href={`/news?page=${p}`}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    p === page
                      ? 'bg-amber-700 text-white'
                      : 'border border-stone-700 text-stone-300 hover:border-amber-700 hover:text-amber-400'
                  }`}
                >
                  {p}
                </Link>
              ))}
            {page < meta.totalPages && (
              <Link
                href={`/news?page=${page + 1}`}
                className="flex items-center gap-1 rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-300 transition hover:border-amber-700 hover:text-amber-400"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
