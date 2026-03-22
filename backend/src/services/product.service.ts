import FileStorage from '../utils/fileStorage';
import { Product, ProductFilters } from '../types/product.types';
import { randomUUID } from 'crypto';

class ProductService {
    private productStorage: FileStorage;

    constructor() {
        this.productStorage = new FileStorage('products.json');
        this.initSampleProducts();
    }

    private async initSampleProducts() {
        const products = await this.productStorage.readData<Product[]>();
        if (products.length === 0) {
            const sampleProducts: Product[] = [
                {
                    id: randomUUID(),
                    name: 'Смартфон X100',
                    description: 'Мощный смартфон с отличной камерой',
                    price: 29999,
                    category: 'Электроника',
                    inStock: true,
                    imageUrl: '/assets/phone.jpg',
                    createdAt: new Date()
                },
                {
                    id: randomUUID(),
                    name: 'Ноутбук Pro 15',
                    description: 'Производительный ноутбук для работы и игр',
                    price: 79999,
                    category: 'Электроника',
                    inStock: true,
                    imageUrl: '/assets/laptop.jpg',
                    createdAt: new Date()
                },
                {
                    id: randomUUID(),
                    name: 'Наушники Wireless',
                    description: 'Беспроводные наушники с шумоподавлением',
                    price: 8999,
                    category: 'Аксессуары',
                    inStock: false,
                    imageUrl: '/assets/headphones.jpg',
                    createdAt: new Date()
                }
            ];
            await this.productStorage.writeData(sampleProducts);
        }
    }

    async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
        let products = await this.productStorage.readData<Product[]>();

        if (filters) {
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                products = products.filter(p => 
                    p.name.toLowerCase().includes(searchLower) || 
                    p.description.toLowerCase().includes(searchLower)
                );
            }

            if (filters.category) {
                products = products.filter(p => p.category === filters.category);
            }

            if (filters.inStock !== undefined) {
                products = products.filter(p => p.inStock === filters.inStock);
            }

            if (filters.minPrice !== undefined) {
                products = products.filter(p => p.price >= filters.minPrice!);
            }

            if (filters.maxPrice !== undefined) {
                products = products.filter(p => p.price <= filters.maxPrice!);
            }

            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case 'price_asc':
                        products.sort((a, b) => a.price - b.price);
                        break;
                    case 'price_desc':
                        products.sort((a, b) => b.price - a.price);
                        break;
                    case 'name_asc':
                        products.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    case 'name_desc':
                        products.sort((a, b) => b.name.localeCompare(a.name));
                        break;
                }
            }
        }

        return products;
    }

    async getProductById(id: string): Promise<Product | null> {
        return this.productStorage.findById<Product>(id);
    }

    async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
        const newProduct: Product = {
            id: randomUUID(),
            ...productData,
            createdAt: new Date()
        };
        return this.productStorage.create(newProduct);
    }
}

export default new ProductService();