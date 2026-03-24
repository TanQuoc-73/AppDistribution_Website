'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Package, Receipt, DollarSign } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { adminApi } from '@/lib/api/endpoints';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards: { label: string; value: string | number | undefined; href: string; icon: LucideIcon; color: string }[] = [
    { label: 'Total Users',    value: stats?.totalUsers,    href: '/admin/users',    icon: Users, color: 'text-blue-400' },
    { label: 'Total Products', value: stats?.totalProducts, href: '/admin/products', icon: Package, color: 'text-emerald-400' },
    { label: 'Total Orders',   value: stats?.totalOrders,   href: '/admin/orders',   icon: Receipt, color: 'text-amber-400' },
    { label: 'Revenue',        value: stats ? `$${stats.totalRevenue.toFixed(2)}` : undefined, href: '/admin/orders', icon: DollarSign, color: 'text-rose-400' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-100">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-stone-800 bg-stone-900/60 p-5 transition hover:border-amber-700/40 hover:shadow-lg hover:shadow-amber-900/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-400">{card.label}</p>
              <card.icon className="h-5 w-5 text-stone-500" />
            </div>
            <p className={`mt-2 text-2xl font-bold ${card.color}`}>
              {loading ? (
                <span className="inline-block h-7 w-16 animate-pulse rounded bg-stone-800" />
              ) : (
                card.value ?? '—'
              )}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
