import api from "./api"

export interface OrderItem {
    productId: string
    price: number
}

export interface Order {
    id: string
    totalPrice: number | string
    status: string
    createdAt: string
    items: {
        productId: string
        price: number
        product: { id: string; name: string }
    }[]
}

export const orderService = {
    async createOrder(items: OrderItem[]): Promise<Order> {
        const res = await api.post<Order>("/orders", { items })
        return res.data
    },

    async getMyOrders(): Promise<Order[]> {
        const res = await api.get<Order[]>("/orders/user")
        return res.data
    },

    async getOrderById(id: string): Promise<Order> {
        const res = await api.get<Order>(`/orders/${id}`)
        return res.data
    },
}
