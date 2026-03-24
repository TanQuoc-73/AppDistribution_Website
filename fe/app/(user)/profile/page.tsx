'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useAuth } from '@/hooks/useAuth';
import { profilesApi } from '@/lib/api/endpoints';
import { createClient } from '@/lib/supabase/client';

const roleBadge: Record<string, { label: string; cls: string }> = {
  user:      { label: 'User',      cls: 'bg-stone-700 text-stone-300' },
  developer: { label: 'Developer', cls: 'bg-emerald-900/60 text-emerald-300' },
  admin:     { label: 'Admin',     cls: 'bg-rose-900/60 text-rose-300' },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();
  const { setProfile } = useAuthStore();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await profilesApi.updateMe({ displayName, bio });
      setProfile(res.data.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    useAuthStore.getState().reset();
    useCartStore.getState().clearItems();
    router.push('/');
    router.refresh();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const badge = profile ? (roleBadge[profile.role] ?? roleBadge.user) : roleBadge.user;
  const username = profile?.username ?? user.email?.split('@')[0] ?? 'User';
  const displayNameValue = profile?.displayName || username;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* ─── Header card ─── */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={username}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-amber-600/40"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-600/20 text-3xl font-bold text-amber-400 ring-2 ring-amber-600/40">
              {username[0].toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-100">
                {displayNameValue}
              </h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-stone-400">@{username}</p>
            {user?.email && (
              <p className="mt-1 text-sm text-stone-500">{user.email}</p>
            )}
            {profile?.bio && (
              <p className="mt-2 text-sm text-stone-300">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Wallet */}
        {profile && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-stone-800 bg-stone-950/60 px-4 py-3">
            <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-sm text-stone-400">Wallet Balance</span>
            <span className="ml-auto font-semibold text-amber-400">
              ${parseFloat(profile.walletBalance ?? '0').toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* ─── Edit form ─── */}
      {profile && (
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-6">
          <h2 className="mb-4 text-lg font-semibold text-stone-200">Edit Profile</h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-stone-400">Username</label>
              <input
                value={profile.username}
                disabled
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-stone-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-stone-400">Display Name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-stone-100 placeholder-stone-600 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/40"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-stone-400">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us about yourself…"
                className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-stone-100 placeholder-stone-600 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/40"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-autumn rounded-lg px-6 py-2.5 font-semibold disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {!profile && (
        <div className="rounded-xl border border-amber-900/30 bg-stone-900/60 p-6 text-center">
          <p className="text-sm text-stone-400">Profile data unavailable — the backend may be offline.</p>
          <p className="mt-1 text-xs text-stone-500">You are signed in as {user.email}</p>
        </div>
      )}

      {/* ─── Quick links ─── */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-6">
        <h2 className="mb-4 text-lg font-semibold text-stone-200">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { href: '/library',       label: 'My Library',       icon: '📚' },
            { href: '/orders',        label: 'Order History',    icon: '🧾' },
            { href: '/wishlist',      label: 'Wishlist',         icon: '❤️' },
            { href: '/notifications', label: 'Notifications',    icon: '🔔' },
            { href: '/cart',          label: 'Cart',             icon: '🛒' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-lg border border-stone-800 bg-stone-950/40 px-3 py-2.5 text-sm text-stone-300 transition hover:border-amber-800/50 hover:bg-stone-800/60 hover:text-amber-300"
            >
              <span>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* ─── Sign out ─── */}
      <div className="rounded-xl border border-rose-900/30 bg-stone-900/60 p-6">
        <h2 className="mb-2 text-lg font-semibold text-stone-200">Sign Out</h2>
        <p className="mb-4 text-sm text-stone-400">This will sign you out of your account on this device.</p>
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-rose-800/60 bg-rose-950/40 px-6 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-900/50 hover:text-rose-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
