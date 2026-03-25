'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Parse access_token from query or hash
    try {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      let at = params.get('access_token');
      let rt = params.get('refresh_token');

      if (!at && window.location.hash) {
        const hash = window.location.hash.replace(/^#/, '');
        const parts = new URLSearchParams(hash);
        at = at || parts.get('access_token');
        rt = rt || parts.get('refresh_token');
      }

      if (at) setAccessToken(at);
      if (rt) setRefreshToken(rt);

      if (at) {
        const supabase = createClient();
        // set session so updateUser works
        // @ts-ignore
        supabase.auth.setSession({ access_token: at, refresh_token: rt }).catch(() => {});
      }
    } catch (err) {
      // ignore
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const supabase = createClient();
      // @ts-ignore
      const { error: updErr } = await supabase.auth.updateUser({ password });
      if (updErr) throw new Error(updErr.message || 'Unable to update password');
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-stone-100" style={{ background: 'linear-gradient(180deg,#0d0907 0%,#100b05 100%)' }}>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm autumn-card p-6">
            <h1 className="mb-4 text-center text-2xl font-bold text-autumn-text">Reset Password</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-autumn-muted">New password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-autumn-border bg-transparent px-3 py-2 text-autumn-text focus:border-autumn-primary focus:outline-none"
                />
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <button type="submit" disabled={isLoading} className="w-full rounded btn-autumn py-2.5 font-semibold disabled:opacity-60">
                {isLoading ? 'Updating…' : 'Set new password'}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
