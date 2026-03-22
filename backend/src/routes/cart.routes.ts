import { Router } from 'express';
import cartController from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/:productId', cartController.updateQuantity);
router.delete('/:productId', cartController.removeFromCart);

export default router;