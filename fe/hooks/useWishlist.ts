'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistsApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/stores/useAuthStore';

export function useWishlist() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await wishlistsApi.get();
      return res.data.data;
    },
    enabled: !!user,
  });
}

export function useCheckWishlist(productId: string) {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['wishlist', 'check', productId],
    queryFn: async () => {
      const res = await wishlistsApi.check(productId);
      return res.data?.data?.wishlisted ?? false;
    },
    enabled: !!productId && !!user,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistsApi.add(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistsApi.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
