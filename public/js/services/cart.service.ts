import { ApiService } from './api.service';

export class CartService {
    static async getCart() {
        return ApiService.request('/cart');
    }

    static async addToCart(productId: string, quantity: number = 1) {
        return ApiService.request('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    }

    static async updateQuantity(productId: string, delta: number) {
        return ApiService.request(`/cart/${productId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity: delta })
        });
    }

    static async removeFromCart(productId: string) {
        return ApiService.request(`/cart/${productId}`, {
            method: 'DELETE'
        });
    }
}