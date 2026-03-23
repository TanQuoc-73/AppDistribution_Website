import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role;
  if (!user || role !== 'admin') redirect('/');

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Users', href: '/admin/users' },
          { label: 'Total Products', href: '/admin/products' },
          { label: 'Total Orders', href: '/admin/orders' },
          { label: 'Pending Reviews', href: '/admin/products' },
        ].map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="rounded-lg border border-neutral-800 bg-neutral-900 p-5 transition hover:border-neutral-600"
          >
            <p className="text-sm text-neutral-400">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">—</p>
          </a>
        ))}
      </div>
    </div>
  );
}
