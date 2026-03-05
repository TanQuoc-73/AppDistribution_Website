import api from "./api";
import type { Product } from "@/types/product";

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        const res = await api.get("/products");
        return res.data;
    },

    getProductById: async (id: number): Promise<Product> => {
        const res = await api.get(`/products/${id}`);
        return res.data;
    },

    getFeatured: async (): Promise<Product[]> => {
        const res = await api.get("/products/featured");
        return res.data;
    },

    getTrending: async (): Promise<Product[]> => {
        const res = await api.get("/products/trending");
        return res.data;
    },

    getByCategory: async (slug: string): Promise<Product[]> => {
        const res = await api.get(`/products/category/${slug}`);
        return res.data;
    },
};
