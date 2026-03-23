'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const SLIDES = [
  {
    id: 1,
    badge: "⭐ Editor's Choice",
    badgeBg: 'bg-amber-500',
    title: 'Aurora Creative Suite',
    subtitle: 'Professional Design Platform',
    description:
      'The ultimate creative toolkit for designers. Advanced photo editing, vector graphics, motion graphics, and real-time team collaboration — all in one place.',
    price: 49.99,
    originalPrice: 79.99,
    discount: 37,
    isFree: false,
    rating: 4.9,
    reviews: 12847,
    downloads: '2.4M',
    tags: ['Design', 'Productivity', 'Creative'],
    slug: '/store',
    appIcon: '🎨',
    iconBg: 'linear-gradient(135deg,#d97706,#dc2626)',
    accentColor: '#d97706',
    heroBg: 'linear-gradient(135deg,#1a0800 0%,#2d1200 45%,#0d0907 100%)',
  },
  {
    id: 2,
    badge: '🆓 Free Forever',
    badgeBg: 'bg-emerald-600',
    title: 'CodeForge Studio',
    subtitle: 'AI-Powered Development Environment',
    description:
      'Next-gen IDE with AI code completion, integrated testing, real-time collaboration, and one-click deployment to any cloud provider.',
    price: 0,
    originalPrice: 29.99,
    discount: 100,
    isFree: true,
    rating: 4.7,
    reviews: 8234,
    downloads: '1.8M',
    tags: ['Development', 'AI', 'Tools'],
    slug: '/store',
    appIcon: '💻',
    iconBg: 'linear-gradient(135deg,#ea580c,#9a1c1c)',
    accentColor: '#ea580c',
    heroBg: 'linear-gradient(135deg,#1a0600 0%,#2d0f00 45%,#0d0907 100%)',
  },
  {
    id: 3,
    badge: '🍂 Autumn Sale –50%',
    badgeBg: 'bg-orange-600',
    title: 'MapleWorld Studio',
    subtitle: 'Cross-Platform Game Development',
    description:
      'Build stunning 2D and 3D games with an intuitive visual editor. Export to Windows, macOS, iOS, Android, and web with a single click.',
    price: 19.99,
    originalPrice: 39.99,
    discount: 50,
    isFree: false,
    rating: 4.6,
    reviews: 5621,
    downloads: '950K',
    tags: ['Game Dev', 'Education', 'Creative'],
    slug: '/store',
    appIcon: '🎮',
    iconBg: 'linear-gradient(135deg,#b45309,#78350f)',
    accentColor: '#b45309',
    heroBg: 'linear-gradient(135deg,#150900 0%,#201200 45%,#0d0907 100%)',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(idx);
      setTimeout(() => setAnimating(false), 500);
    },
    [animating],
  );

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(
    () => goTo((current - 1 + SLIDES.length) % SLIDES.length),
    [current, goTo],
  );

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 600 }}>
      {/* Animated background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: slide.heroBg }}
      />

      {/* Ambient orbs */}
      <div
        className="absolute -top-20 right-10 h-96 w-96 rounded-full blur-3xl opacity-20"
        style={{ background: slide.accentColor }}
      />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-orange-900/30 blur-3xl" />

      {/* Decorative grid lines */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative container mx-auto flex flex-col items-center gap-10 px-4 py-16 lg:flex-row lg:gap-16 lg:py-20">

        {/* ── Left: Info ── */}
        <div
          key={slide.id}
          className="flex-1 max-w-xl space-y-5 animate-fade-in-up"
        >
          {/* Badge */}
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold text-white ${slide.badgeBg}`}
          >
            {slide.badge}
          </span>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold leading-tight text-stone-50 lg:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-1 text-base font-medium" style={{ color: slide.accentColor }}>
              {slide.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-stone-400">{slide.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {slide.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-stone-700/50 bg-stone-800/60 px-2.5 py-0.5 text-xs text-stone-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6">
            <div>
              <span className="text-lg font-bold text-amber-400">★ {slide.rating}</span>
              <span className="ml-1 text-xs text-stone-500">({slide.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-stone-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {slide.downloads} downloads
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div>
              {slide.isFree ? (
                <span className="text-3xl font-bold text-emerald-400">Free</span>
              ) : (
                <div className="flex items-baseline gap-2">
                  {slide.discount > 0 && (
                    <span className="text-sm text-stone-500 line-through">${slide.originalPrice}</span>
                  )}
                  <span className="text-3xl font-bold text-stone-50">${slide.price}</span>
                  {slide.discount > 0 && (
                    <span className="rounded bg-green-700/80 px-1.5 py-0.5 text-xs font-bold text-green-300">
                      -{slide.discount}%
                    </span>
                  )}
                </div>
              )}
            </div>

            <Link
              href={slide.slug}
              className="rounded-xl px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-amber-500/30"
              style={{ background: `linear-gradient(135deg,${slide.accentColor},#b45309)` }}
            >
              {slide.isFree ? 'Get Free' : 'Buy Now'}
            </Link>
            <Link
              href={slide.slug}
              className="rounded-xl border border-stone-700 px-6 py-3 text-sm font-medium text-stone-300 transition-all hover:border-stone-500 hover:text-white"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* ── Right: App mockup window ── */}
        <div className="flex-shrink-0 w-full max-w-sm animate-float lg:max-w-md">
          <div className="relative">
            {/* Glow */}
            <div
              className="absolute -inset-6 -z-10 rounded-3xl opacity-25 blur-3xl"
              style={{ background: slide.accentColor }}
            />

            {/* Window chrome */}
            <div
              className="overflow-hidden rounded-2xl border border-white/10"
              style={{ background: 'linear-gradient(160deg,#1e1208,#130c04)' }}
            >
              {/* Titlebar */}
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <div className="mx-3 h-5 flex-1 rounded bg-white/5 px-3 flex items-center">
                  <span className="text-[10px] text-stone-500 truncate">{slide.title}</span>
                </div>
              </div>

              {/* App icon area */}
              <div className="p-5">
                <div
                  className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl mb-4"
                  style={{ background: slide.iconBg }}
                >
                  <span className="text-7xl drop-shadow-2xl">{slide.appIcon}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Decorative circles */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
                  <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-white/5" />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Rating', value: `★ ${slide.rating}` },
                    { label: 'Downloads', value: slide.downloads },
                    { label: 'Reviews', value: slide.reviews.toLocaleString() },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg p-3 text-center"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <div className="text-sm font-semibold text-amber-400">{s.value}</div>
                      <div className="text-xs text-stone-500">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Progress bars (decorative) */}
                <div className="mt-3 space-y-2">
                  {[90, 75, 60].map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${w}%`, background: slide.iconBg }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="glass-dark absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-xl text-white transition hover:bg-white/10"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="glass-dark absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-xl text-white transition hover:bg-white/10"
      >
        ›
      </button>

      {/* ── Dots ── */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-7 bg-amber-500' : 'w-2 bg-stone-600 hover:bg-stone-400'
            }`}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0907] to-transparent" />
    </section>
  );
}
