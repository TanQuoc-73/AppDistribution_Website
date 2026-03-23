'use client';

import { create } from 'zustand';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearItems: () => void;
  setLoading: (loading: boolean) => void;
  totalCount: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => ({
      items: state.items.some((i) => i.productId === item.productId)
        ? state.items
        : [...state.items, item],
    })),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),
  clearItems: () => set({ items: [] }),
  setLoading: (isLoading) => set({ isLoading }),
  totalCount: () => get().items.length,
  totalPrice: () =>
    get().items.reduce((sum, item) => {
      const price = parseFloat(item.product.price);
      const discount = item.product.discountPercent;
      return sum + price * (1 - discount / 100);
    }, 0),
}));
