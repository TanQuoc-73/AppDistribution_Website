import api from "./api";
import type { Product, Category } from "@/types/product";

export const productService = {
    getProducts: async (params?: {
        search?: string;
        category?: string;
        sort?: string;
        page?: number;
        limit?: number;
    }): Promise<{ data: Product[]; total: number; page: number; limit: number }> => {
        const res = await api.get("/products", { params });
        // Backend currently returns an array; wrap for pagination support
        const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        const total = Array.isArray(res.data) ? data.length : res.data.total ?? data.length;
        return { data, total, page: params?.page ?? 1, limit: params?.limit ?? 24 };
    },

    getProductById: async (id: string): Promise<Product> => {
        const res = await api.get(`/products/${id}`);
        return res.data;
    },

    getFeatured: async (): Promise<Product[]> => {
        const res = await api.get("/products/featured");
        return Array.isArray(res.data) ? res.data : [];
    },

    getTrending: async (): Promise<Product[]> => {
        const res = await api.get("/products/trending");
        return Array.isArray(res.data) ? res.data : [];
    },

    getByCategory: async (slug: string): Promise<Product[]> => {
        const res = await api.get(`/products/category/${slug}`);
        return Array.isArray(res.data) ? res.data : [];
    },

    getVersions: async (id: string) => {
        const res = await api.get(`/products/${id}/versions`);
        return Array.isArray(res.data) ? res.data : [];
    },

    getCategories: async (): Promise<Category[]> => {
        const res = await api.get("/categories");
        return Array.isArray(res.data) ? res.data : [];
    },
};
