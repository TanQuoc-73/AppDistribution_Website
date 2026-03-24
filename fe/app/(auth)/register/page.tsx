'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { username: form.username } },
      });
      if (authError) throw new Error(authError.message);
      router.push('/login?registered=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/callback` },
    });
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden text-stone-100"
      style={{ background: 'linear-gradient(180deg,#0d0907 0%,#100b05 100%)' }}
    >
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm autumn-card p-6">
            <h1 className="mb-4 text-center text-2xl font-bold text-autumn-text">Create Account</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-autumn-muted">Username</label>
                <input
                  required
                  minLength={3}
                  maxLength={30}
                  value={form.username}
                  onChange={update('username')}
                  className="w-full rounded border border-autumn-border bg-transparent px-3 py-2 text-autumn-text focus:border-autumn-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-autumn-muted">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update('email')}
                  className="w-full rounded border border-autumn-border bg-transparent px-3 py-2 text-autumn-text focus:border-autumn-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-autumn-muted">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={update('password')}
                  className="w-full rounded border border-autumn-border bg-transparent px-3 py-2 text-autumn-text focus:border-autumn-primary focus:outline-none"
                />
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded btn-autumn py-2.5 font-semibold disabled:opacity-60"
              >
                {isLoading ? 'Creating account…' : 'Register'}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-autumn-border" />
              <span className="text-xs text-autumn-muted">OR</span>
              <span className="h-px flex-1 bg-autumn-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="flex w-full items-center justify-center gap-2 rounded border border-autumn-border bg-white/5 py-2.5 font-medium text-autumn-text hover:bg-white/10 transition"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="mt-4 text-center text-sm text-autumn-muted">
              Already have an account?{' '}
              <Link href="/login" className="link-accent hover:opacity-95">
                Sign in
              </Link>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
