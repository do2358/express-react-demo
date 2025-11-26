import express from 'express';
import * as productController from './controller.js';
import { validate } from '../../middlewares/validate.js';
import { createProductSchema, updateProductSchema } from './validation.js';
import { authenticate, authorize } from '../../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), productController.getProductsAdmin);
router.get('/admin/:id', authenticate, authorize('admin'), productController.getProductAdmin);
router.post('/admin', authenticate, authorize('admin'), validate(createProductSchema), productController.createProduct);
router.put('/admin/:id', authenticate, authorize('admin'), validate(updateProductSchema), productController.updateProduct);
router.delete('/admin/:id', authenticate, authorize('admin'), productController.deleteProduct);

export default router;
