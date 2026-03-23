import Link from 'next/link';

const CATEGORIES = [
  { icon: '🎮', label: 'Games',        href: '/store?category=games',        color: 'from-red-950/60 to-stone-900',   border: 'border-red-900/40' },
  { icon: '⚙️', label: 'Productivity', href: '/store?category=productivity',  color: 'from-amber-950/60 to-stone-900', border: 'border-amber-900/40' },
  { icon: '🎨', label: 'Design',       href: '/store?category=design',        color: 'from-orange-950/60 to-stone-900',border: 'border-orange-900/40' },
  { icon: '📚', label: 'Education',    href: '/store?category=education',      color: 'from-yellow-950/60 to-stone-900',border: 'border-yellow-900/40' },
  { icon: '🔧', label: 'Tools',        href: '/store?category=tools',          color: 'from-stone-800/60 to-stone-900', border: 'border-stone-700/40' },
  { icon: '🔒', label: 'Security',     href: '/store?category=security',       color: 'from-amber-950/60 to-stone-900', border: 'border-amber-900/40' },
  { icon: '💰', label: 'Finance',      href: '/store?category=finance',        color: 'from-yellow-950/60 to-stone-900',border: 'border-yellow-900/40' },
  { icon: '🎵', label: 'Media',        href: '/store?category=media',          color: 'from-red-950/60 to-stone-900',   border: 'border-red-900/40' },
  { icon: '🌐', label: 'Internet',     href: '/store?category=internet',       color: 'from-orange-950/60 to-stone-900',border: 'border-orange-900/40' },
  { icon: '🤖', label: 'AI & ML',      href: '/store?category=ai',             color: 'from-amber-950/60 to-stone-900', border: 'border-amber-900/40' },
];

export default function CategoriesSection() {
  return (
    <section className="py-16">
      {/* Warm strip background */}
      <div
        className="relative py-16"
        style={{ background: 'linear-gradient(180deg,#0d0907 0%,#140d06 50%,#0d0907 100%)' }}
      >
        {/* Ambient glow */}
        <div className="absolute left-1/2 top-1/2 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-900/15 blur-3xl" />

        <div className="relative container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-600">
              🍁 Browse By Genre
            </p>
            <h2 className="text-2xl font-bold text-stone-50 lg:text-3xl">Categories</h2>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`group flex flex-col items-center gap-3 rounded-2xl border ${cat.border} bg-gradient-to-b ${cat.color} p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-700/50 hover:shadow-lg hover:shadow-amber-900/20`}
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  {cat.icon}
                </span>
                <span className="text-sm font-medium text-stone-300 group-hover:text-amber-300">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
