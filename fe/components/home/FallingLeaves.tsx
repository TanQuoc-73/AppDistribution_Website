'use client';

import { useEffect, useState } from 'react';

interface Leaf {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  startRotation: number;
}

const COLORS = [
  '#d97706', '#b45309', '#ea580c', '#c05621',
  '#d4a017', '#92400e', '#dc2626', '#a16207',
];

export default function FallingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    setLeaves(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 22,
        duration: 13 + Math.random() * 13,
        size: 12 + Math.random() * 16,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        startRotation: Math.random() * 360,
      })),
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="leaf-falling"
          style={{
            left: `${leaf.left}%`,
            top: '-80px',
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
          }}
        >
          <svg
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 24 24"
            fill={leaf.color}
            style={{ transform: `rotate(${leaf.startRotation}deg)`, opacity: 0.38 }}
          >
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 8-9 9l-1.62-1.62A10 10 0 0117 8z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
