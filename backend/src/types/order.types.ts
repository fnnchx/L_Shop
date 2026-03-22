typescript
export interface Order {
    id: string;
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    deliveryInfo: {
        address: string;
        phone: string;
        email: string;
    };
    paymentMethod: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    createdAt: Date;
}

export interface DeliveryDTO {
    address: string;
    phone: string;
    email: string;
    paymentMethod: string;
}
backend/src/services/order.service.ts:

typescript
import FileStorage from '../utils/fileStorage';
import { Order, DeliveryDTO } from '../types/order.types';
import cartService from './cart.service';
import productService from './product.service';
import { randomUUID } from 'crypto';

class OrderService {
    private orderStorage: FileStorage;

    constructor() {
        this.orderStorage = new FileStorage('orders.json');
    }

    async createOrder(userId: string, deliveryData: DeliveryDTO): Promise<Order> {
        const cart = await cartService.getCartWithProducts(userId);
        
        if (!cart.items  cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        const orderItems = cart.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
        }));

        const order: Order = {
            id: randomUUID(),
            userId,
            items: orderItems,
            deliveryInfo: deliveryData,
            paymentMethod: deliveryData.paymentMethod,
            totalPrice: cart.totalPrice,
            status: 'pending',
            createdAt: new Date()
        };

        await this.orderStorage.create(order);
        
        // Очищаем корзину после успешного заказа
        await cartService.clearCart(userId);
        
        return order;
    }

    async getUserOrders(userId: string): Promise<Order[]> {
        const orders = await this.orderStorage.readData<Order[]>();
        return orders.filter(order => order.userId === userId);
    }

    async getOrderById(orderId: string): Promise<Order | null> {
        return this.orderStorage.findById<Order>(orderId);
    }
}

export default new OrderService();
backend/src/controllers/delivery.controller.ts:

typescript
import { Request, Response } from 'express';
import orderService from '../services/order.service';

class DeliveryController {
    async createOrder(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { address, phone, email, paymentMethod } = req.body;
            
            if (!address  !phone  !email  !paymentMethod) {
                return res.status(400).json({ error: 'All delivery fields are required' });
            }

            const order = await orderService.createOrder(userId, {
                address,
                phone,
                email,
                paymentMethod
            });

            res.status(201).json({ order, message: 'Order created successfully' });
        } catch (error) {
            res.status(400).json({ 
                error: error instanceof Error ? error.message : 'Failed to create order' 
            });
        }
    }

    async getUserOrders(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const orders = await orderService.getUserOrders(userId);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    }
}

export default new DeliveryController();
backend/src/routes/delivery.routes.ts:

typescript
import { Router } from 'express';
import deliveryController from '../controllers/delivery.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.post('/create', deliveryController.createOrder);
router.get('/orders', deliveryController.getUserOrders);

export default router;
В server.ts добавляем:

typescript
import deliveryRoutes from './routes/delivery.routes';

// После cartRoutes
app.use('/api/delivery', deliveryRoutes);