import Header from '@/components/layout/header/Header';

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      <Header />
      <div className="flex flex-1">
        <aside className="w-56 shrink-0 border-r border-neutral-800 bg-neutral-900 p-4">
          <nav className="space-y-1 text-sm">
            <a href="/developer/dashboard" className="block rounded px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white">Dashboard</a>
            <a href="/developer/products" className="block rounded px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white">My Products</a>
            <a href="/developer/products/new" className="block rounded px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white">+ New Product</a>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
