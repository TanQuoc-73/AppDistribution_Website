'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Leaf, TreeDeciduous, ShoppingCart } from 'lucide-react';

const FLOATING_NUMBERS = ['-70%', '-55%', '-40%', '-30%', '-65%', '-48%', '-52%'];

export default function AutumnSaleBanner() {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPos((p) => (p + 1) % FLOATING_NUMBERS.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div
          className="relative overflow-hidden rounded-3xl p-8 md:p-12"
          style={{
            background:
              'linear-gradient(135deg,#7c2d12 0%,#9a3412 25%,#c2440d 50%,#b45309 75%,#78350f 100%)',
          }}
        >
          {/* Animated background blobs */}
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-amber-500/20 blur-2xl" />
          <div className="absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-orange-400/20 blur-2xl" />
          <div className="absolute right-32 top-5 h-32 w-32 rounded-full bg-yellow-400/15 blur-xl" />

          <div className="absolute right-6 top-6 opacity-30 rotate-12 select-none"><Leaf className="h-12 w-12 text-orange-200" /></div>
          <div className="absolute left-8 bottom-6 opacity-25 -rotate-12 select-none"><TreeDeciduous className="h-10 w-10 text-orange-200" /></div>
          <div className="absolute right-24 bottom-4 opacity-20 rotate-45 select-none"><Leaf className="h-8 w-8 text-orange-200" /></div>

          {/* Floating discount numbers */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {FLOATING_NUMBERS.map((n, i) => (
              <span
                key={i}
                className="absolute font-black text-white/5 text-6xl"
                style={{
                  left: `${10 + i * 14}%`,
                  top: `${20 + (i % 3) * 30}%`,
                  transform: `rotate(${-15 + i * 8}deg)`,
                }}
              >
                {n}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex-1">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-amber-200 backdrop-blur">
                <Leaf className="h-4 w-4" /> Limited Time Offer
              </div>
              <h2 className="text-3xl font-black text-white md:text-4xl lg:text-5xl">
                Autumn Sale
              </h2>
              <p className="mt-1 text-4xl font-black text-amber-200 md:text-5xl lg:text-6xl">
                Up to 70% Off
              </p>
              <p className="mt-3 max-w-md text-sm text-orange-200/80">
                Warm up your toolkit this season. Hundreds of apps and games discounted for a
                limited time. Don&apos;t miss out on these cozy deals!
              </p>

              {/* Countdown placeholder */}
              <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                {[
                  { v: '03', l: 'Days' },
                  { v: '12', l: 'Hours' },
                  { v: '47', l: 'Mins' },
                  { v: '29', l: 'Secs' },
                ].map((t) => (
                  <div
                    key={t.l}
                    className="flex flex-col items-center rounded-xl bg-black/20 px-3 py-2 backdrop-blur min-w-[56px]"
                  >
                    <span className="text-xl font-black text-white">{t.v}</span>
                    <span className="text-[10px] text-orange-200/70">{t.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-3 md:items-start">
              <Link
                href="/store"
                className="rounded-2xl bg-white px-8 py-3.5 text-base font-bold text-orange-800 shadow-2xl transition-all hover:-translate-y-1 hover:bg-amber-50 hover:shadow-white/20"
              >
                Shop the Sale <ShoppingCart className="inline h-4 w-4" />
              </Link>
              <p className="text-xs text-orange-200/60">
                * Offer ends while stocks last
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
