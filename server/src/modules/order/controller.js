import asyncHandler from '../../middlewares/asyncHandler.js';
import { successResponse, paginatedResponse } from '../../utils/response.js';
import * as orderService from './service.js';

// ===== CUSTOMER CONTROLLERS =====

// @desc    Create order
// @route   POST /api/orders
// @access  User
export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  
  successResponse(res, { order }, 'Order created successfully', 201);
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  User
export const getUserOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getUserOrders(req.user._id, req.query);
  
  paginatedResponse(res, orders, pagination, 'Orders retrieved successfully');
});

// @desc    Get order detail
// @route   GET /api/orders/:id
// @access  User
export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.user._id, req.params.id);
  
  successResponse(res, { order }, 'Order retrieved successfully');
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  User
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.user._id, req.params.id);
  
  successResponse(res, { order }, 'Order cancelled successfully');
});

// ===== ADMIN CONTROLLERS =====

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getAllOrders(req.query);
  
  paginatedResponse(res, orders, pagination, 'Orders retrieved successfully');
});

// @desc    Get order detail (admin)
// @route   GET /api/admin/orders/:id
// @access  Admin
export const getOrderAdmin = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderByIdAdmin(req.params.id);
  
  successResponse(res, { order }, 'Order retrieved successfully');
});

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  
  const order = await orderService.updateOrderStatus(
    req.params.id,
    status,
    note,
    req.user._id
  );
  
  successResponse(res, { order }, 'Order status updated successfully');
});
