'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { profilesApi } from '@/lib/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfilePage() {
  const { profile, setProfile } = useAuthStore();
  const qc = useQueryClient();
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
      qc.invalidateQueries({ queryKey: ['profile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  }

  if (!profile) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>

      <form onSubmit={handleSave} className="max-w-md space-y-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-400">Username</label>
          <input
            value={profile.username}
            disabled
            className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-400">Display Name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-400">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
