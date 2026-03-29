'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { refundsApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/stores/useAuthStore';

export function useMyRefunds() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['refunds', 'my'],
    queryFn: async () => {
      const res = await refundsApi.getMy();
      return res.data?.data ?? [];
    },
    enabled: !!user,
  });
}

export function useRequestRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderItemId, reason }: { orderItemId: string; reason: string }) =>
      refundsApi.request(orderItemId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
