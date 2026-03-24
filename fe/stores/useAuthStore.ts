'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setSession: (session) => {
        if (typeof window !== 'undefined') {
          const token = session?.access_token ?? '';
          if (token) {
            const expires = session?.expires_at ? `; Expires=${new Date(session.expires_at * 1000).toUTCString()}` : '';
            const secure = location.protocol === 'https:' ? '; Secure' : '';
            document.cookie = `token=${token}; Path=/; SameSite=Lax${secure}${expires}`;
          } else {
            document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          }
        }
        set({ session });
      },
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      reset: () => {
        if (typeof window !== 'undefined') {
          document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        }
        set({ user: null, session: null, profile: null, isLoading: false });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ profile: state.profile }),
    },
  ),
);
