'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Receipt, Users, Newspaper, Image, Tag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/header/Header';

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Dashboard',  href: '/admin/dashboard',   icon: LayoutDashboard },
  { label: 'Products',   href: '/admin/products',    icon: Package },
  { label: 'Categories', href: '/admin/categories',  icon: Tag },
  { label: 'Orders',     href: '/admin/orders',      icon: Receipt },
  { label: 'Users',      href: '/admin/users',       icon: Users },
  { label: 'News',       href: '/admin/news',        icon: Newspaper },
  { label: 'Banners',    href: '/admin/banners',     icon: Image },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-white">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-stone-800 bg-stone-900/80">
          <div className="p-4">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-amber-500">
              Admin Panel
            </h2>
            <nav className="space-y-1 text-sm">
              {navItems.map(({ label, href, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition ${
                      active
                        ? 'bg-amber-600/20 text-amber-400 font-medium'
                        : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
