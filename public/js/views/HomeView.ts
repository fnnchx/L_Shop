import { Product } from '../types';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';

export class HomeView {
    private container: HTMLElement;
    private products: Product[] = [];
    private filters = {
        search: '',
        category: '',
        sortBy: 'name_asc',
        inStock: undefined as boolean | undefined,
        minPrice: undefined as number | undefined,
        maxPrice: undefined as number | undefined
    };

    constructor(container: HTMLElement) {
        this.container = container;
    }

    async render() {
        await this.loadProducts();
        this.container.innerHTML = `
            <div class="shop-container">
                <aside class="filters-sidebar">
                    <h3>Фильтры</h3>
                    <div class="filter-group">
                        <label>Поиск</label>
                        <input type="text" id="search-input" placeholder="Поиск товаров...">
                    </div>
                    <div class="filter-group">
                        <label>Категория</label>
                        <select id="category-select">
                            <option value="">Все</option>
                            <option value="Электроника">Электроника</option>
                            <option value="Аксессуары">Аксессуары</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Цена</label>
                        <input type="number" id="min-price" placeholder="От">
                        <input type="number" id="max-price" placeholder="До">
                    </div>
                    <div class="filter-group">
                        <label>
                            <input type="checkbox" id="in-stock"> Только в наличии
                        </label>
                    </div>
                    <div class="filter-group">
                        <label>Сортировка</label>
                        <select id="sort-select">
                            <option value="name_asc">По имени (А-Я)</option>
                            <option value="name_desc">По имени (Я-А)</option>
                            <option value="price_asc">По цене (возрастание)</option>
                            <option value="price_desc">По цене (убывание)</option>
                        </select>
                    </div>
                    <button id="apply-filters">Применить</button>
                </aside>
                
                <main class="products-grid">
                    ${this.renderProducts()}
                </main>
            </div>
        `;

        this.attachEventListeners();
    }

    private renderProducts(): string {
        if (this.products.length === 0) {
            return '<div class="no-products">Товары не найдены</div>';
        }

        return this.products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.imageUrl || '/assets/placeholder.jpg'}" alt="${product.name}">
                <h3 data-title>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price" data-price>${product.price} ₽</div>
                <div class="product-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    ${product.inStock ? 'В наличии' : 'Нет в наличии'}
                </div>
                ${product.inStock ? `
                    <div class="add-to-cart">
                        <input type="number" class="quantity-input" value="1" min="1" max="99">
                        <button class="add-to-cart-btn" data-product-id="${product.id}">В корзину</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    private attachEventListeners() {
        const applyBtn = document.getElementById('apply-filters');
        applyBtn?.addEventListener('click', () => this.applyFilters());

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.target as HTMLButtonElement;
                const productId = button.dataset.productId!;
                const card = button.closest('.product-card');
                const quantityInput = card?.querySelector('.quantity-input') as HTMLInputElement;
                const quantity = parseInt(quantityInput.value);

                try {
                    await CartService.addToCart(productId, quantity);
                    alert('Товар добавлен в корзину');
                } catch (error) {
                    if (error instanceof Error && error.message === 'Authentication required') {
                        alert('Пожалуйста, войдите в систему');
                        window.location.href = '/login';
                    } else {
                        alert('Ошибка при добавлении в корзину');
                    }
                }
            });
        });
    }

    private async applyFilters() {
        const search = (document.getElementById('search-input') as HTMLInputElement).value;
        const category = (document.getElementById('category-select') as HTMLSelectElement).value;
        const sortBy = (document.getElementById('sort-select') as HTMLSelectElement).value;
        const inStock = (document.getElementById('in-stock') as HTMLInputElement).checked;
        const minPrice = (document.getElementById('min-price') as HTMLInputElement).value;
        const maxPrice = (document.getElementById('max-price') as HTMLInputElement).value;

        this.filters = {
            search,
            category,
            sortBy,
            inStock: inStock || undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined
        };

        await this.loadProducts();
        this.updateProductsGrid();
    }

    private async loadProducts() {
        const params = new URLSearchParams();
        if (this.filters.search) params.append('search', this.filters.search);
        if (this.filters.category) params.append('category', this.filters.category);
        if (this.filters.sortBy) params.append('sortBy', this.filters.sortBy);
        if (this.filters.inStock !== undefined) params.append('inStock', String(this.filters.inStock));
        if (this.filters.minPrice) params.append('minPrice', String(this.filters.minPrice));
        if (this.filters.maxPrice) params.append('maxPrice', String(this.filters.maxPrice));

        try {
            const response = await fetch(`http://localhost:5000/api/products?${params}`);
            this.products = await response.json();
        } catch (error) {
            console.error('Failed to load products:', error);
            this.products = [];
        }
    }

    private updateProductsGrid() {
        const grid = this.container.querySelector('.products-grid');
        if (grid) {
            grid.innerHTML = this.renderProducts();
            this.attachEventListeners();
        }
    }
}