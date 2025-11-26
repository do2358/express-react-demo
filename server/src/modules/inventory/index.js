import express from 'express';
import * as inventoryController from './controller.js';
import { validate } from '../../middlewares/validate.js';
import { createInventorySchema, updateInventorySchema, adjustStockSchema } from './validation.js';
import { authenticate, authorize } from '../../middlewares/auth.js';

const router = express.Router();

// All inventory routes are admin-only
router.use(authenticate, authorize('admin'));

router.get('/', inventoryController.getAllInventory);
router.get('/:id', inventoryController.getInventory);
router.get('/product/:productId', inventoryController.getInventoryByProduct);
router.post('/', validate(createInventorySchema), inventoryController.createInventory);
router.put('/:id', validate(updateInventorySchema), inventoryController.updateInventory);
router.delete('/:id', inventoryController.deleteInventory);
router.put('/adjust', validate(adjustStockSchema), inventoryController.adjustStock);

export default router;
