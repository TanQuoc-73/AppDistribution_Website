'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuthStore } from '@/stores/useAuthStore';
import { profilesApi } from '@/lib/api/endpoints';

export function useAuth() {
  const { user, session, profile, isLoading, setUser, setSession, setProfile, setLoading, reset } =
    useAuthStore();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Load initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const res = await profilesApi.getMe();
          setProfile(res.data.data);
        } catch {
          // profile not yet created or error
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const res = await profilesApi.getMe();
          setProfile(res.data.data);
        } catch {
          setProfile(null);
        }
      } else {
        reset();
      }
    });

    return () => subscription.unsubscribe();
  }, [setLoading, setProfile, setSession, setUser, reset]);

  return { user, session, profile, isLoading };
}
