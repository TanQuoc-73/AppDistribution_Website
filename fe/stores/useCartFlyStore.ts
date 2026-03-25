import { create } from 'zustand';

interface CartFlyState {
  flying: boolean;
  fromX: number;
  fromY: number;
  imgSrc: string | null;
  trigger: (fromX: number, fromY: number, imgSrc?: string | null) => void;
  done: () => void;
}

export const useCartFlyStore = create<CartFlyState>((set) => ({
  flying: false,
  fromX: 0,
  fromY: 0,
  imgSrc: null,
  trigger: (fromX, fromY, imgSrc) =>
    set({ flying: true, fromX, fromY, imgSrc: imgSrc ?? null }),
  done: () => set({ flying: false }),
}));
