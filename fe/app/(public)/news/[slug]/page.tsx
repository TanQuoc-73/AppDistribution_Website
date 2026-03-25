import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, ChevronLeft, Newspaper } from 'lucide-react';
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const res = await newsApi.getBySlug(slug);
    const article = res.data.data as NewsArticle;
    return {
      title: `${article.title} | AppDistribution`,
      description: article.content.replace(/<[^>]+>/g, '').slice(0, 160),
    };
  } catch {
    return { title: 'News | AppDistribution' };
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let article: NewsArticle | null = null;
  try {
    const res = await newsApi.getBySlug(slug);
    article = res.data.data as NewsArticle;
  } catch {
    notFound();
  }

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Back bar */}
      <div className="border-b border-stone-800/60 bg-stone-900/50">
        <div className="container mx-auto max-w-3xl px-4 py-4">
          <Link
            href="/news"
            className="flex w-fit items-center gap-1.5 text-sm text-stone-400 transition hover:text-amber-400"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to News
          </Link>
        </div>
      </div>

      <article className="container mx-auto max-w-3xl px-4 py-12">
        {/* Thumbnail */}
        {article.cover_image && (
          <div className="relative mb-8 h-72 w-full overflow-hidden rounded-2xl bg-stone-800">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold uppercase tracking-widest text-amber-600">
              <Newspaper className="inline -mt-0.5 mr-1 h-3.5 w-3.5" />
              News
            </span>
            <span className="text-stone-700">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(article.publishedAt ?? article.createdAt)}
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-stone-50 lg:text-4xl">
            {article.title}
          </h1>
        </header>

        {/* Divider */}
        <div className="mb-8 h-px bg-gradient-to-r from-amber-800/40 via-stone-700/40 to-transparent" />

        {/* Content */}
        <div
          className="leading-relaxed text-stone-300 [&_a]:text-amber-400 [&_a:hover]:text-amber-300 [&_blockquote]:border-l-2 [&_blockquote]:border-amber-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-stone-400 [&_code]:rounded [&_code]:bg-stone-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-amber-300 [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-stone-100 [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-stone-100 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-stone-100 [&_hr]:my-6 [&_hr]:border-stone-700 [&_img]:my-6 [&_img]:rounded-xl [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-stone-900 [&_pre]:p-4 [&_pre]:text-sm [&_strong]:font-semibold [&_strong]:text-stone-100 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
}
