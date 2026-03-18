import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach access token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const accessToken = useAuthStore.getState().accessToken;
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401, try refresh token
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const { refreshToken, user, logout, setTokens } = useAuthStore.getState();

            if (refreshToken && user) {
                try {
                    const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/auth/refresh`,
                        { userId: user.id, refreshToken }
                    );
                    const { accessToken: newAccess, refreshToken: newRefresh } = res.data;
                    setTokens(newAccess, newRefresh);
                    processQueue(null, newAccess);
                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    logout();
                    if (typeof window !== "undefined") window.location.href = "/auth/login";
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                logout();
                if (typeof window !== "undefined") window.location.href = "/auth/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
