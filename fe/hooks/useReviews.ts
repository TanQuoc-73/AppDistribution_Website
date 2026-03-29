'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api/endpoints';
import { useAuthStore } from '@/stores/useAuthStore';

export function useProductReviews(productId: string, page = 1) {
  return useQuery({
    queryKey: ['reviews', productId, page],
    queryFn: async () => {
      const res = await reviewsApi.getByProduct(productId, page);
      return res.data?.data ?? res.data;
    },
    enabled: !!productId,
  });
}

export function useMyReview(productId: string) {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['my-review', productId],
    queryFn: async () => {
      const res = await reviewsApi.getMyReview(productId);
      return res.data?.data ?? null;
    },
    enabled: !!productId && !!user,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { productId: string; rating: number; title?: string; comment?: string }) =>
      reviewsApi.create(payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', vars.productId] });
      queryClient.invalidateQueries({ queryKey: ['my-review', vars.productId] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; productId: string; rating?: number; title?: string; comment?: string }) =>
      reviewsApi.update(id, payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', vars.productId] });
      queryClient.invalidateQueries({ queryKey: ['my-review', vars.productId] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['my-review'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

export function useVoteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, isHelpful }: { reviewId: string; isHelpful: boolean }) =>
      reviewsApi.vote(reviewId, isHelpful),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
