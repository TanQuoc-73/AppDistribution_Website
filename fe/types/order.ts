export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: number;
    userId: number;
    items: OrderItem[];
    totalPrice: number;
    status: "pending" | "completed" | "cancelled";
    createdAt: string;
}
