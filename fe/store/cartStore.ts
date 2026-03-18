import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export interface CartItem {
    product: Pick<Product, "id" | "name" | "price" | "thumbnail">;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addToCart: (product: Pick<Product, "id" | "name" | "price" | "thumbnail">) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    totalPrice: () => number;
    totalItems: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (product) => {
                const items = get().items;
                const existing = items.find((item) => item.product.id === product.id);
                if (existing) {
                    // Digital products: quantity stays at 1
                    return;
                }
                set({ items: [...items, { product, quantity: 1 }] });
            },

            removeFromCart: (productId) => {
                set({ items: get().items.filter((item) => item.product.id !== productId) });
            },

            clearCart: () => set({ items: [] }),

            totalPrice: () =>
                get().items.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0),

            totalItems: () => get().items.length,
        }),
        {
            name: "cart-storage",
            partialize: (state) => ({ items: state.items }),
        }
    )
);
