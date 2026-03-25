'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api/endpoints';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';

export function useCart() {
  const { setItems } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const query = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartApi.get();
      const items = res.data.data ?? [];
      setItems(items);
      return items;
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  return query;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      cartApi.addItem(productId).then((res) => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { removeItem } = useCartStore();
  return useMutation({
    mutationFn: (productId: string) =>
      cartApi.removeItem(productId).then(() => productId),
    onSuccess: (productId) => {
      removeItem(productId);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const { clearItems } = useCartStore();
  return useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: () => {
      clearItems();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
