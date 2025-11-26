import asyncHandler from '../../middlewares/asyncHandler.js';
import { successResponse, paginatedResponse } from '../../utils/response.js';
import * as inventoryService from './service.js';

// @desc    Get all inventory
// @route   GET /api/admin/inventory
// @access  Admin
export const getAllInventory = asyncHandler(async (req, res) => {
  const { inventory, pagination } = await inventoryService.getAllInventory(req.query);
  
  paginatedResponse(res, inventory, pagination, 'Inventory retrieved successfully');
});

// @desc    Get inventory by ID
// @route   GET /api/admin/inventory/:id
// @access  Admin
export const getInventory = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getInventoryById(req.params.id);
  
  successResponse(res, { inventory }, 'Inventory retrieved successfully');
});

// @desc    Get inventory by product ID
// @route   GET /api/admin/inventory/product/:productId
// @access  Admin
export const getInventoryByProduct = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getInventoryByProduct(req.params.productId);
  
  successResponse(res, { inventory }, 'Inventory retrieved successfully');
});

// @desc    Create inventory
// @route   POST /api/admin/inventory
// @access  Admin
export const createInventory = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.createInventory(req.body);
  
  successResponse(res, { inventory }, 'Inventory created successfully', 201);
});

// @desc    Update inventory
// @route   PUT /api/admin/inventory/:id
// @access  Admin
export const updateInventory = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.updateInventory(req.params.id, req.body);
  
  successResponse(res, { inventory }, 'Inventory updated successfully');
});

// @desc    Delete inventory
// @route   DELETE /api/admin/inventory/:id
// @access  Admin
export const deleteInventory = asyncHandler(async (req, res) => {
  await inventoryService.deleteInventory(req.params.id);
  
  successResponse(res, null, 'Inventory deleted successfully');
});

// @desc    Adjust stock
// @route   PUT /api/admin/inventory/adjust
// @access  Admin
export const adjustStock = asyncHandler(async (req, res) => {
  const { product, adjustment, reason } = req.body;
  
  const inventory = await inventoryService.adjustStock(product, adjustment, reason);
  
  successResponse(res, { inventory }, 'Stock adjusted successfully');
});
