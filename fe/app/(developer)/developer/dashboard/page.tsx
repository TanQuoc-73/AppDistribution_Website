import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DeveloperDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Developer Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Products', value: '—' },
          { label: 'Total Downloads', value: '—' },
          { label: 'Revenue', value: '—' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <p className="text-sm text-neutral-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
