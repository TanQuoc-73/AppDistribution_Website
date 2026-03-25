'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import api from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('If the email exists, a password reset link was sent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send reset email');
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
            <h1 className="mb-4 text-center text-2xl font-bold text-autumn-text">Forgot Password</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-autumn-muted">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-autumn-border bg-transparent px-3 py-2 text-autumn-text focus:border-autumn-primary focus:outline-none"
                />
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}
              {message && <p className="text-sm text-emerald-400">{message}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded btn-autumn py-2.5 font-semibold disabled:opacity-60"
              >
                {isLoading ? 'Sending…' : 'Send reset email'}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
