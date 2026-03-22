import { CartService } from '../services/cart.service';

export class CartView {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    async render() {
        try {
            const cart = await CartService.getCart();
            
            if (!cart.items || cart.items.length === 0) {
                this.container.innerHTML = `
                    <div class="cart-empty">
                        <h2>Корзина пуста</h2>
                        <a href="/" data-link>Перейти к покупкам</a>
                    </div>
                `;
                return;
            }

            this.container.innerHTML = `
                <div class="cart-container">
                    <h2>Корзина</h2>
                    <div class="cart-items">
                        ${cart.items.map((item: any) => `
                            <div class="cart-item" data-product-id="${item.productId}">
                                <div class="item-info">
                                    <h3 data-title="basket">${item.product.name}</h3>
                                    <div class="item-price" data-price="basket">${item.product.price} ₽</div>
                                </div>
                                <div class="item-quantity">
                                    <button class="quantity-decrease" data-product-id="${item.productId}">-</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="quantity-increase" data-product-id="${item.productId}">+</button>
                                </div>
                                <div class="item-total">${item.totalPrice} ₽</div>
                                <button class="remove-item" data-product-id="${item.productId}">Удалить</button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cart-summary">
                        <div class="cart-total">Итого: ${cart.totalPrice} ₽</div>
                        <button id="checkout-btn" class="checkout-btn">Оформить заказ</button>
                    </div>
                </div>
            `;

            this.attachEventListeners();
        } catch (error) {
            console.error('Failed to load cart:', error);
            this.container.innerHTML = '<div class="error">Ошибка загрузки корзины</div>';
        }
    }

    private attachEventListeners() {
        // Увеличение количества
        document.querySelectorAll('.quantity-increase').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.target as HTMLButtonElement;
                const productId = button.dataset.productId!;
                await CartService.updateQuantity(productId, 1);
                this.render();
            });
        });

        // Уменьшение количества
        document.querySelectorAll('.quantity-decrease').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.target as HTMLButtonElement;
                const productId = button.dataset.productId!;
                await CartService.updateQuantity(productId, -1);
                this.render();
            });
        });

        // Удаление товара
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.target as HTMLButtonElement;
                const productId = button.dataset.productId!;
                await CartService.removeFromCart(productId);
                this.render();
            });
        });

        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn?.addEventListener('click', () => {
            window.location.href = '/delivery';
        });
    }
}