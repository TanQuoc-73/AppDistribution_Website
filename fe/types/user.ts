export interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    role: "user" | "developer" | "admin";
    createdAt: string;
}
