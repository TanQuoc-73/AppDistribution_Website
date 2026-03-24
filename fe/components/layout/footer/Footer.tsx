import Link from 'next/link';
import { Leaf, Send, GitFork, MessageCircle } from 'lucide-react';

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
            <Link href="/" className="flex items-center gap-1.5 text-xl font-black text-amber-400">
              <Leaf className="h-5 w-5" /> AppDistribution
            </Link>
            <p className="text-sm leading-relaxed text-stone-500">
              Discover, buy and download the best software applications. Your cozy corner for premium apps.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { label: 'Twitter', icon: Send },
                { label: 'GitHub',  icon: GitFork },
                { label: 'Discord', icon: MessageCircle },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-800 text-stone-500 transition hover:border-amber-800/60 hover:text-amber-400"
                >
                  <s.icon className="h-4 w-4" />
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
            Made with <Leaf className="h-3.5 w-3.5 text-amber-600" /> for app lovers
          </p>
        </div>
      </div>
    </footer>
  );
}

