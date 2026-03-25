'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, profile } = useAuth();
  const cartCount = useCartStore((s) => s.totalCount());
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Resolve avatar URL: prefer DB profile, fallback to Supabase OAuth metadata (Google)
  const avatarUrl: string | null =
    profile?.avatarUrl ||
    (user?.user_metadata?.avatar_url as string | undefined) ||
    null;

  // Resolve display name
  const displayName: string =
    profile?.displayName ||
    profile?.username ||
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'U';

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchRef.current?.value.trim();
    if (q) router.push(`/store?search=${encodeURIComponent(q)}`);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    useAuthStore.getState().reset();
    useCartStore.getState().clearItems();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-stone-950/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 text-xl font-black text-amber-400 hover:text-amber-300 transition">
          <Leaf className="h-5 w-5" /> AppDist
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-5 text-sm text-stone-400 md:flex">
          <Link href="/store" className="transition hover:text-amber-300">Store</Link>
          <Link href="/news"  className="transition hover:text-amber-300">News</Link>
          {profile?.role === 'developer' && (
            <Link href="/developer/dashboard" className="transition hover:text-amber-300">Dev Portal</Link>
          )}
          {profile?.role === 'admin' && (
            <Link href="/admin/dashboard" className="transition hover:text-amber-300">Admin</Link>
          )}
        </nav>

        {/* Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mx-auto hidden flex-1 max-w-xs md:flex lg:max-w-sm"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search apps…"
              className="w-full rounded-xl border border-stone-800 bg-stone-900/80 py-2 pl-9 pr-4 text-sm text-stone-300 placeholder-stone-600 outline-none transition focus:border-amber-700/60 focus:ring-1 focus:ring-amber-700/40"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Mobile search toggle */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-800 hover:text-amber-300 md:hidden"
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Cart icon — always visible */}
          <Link href={user ? '/cart' : '/login'} data-cart-icon className="relative text-sm text-stone-400 transition hover:text-amber-300">
            <ShoppingCart className="h-5 w-5" />
            {user && cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link href="/library" className="hidden text-sm text-stone-400 transition hover:text-amber-300 sm:block">Library</Link>

              {/* Avatar + display name */}
              <Link href="/profile" className="flex items-center gap-2 transition hover:opacity-80">
                <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-amber-700/40">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-amber-600/20 text-sm font-bold text-amber-400">
                      {displayName[0].toUpperCase()}
                    </span>
                  )}
                </span>
                <span className="hidden max-w-[120px] truncate text-sm text-stone-300 sm:block">
                  {displayName}
                </span>
              </Link>

              <button onClick={handleSignOut} className="hidden text-xs text-stone-500 transition hover:text-stone-300 sm:block">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-stone-400 transition hover:text-amber-300">Sign in</Link>
              <Link
                href="/register"
                className="rounded-xl bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-500 hover:shadow-md hover:shadow-amber-700/30"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <form onSubmit={handleSearchSubmit} className="border-t border-stone-800 px-4 py-2 md:hidden">
          <input
            ref={searchRef}
            type="search"
            placeholder="Search apps…"
            autoFocus
            className="w-full rounded-xl border border-stone-800 bg-stone-900 px-4 py-2 text-sm text-stone-300 placeholder-stone-600 outline-none focus:border-amber-700"
          />
        </form>
      )}
    </header>
  );
}


