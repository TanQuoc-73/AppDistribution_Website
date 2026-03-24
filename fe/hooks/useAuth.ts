'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { profilesApi } from '@/lib/api/endpoints';

export function useAuth() {
  const { user, session, profile, isLoading, setUser, setSession, setProfile, setLoading, reset } =
    useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // onAuthStateChange fires INITIAL_SESSION on mount — no separate getSession needed
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
      } else if (event === 'SIGNED_OUT') {
        reset();
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setLoading, setProfile, setSession, setUser, reset]);

  return { user, session, profile, isLoading };
}
