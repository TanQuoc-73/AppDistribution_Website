import api from "./api";

export const userService = {
    login: async (email: string, password: string) => {
        const res = await api.post("/auth/login", { email, password });
        return res.data as {
            user: { id: string; email: string; username: string | null; role: "USER" | "DEVELOPER" | "ADMIN" };
            accessToken: string;
            refreshToken: string;
        };
    },

    register: async (email: string, username: string, password: string) => {
        const res = await api.post("/auth/register", { email, username, password });
        return res.data as {
            user: { id: string; email: string; username: string | null; role: "USER" | "DEVELOPER" | "ADMIN" };
            accessToken: string;
            refreshToken: string;
        };
    },

    logout: async () => {
        await api.post("/auth/logout");
    },

    getProfile: async () => {
        const res = await api.get("/users/profile");
        return res.data;
    },

    updateProfile: async (data: { username?: string; avatarUrl?: string }) => {
        const res = await api.put("/users/profile", data);
        return res.data;
    },
};
