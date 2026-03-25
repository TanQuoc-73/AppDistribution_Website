import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Newspaper } from 'lucide-react';
import type { NewsArticle } from '@/types';

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getExcerpt(content: string, maxLength = 120) {
  const text = content.replace(/<[^>]+>/g, '');
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles = [] }: NewsSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-600">
              <Newspaper className="inline h-3.5 w-3.5 -mt-0.5" /> Stay Informed
            </p>
            <h2 className="text-2xl font-bold text-stone-50 lg:text-3xl">Latest News</h2>
          </div>
          <Link
            href="/news"
            className="flex items-center gap-1 text-sm text-amber-500 transition hover:text-amber-400"
          >
            All news
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Articles grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-800/80 transition-all duration-300 hover:-translate-y-1 hover:border-amber-800/40 hover:shadow-xl hover:shadow-amber-900/10"
              style={{ background: 'linear-gradient(160deg,#1a0f07,#110c04)' }}
            >
              {/* Thumbnail */}
              <div className="relative h-40 w-full overflow-hidden bg-stone-800">
                {article.cover_image ? (
                  <Image
                    src={article.cover_image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-950/60 to-stone-900">
                    <Newspaper className="h-12 w-12 text-amber-800/50" />
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="text-xs text-stone-500">
                  {formatDate(article.publishedAt ?? article.createdAt)}
                </span>
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-stone-100 transition group-hover:text-amber-300">
                  {article.title}
                </h3>
                <p className="line-clamp-3 text-xs leading-relaxed text-stone-500">
                  {article.excerpt || getExcerpt(article.content ?? '')}
                </p>
                <div className="mt-auto pt-3">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 transition group-hover:text-amber-400">
                    Read more
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
