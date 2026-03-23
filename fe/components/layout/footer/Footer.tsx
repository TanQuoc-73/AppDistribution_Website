import Link from 'next/link';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg,#0d0907 0%,#070503 100%)' }}>
      {/* Top divider glow */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg,transparent,#78350f,transparent)' }} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-black text-amber-400">
              🍂 AppDistribution
            </Link>
            <p className="text-sm leading-relaxed text-stone-500">
              Discover, buy and download the best software applications. Your cozy corner for premium apps.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { label: 'GitHub',  path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
                { label: 'Discord', path: 'M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057l.003.028a.077.077 0 00.031.027c2.052 1.508 4.041 2.423 5.993 3.029a.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.029.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-800 text-stone-500 transition hover:border-amber-800/60 hover:text-amber-400"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Store */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-700">Store</h4>
            <ul className="space-y-2.5 text-sm text-stone-500">
              {[
                { label: 'Browse All Apps', href: '/store' },
                { label: 'New Releases',    href: '/store?sort=newest' },
                { label: 'Top Downloads',   href: '/store?sort=popular' },
                { label: 'On Sale',         href: '/store?sale=true' },
                { label: 'News & Updates',  href: '/news' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-amber-400">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-700">Account</h4>
            <ul className="space-y-2.5 text-sm text-stone-500">
              {[
                { label: 'My Library',  href: '/library' },
                { label: 'Order History', href: '/orders' },
                { label: 'Wishlist',    href: '/wishlist' },
                { label: 'Profile',     href: '/profile' },
                { label: 'Settings',    href: '/profile' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition hover:text-amber-400">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-700">Company</h4>
            <ul className="space-y-2.5 text-sm text-stone-500">
              {[
                { label: 'About Us',        href: '#' },
                { label: 'Developer Portal', href: '/developer/dashboard' },
                { label: 'Contact',         href: '#' },
                { label: 'Privacy Policy',  href: '#' },
                { label: 'Terms of Service', href: '#' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition hover:text-amber-400">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-stone-900 pt-6 sm:flex-row">
          <p className="text-xs text-stone-600">
            © {YEAR} AppDistribution. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-stone-600">
            Made with <span className="text-amber-600">🍂</span> for app lovers
          </p>
        </div>
      </div>
    </footer>
  );
}

