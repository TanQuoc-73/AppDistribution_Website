'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/endpoints';
import { Gamepad2, Settings, Palette, BookOpen, Wrench, Lock, DollarSign, Music, Globe, Bot, Tag, TreeDeciduous } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Category } from '@/types';

// Fallback icon map by slug keyword
const ICON_MAP: Record<string, LucideIcon> = {
  game: Gamepad2,
  product: Settings,
  design: Palette,
  educ: BookOpen,
  tool: Wrench,
  secur: Lock,
  financ: DollarSign,
  media: Music,
  internet: Globe,
  ai: Bot,
  music: Music,
};

const COLOR_CYCLE = [
  { color: 'from-red-950/60 to-stone-900',    border: 'border-red-900/40' },
  { color: 'from-amber-950/60 to-stone-900',  border: 'border-amber-900/40' },
  { color: 'from-orange-950/60 to-stone-900', border: 'border-orange-900/40' },
  { color: 'from-yellow-950/60 to-stone-900', border: 'border-yellow-900/40' },
  { color: 'from-stone-800/60 to-stone-900',  border: 'border-stone-700/40' },
];

function pickIcon(slug: string): LucideIcon {
  const s = slug.toLowerCase();
  for (const [key, Icon] of Object.entries(ICON_MAP)) {
    if (s.includes(key)) return Icon;
  }
  return Tag;
}

export default function CategoriesSection() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoriesApi.getAll();
      return res.data.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Flatten tree: show root + direct children so we have a richer list
  const flat: Category[] = [];
  for (const cat of categories) {
    flat.push(cat);
    if ((cat as any).children?.length) flat.push(...(cat as any).children);
  }
  const display = flat.slice(0, 10);

  return (
    <section className="py-16">
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

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-stone-800/50" />
              ))}
            </div>
          )}

          {/* Category grid */}
          {!isLoading && display.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {display.map((cat, idx) => {
                const Icon = pickIcon(cat.slug);
                const style = COLOR_CYCLE[idx % COLOR_CYCLE.length];
                return (
                  <Link
                    key={cat.id}
                    href={`/store?categoryId=${cat.id}`}
                    className={`group flex flex-col items-center gap-3 rounded-2xl border ${style.border} bg-gradient-to-b ${style.color} p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-700/50 hover:shadow-lg hover:shadow-amber-900/20`}
                  >
                    {cat.iconUrl ? (
                      <img src={cat.iconUrl} alt="" className="h-7 w-7 object-contain" />
                    ) : (
                      <span className="transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-7 w-7" />
                      </span>
                    )}
                    <span className="text-sm font-medium text-stone-300 group-hover:text-amber-300">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {!isLoading && display.length === 0 && (
            <p className="text-center text-stone-600">No categories yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
