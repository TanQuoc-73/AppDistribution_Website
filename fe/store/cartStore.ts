import { create } from "zustand";
import type { Product } from "@/types/product";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],

    addToCart: (product) => {
        const items = get().items;
        const existing = items.find((item) => item.product.id === product.id);

        if (existing) {
            set({
                items: items.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            });
        } else {
            set({ items: [...items, { product, quantity: 1 }] });
        }
    },

    removeFromCart: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
    },

    clearCart: () => {
        set({ items: [] });
    },

    totalPrice: () => {
        return get().items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    },
}));
