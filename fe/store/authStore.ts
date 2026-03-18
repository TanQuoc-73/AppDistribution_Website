import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
    id: string;
    email: string;
    username: string | null;
    role: "USER" | "DEVELOPER" | "ADMIN";
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoggedIn: boolean;

    login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoggedIn: false,

            login: (user, accessToken, refreshToken) => {
                set({ user, accessToken, refreshToken, isLoggedIn: true });
            },

            logout: () => {
                set({ user: null, accessToken: null, refreshToken: null, isLoggedIn: false });
            },

            setTokens: (accessToken, refreshToken) => {
                set({ accessToken, refreshToken });
            },

            setUser: (user) => {
                set({ user });
            },
        }),
        {
            name: "auth-storage",
            // only persist tokens and user, not callbacks
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isLoggedIn: state.isLoggedIn,
            }),
        }
    )
);
