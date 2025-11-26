import express from 'express';
import * as orderController from './controller.js';
import { validate } from '../../middlewares/validate.js';
import { createOrderSchema, updateOrderStatusSchema } from './validation.js';
import { authenticate, authorize } from '../../middlewares/auth.js';

const router = express.Router();

// Customer routes
router.post('/', authenticate, validate(createOrderSchema), orderController.createOrder);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, orderController.getOrder);
router.put('/:id/cancel', authenticate, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), orderController.getAllOrders);
router.get('/admin/:id', authenticate, authorize('admin'), orderController.getOrderAdmin);
router.put('/admin/:id/status', authenticate, authorize('admin'), validate(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;
