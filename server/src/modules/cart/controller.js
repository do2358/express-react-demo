import asyncHandler from '../../middlewares/asyncHandler.js';
import { successResponse } from '../../utils/response.js';
import * as cartService from './service.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  User
export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getUserCart(req.user._id);
  
  successResponse(res, { cart }, 'Cart retrieved successfully');
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  User
export const addItem = asyncHandler(async (req, res) => {
  const { product, quantity } = req.body;
  
  const cart = await cartService.addToCart(req.user._id, product, quantity);
  
  successResponse(res, { cart }, 'Item added to cart successfully');
});

// @desc    Update cart item
// @route   PUT /api/cart/update/:itemId
// @access  User
export const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  
  const cart = await cartService.updateCartItem(req.user._id, req.params.itemId, quantity);
  
  successResponse(res, { cart }, 'Cart updated successfully');
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  User
export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.itemId);
  
  successResponse(res, { cart }, 'Item removed from cart');
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  User
export const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);
  
  successResponse(res, null, 'Cart cleared successfully');
});
