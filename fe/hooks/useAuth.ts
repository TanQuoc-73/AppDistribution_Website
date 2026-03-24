'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { profilesApi } from '@/lib/api/endpoints';

/**
 * Registers the single Supabase onAuthStateChange listener.
 * MUST be called exactly ONCE (in providers.tsx).
 * Other components should use useAuth() to read state.
 */
export function useAuthListener() {
  const mounted = useRef(false);
  const { setUser, setSession, setProfile, setLoading, reset } = useAuthStore();

  useEffect(() => {
    // Prevent double-subscription in React strict mode
    if (mounted.current) return;
    mounted.current = true;

    const supabase = createClient();

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

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [setLoading, setProfile, setSession, setUser, reset]);
}

/**
 * Read auth state from the store. Safe to call from any component —
 * does NOT create a new Supabase subscription.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { user, session, profile, isLoading };
}
