import api from "./api";

export const wishlistService = {
    getWishlist: async () => {
        const res = await api.get("/wishlist/user");
        return Array.isArray(res.data) ? res.data : [];
    },

    add: async (productId: string) => {
        const res = await api.post("/wishlist", { productId });
        return res.data;
    },

    remove: async (wishlistId: string) => {
        const res = await api.delete(`/wishlist/${wishlistId}`);
        return res.data;
    },
};
