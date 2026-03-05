export interface Review {
    id: number;
    userId: number;
    userName: string;
    userAvatar?: string;
    productId: number;
    rating: number;
    comment: string;
    createdAt: string;
}
