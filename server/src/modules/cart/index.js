import express from 'express';
import * as cartController from './controller.js';
import { validate } from '../../middlewares/validate.js';
import { addToCartSchema, updateCartItemSchema } from './validation.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/add', validate(addToCartSchema), cartController.addItem);
router.put('/update/:itemId', validate(updateCartItemSchema), cartController.updateItem);
router.delete('/remove/:itemId', cartController.removeItem);
router.delete('/clear', cartController.clearCart);

export default router;
