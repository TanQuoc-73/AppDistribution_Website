'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, libraryApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CreateOrderPayload, Product } from '@/types';

export function useLibrary() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['library'],
    queryFn: async () => {
      const res = await libraryApi.getAll();
      return (res.data.data ?? []) as Product[];
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      const res = await ordersApi.getMy();
      return res.data.data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const res = await ordersApi.getMyById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const res = await ordersApi.create(payload);
      return (res.data?.data ?? res.data) as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
