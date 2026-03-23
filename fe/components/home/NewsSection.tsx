import Link from 'next/link';

const ARTICLES = [
  {
    id: 1,
    category: 'Update',
    date: 'Oct 15, 2025',
    title: 'Aurora Creative Suite 5.0 Launched with AI Features',
    excerpt:
      'The flagship design platform ships its biggest update yet, bringing AI-powered background removal, smart selection, and generative fill tools.',
    icon: '🎨',
    color: 'from-amber-950/80 to-stone-900',
    accent: '#d97706',
  },
  {
    id: 2,
    category: 'Community',
    date: 'Oct 12, 2025',
    title: 'Autumn Dev Jam 2025 — Winners Announced',
    excerpt:
      'Over 300 developers participated in our seasonal game jam. Meet the top teams and their incredible creations built in just 72 hours.',
    icon: '🏆',
    color: 'from-orange-950/80 to-stone-900',
    accent: '#ea580c',
  },
  {
    id: 3,
    category: 'Platform',
    date: 'Oct 9, 2025',
    title: 'New Developer Portal & Revenue Dashboard',
    excerpt:
      'We rolled out a completely redesigned developer portal with real-time analytics, A/B testing tools, and improved payout management.',
    icon: '🚀',
    color: 'from-stone-800/80 to-stone-900',
    accent: '#b45309',
  },
];

export default function NewsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-600">
              📰 Stay Informed
            </p>
            <h2 className="text-2xl font-bold text-stone-50 lg:text-3xl">Latest News</h2>
          </div>
          <Link
            href="/news"
            className="flex items-center gap-1 text-sm text-amber-500 transition hover:text-amber-400"
          >
            All news
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Articles grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {ARTICLES.map((article) => (
            <Link
              key={article.id}
              href="/news"
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-800/80 transition-all duration-300 hover:-translate-y-1 hover:border-amber-800/40 hover:shadow-xl hover:shadow-amber-900/10"
              style={{ background: 'linear-gradient(160deg,#1a0f07,#110c04)' }}
            >
              {/* Illustration */}
              <div
                className={`flex h-40 items-center justify-center bg-gradient-to-br ${article.color} relative overflow-hidden`}
              >
                <span className="text-5xl transition-transform duration-500 group-hover:scale-110">
                  {article.icon}
                </span>
                {/* Decorative lines */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(-45deg,rgba(255,255,255,0.1) 1px,transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1a0f07]"
                />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded text-[10px] font-bold uppercase px-2 py-0.5"
                    style={{ background: `${article.accent}22`, color: article.accent }}
                  >
                    {article.category}
                  </span>
                  <span className="text-xs text-stone-600">{article.date}</span>
                </div>
                <h3 className="text-sm font-bold leading-snug text-stone-100 transition group-hover:text-amber-300">
                  {article.title}
                </h3>
                <p className="line-clamp-3 text-xs leading-relaxed text-stone-500">
                  {article.excerpt}
                </p>
                <div className="mt-auto pt-3">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium"
                    style={{ color: article.accent }}
                  >
                    Read more
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
