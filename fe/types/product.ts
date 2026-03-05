export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    screenshots?: string[];
    rating?: number;
    category: string;
    developer: string;
    downloads?: number;
    createdAt: string;
}

export interface Category {
    name: string;
    slug: string;
    icon?: string;
}
