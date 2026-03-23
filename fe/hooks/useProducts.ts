'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/endpoints';
import type { QueryProductParams } from '@/types';

export function useProducts(params?: QueryProductParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await productsApi.getAll(params);
      return res.data;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await productsApi.getBySlug(slug);
      return res.data.data;
    },
    enabled: !!slug,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof productsApi.create>[0]) =>
      productsApi.create(payload).then((res) => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof productsApi.update>[1] }) =>
      productsApi.update(id, payload).then((res) => res.data.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}
