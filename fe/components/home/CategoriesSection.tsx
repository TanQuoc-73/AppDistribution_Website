import Link from 'next/link';
import { Gamepad2, Settings, Palette, BookOpen, Wrench, Lock, DollarSign, Music, Globe, Bot, TreeDeciduous } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const CATEGORIES: { icon: LucideIcon; label: string; href: string; color: string; border: string }[] = [
  { icon: Gamepad2,    label: 'Games',        href: '/store?category=games',        color: 'from-red-950/60 to-stone-900',   border: 'border-red-900/40' },
  { icon: Settings,    label: 'Productivity', href: '/store?category=productivity',  color: 'from-amber-950/60 to-stone-900', border: 'border-amber-900/40' },
  { icon: Palette,     label: 'Design',       href: '/store?category=design',        color: 'from-orange-950/60 to-stone-900',border: 'border-orange-900/40' },
  { icon: BookOpen,    label: 'Education',    href: '/store?category=education',      color: 'from-yellow-950/60 to-stone-900',border: 'border-yellow-900/40' },
  { icon: Wrench,      label: 'Tools',        href: '/store?category=tools',          color: 'from-stone-800/60 to-stone-900', border: 'border-stone-700/40' },
  { icon: Lock,        label: 'Security',     href: '/store?category=security',       color: 'from-amber-950/60 to-stone-900', border: 'border-amber-900/40' },
  { icon: DollarSign,  label: 'Finance',      href: '/store?category=finance',        color: 'from-yellow-950/60 to-stone-900',border: 'border-yellow-900/40' },
  { icon: Music,       label: 'Media',        href: '/store?category=media',          color: 'from-red-950/60 to-stone-900',   border: 'border-red-900/40' },
  { icon: Globe,       label: 'Internet',     href: '/store?category=internet',       color: 'from-orange-950/60 to-stone-900',border: 'border-orange-900/40' },
  { icon: Bot,         label: 'AI & ML',      href: '/store?category=ai',             color: 'from-amber-950/60 to-stone-900', border: 'border-amber-900/40' },
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
              <TreeDeciduous className="inline h-3.5 w-3.5 -mt-0.5" /> Browse By Genre
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
                <span className="transition-transform duration-300 group-hover:scale-110">
                  <cat.icon className="h-7 w-7" />
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
