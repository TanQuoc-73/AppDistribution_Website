import api from "./api";
import type { User } from "@/types/user";

export const userService = {
    login: async (email: string, password: string) => {
        const res = await api.post("/auth/login", { email, password });
        return res.data;
    },

    register: async (name: string, email: string, password: string) => {
        const res = await api.post("/auth/register", { name, email, password });
        return res.data;
    },

    getProfile: async (): Promise<User> => {
        const res = await api.get("/users/profile");
        return res.data;
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const res = await api.put("/users/profile", data);
        return res.data;
    },
};
