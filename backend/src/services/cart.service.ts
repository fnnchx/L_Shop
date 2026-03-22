import FileStorage from '../utils/fileStorage';
import { Cart, CartItem } from '../types/cart.types';
import productService from './product.service';

class CartService {
    private cartStorage: FileStorage;

    constructor() {
        this.cartStorage = new FileStorage('carts.json');
    }

    async getCart(userId: string): Promise<Cart> {
        const carts = await this.cartStorage.readData<Cart[]>();
        let cart = carts.find(c => c.userId === userId);
        
        if (!cart) {
            cart = { userId, items: [], updatedAt: new Date() };
            await this.cartStorage.create(cart);
        }
        
        return cart;
    }

    async addToCart(userId: string, productId: string, quantity: number = 1): Promise<Cart> {
        const cart = await this.getCart(userId);
        const existingItem = cart.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        
        cart.updatedAt = new Date();
        await this.updateCart(cart);
        return cart;
    }

    async updateQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
        const cart = await this.getCart(userId);
        const item = cart.items.find(item => item.productId === productId);
        
        if (!item) {
            throw new Error('Product not found in cart');
        }
        
        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item.productId !== productId);
        } else {
            item.quantity = quantity;
        }
        
        cart.updatedAt = new Date();
        await this.updateCart(cart);
        return cart;
    }

    async removeFromCart(userId: string, productId: string): Promise<Cart> {
        const cart = await this.getCart(userId);
        cart.items = cart.items.filter(item => item.productId !== productId);
        cart.updatedAt = new Date();
        await this.updateCart(cart);
        return cart;
    }

    async clearCart(userId: string): Promise<void> {
        const cart = await this.getCart(userId);
        cart.items = [];
        cart.updatedAt = new Date();
        await this.updateCart(cart);
    }

    private async updateCart(cart: Cart): Promise<void> {
        const carts = await this.cartStorage.readData<Cart[]>();
        const index = carts.findIndex(c => c.userId === cart.userId);
        
        if (index !== -1) {
            carts[index] = cart;
            await this.cartStorage.writeData(carts);
        } else {
            await this.cartStorage.create(cart);
        }
    }

    async getCartWithProducts(userId: string) {
        const cart = await this.getCart(userId);
        const products = await Promise.all(
            cart.items.map(async item => {
                const product = await productService.getProductById(item.productId);
                return {
                    ...item,
                    product,
                    totalPrice: product ? product.price * item.quantity : 0
                };
            })
        );
        
        const totalPrice = products.reduce((sum, item) => sum + item.totalPrice, 0);
        
        return {
            ...cart,
            items: products,
            totalPrice
        };
    }
}

export default new CartService();