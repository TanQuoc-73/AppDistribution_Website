'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthListener } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import CartFlyEffect from '@/components/common/CartFlyEffect';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthListener(); // single global Supabase auth subscription
  return <>{children}</>;
}

/** Keeps the cart Zustand store in sync with the server at all times. */
function CartInitializer() {
  useCart();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <CartInitializer />
        {children}
      </AuthInitializer>
      <CartFlyEffect />
    </QueryClientProvider>
  );
}
