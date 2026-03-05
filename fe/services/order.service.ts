import api from "./api";
import type { Order } from "@/types/order";

export const orderService = {
    createOrder: async (items: { productId: number; quantity: number }[]): Promise<Order> => {
        const res = await api.post("/orders", { items });
        return res.data;
    },

    getOrders: async (): Promise<Order[]> => {
        const res = await api.get("/orders");
        return res.data;
    },

    getOrderById: async (id: number): Promise<Order> => {
        const res = await api.get(`/orders/${id}`);
        return res.data;
    },
};
