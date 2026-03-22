export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
    imageUrl?: string;
    createdAt: Date;
}

export interface ProductFilters {
    search?: string;
    category?: string;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
}