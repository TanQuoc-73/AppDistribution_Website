export interface Product {
    id: string;            // UUID from backend
    name: string;
    description: string | null;
    price: number;
    thumbnail: string | null;
    rating?: number;
    categoryId: string | null;
    category?: { id: string; name: string } | null;
    developerId: string | null;
    developer?: { id: string; name: string } | null;
    releaseDate?: string | null;
    createdAt: string;
    screenshots?: ProductScreenshot[];
    versions?: ProductVersion[];
}

export interface ProductScreenshot {
    id: string;
    imageUrl: string;
}

export interface ProductVersion {
    id: string;
    version: string;
    changelog: string | null;
    downloadUrl: string | null;
    fileSize: number | null;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
}
