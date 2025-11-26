import asyncHandler from '../../middlewares/asyncHandler.js';
import { successResponse, paginatedResponse } from '../../utils/response.js';
import * as productService from './service.js';

// ===== PUBLIC CONTROLLERS =====

// @desc    Get all active products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req,res) => {
  const { products, pagination } = await productService.getActiveProducts(req.query);
  
  paginatedResponse(res, products, pagination, 'Products retrieved successfully');
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  
  successResponse(res, { product }, 'Product retrieved successfully');
});

// ===== ADMIN CONTROLLERS =====

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Admin
export const getProductsAdmin = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getAllProducts(req.query);
  
  paginatedResponse(res, products, pagination, 'Products retrieved successfully');
});

// @desc    Get single product (admin)
// @route   GET /api/admin/products/:id
// @access  Admin
export const getProductAdmin = asyncHandler(async (req, res) => {
  const product = await productService.getProductByIdAdmin(req.params.id);
  
  successResponse(res, { product }, 'Product retrieved successfully');
});

// @desc    Create product
// @route   POST /api/admin/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  
  successResponse(res, { product }, 'Product created successfully', 201);
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  
  successResponse(res, { product }, 'Product updated successfully');
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  
  successResponse(res, null, 'Product deleted successfully');
});
