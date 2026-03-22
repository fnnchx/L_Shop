export interface User {
    id: string;
    name: string;
    email: string;
    login: string;
    phone: string;
    password?: string;
    createdAt: Date;
}

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

export interface CartItem {
    productId: string;
    quantity: number;
    product?: Product;
}

export interface Cart {
    userId: string;
    items: CartItem[];
    totalPrice: number;
}