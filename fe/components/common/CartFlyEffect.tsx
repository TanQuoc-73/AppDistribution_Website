'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartFlyStore } from '@/stores/useCartFlyStore';

export default function CartFlyEffect() {
  const { flying, fromX, fromY, imgSrc, done } = useCartFlyStore();
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!flying || !ref.current) return;

    const cartEl = document.querySelector<HTMLElement>('[data-cart-icon]');
    const targetRect = cartEl?.getBoundingClientRect();

    // Center of the cart icon; fallback to top-right corner
    const toX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth - 60;
    const toY = targetRect ? targetRect.top + targetRect.height / 2 : 32;

    // Element is 44×44, position so it centers on the click point
    const SIZE = 44;
    const startX = fromX - SIZE / 2;
    const startY = fromY - SIZE / 2;

    // Delta to move the element from its fixed start position to cart center
    const dx = toX - startX - SIZE / 2;
    const dy = toY - startY - SIZE / 2;

    // Curve control point: arc upward and slightly toward target
    const cpX = dx * 0.25;
    const cpY = dy * 0.25 - 80;

    const el = ref.current;

    const anim = el.animate(
      [
        { transform: 'translate(0, 0) scale(1)',                          opacity: 1,   offset: 0 },
        { transform: `translate(${cpX}px, ${cpY}px) scale(0.75)`,        opacity: 0.9, offset: 0.4 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.1)`,           opacity: 0,   offset: 1 },
      ],
      { duration: 620, easing: 'cubic-bezier(0.25, 0.1, 0.6, 1)', fill: 'forwards' },
    );

    anim.onfinish = () => {
      done();
      // Bounce the cart icon
      cartEl?.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.5)' },
          { transform: 'scale(0.85)' },
          { transform: 'scale(1)' },
        ],
        { duration: 380, easing: 'ease-out' },
      );
    };

    return () => { anim.cancel(); };
  }, [flying, fromX, fromY, done]);

  if (!mounted || !flying) return null;

  return createPortal(
    <div
      ref={ref}
      className="pointer-events-none fixed z-[9999] overflow-hidden rounded-full border-2 border-amber-500 bg-stone-900 shadow-xl shadow-amber-500/40"
      style={{ width: 44, height: 44, left: fromX - 22, top: fromY - 22 }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-amber-600/20">
          <ShoppingCart className="h-5 w-5 text-amber-400" />
        </div>
      )}
    </div>,
    document.body,
  );
}
