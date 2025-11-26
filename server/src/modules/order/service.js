import Order from './model.js';
import Cart from '../cart/model.js';
import * as inventoryService from '../inventory/service.js';
import * as cartService from '../cart/service.js';
import { generateOrderNumber } from '../../utils/orderNumber.js';
import { getPagination, getPaginationInfo } from '../../utils/pagination.js';

// Create order from cart
export const createOrder = async (userId, orderData) => {
  // Get user's cart
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    const error = new Error('Cart is empty');
    error.statusCode = 400;
    error.code = 'ORD_001';
    throw error;
  }
  
  // Validate and prepare order items
  const orderItems = [];
  let subtotal = 0;
  
  for (const item of cart.items) {
    if (!item.product || item.product.status !== 'active') {
      const error = new Error(`Product ${item.product?.name || 'Unknown'} is not available`);
      error.statusCode = 400;
      error.code = 'ORD_001';
      throw error;
    }
    
    // Deduct inventory
    try {
      await inventoryService.deductStock(item.product._id, item.quantity);
    } catch (error) {
      // Rollback - restore previously deducted stock
      for (const prevItem of orderItems) {
        await inventoryService.adjustStock(prevItem.product, prevItem.quantity);
      }
      throw error;
    }
    
    const itemSubtotal = item.product.price * item.quantity;
    subtotal += itemSubtotal;
    
    orderItems.push({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }
  
  // Calculate totals
  const shippingFee = orderData.shippingFee || 0;
  const discount = orderData.discount || 0;
  const totalAmount = subtotal + shippingFee - discount;
  
  // Create order
  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: userId,
    items: orderItems,
    subtotal,
    shippingFee,
    discount,
    totalAmount,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod || 'cod',
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        changedAt: new Date(),
        changedBy: userId,
      },
    ],
  });
  
  // Clear cart
  await cartService.clearCart(userId);
  
  return await order.populate('user', 'name email phone');
};

// Get user orders
export const getUserOrders = async (userId, query) => {
  const { page = 1, limit = 20, status } = query;
  
  const { skip, limit: limitNum } = getPagination(page, limit);
  
  const filter = { user: userId };
  
  if (status) {
    filter.status = status;
  }
  
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);
  
  const pagination = getPaginationInfo(total, Number(page), limitNum);
  
  return { orders, pagination };
};

// Get order by ID (customer)
export const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId })
    .populate('user', 'name email phone')
    .populate('items.product', 'name images');
  
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  return order;
};

// Cancel order (customer)
export const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  // Only allow cancellation for pending or confirmed orders
  if (!['pending', 'confirmed'].includes(order.status)) {
    const error = new Error('Cannot cancel order with current status');
    error.statusCode = 400;
    error.code = 'ORD_001';
    throw error;
  }
  
  // Restore inventory
  for (const item of order.items) {
    await inventoryService.adjustStock(item.product, item.quantity);
  }
  
  // Update order status
  order.status = 'cancelled';
  order.statusHistory.push({
    status: 'cancelled',
    changedAt: new Date(),
    changedBy: userId,
    note: 'Cancelled by customer',
  });
  
  await order.save();
  
  return order;
};

// ===== ADMIN FUNCTIONS =====

// Get all orders (admin)
export const getAllOrders = async (query) => {
  const { page = 1, limit = 20, status, userId } = query;
  
  const { skip, limit: limitNum } = getPagination(page, limit);
  
  const filter = {};
  
  if (status) {
    filter.status = status;
  }
  
  if (userId) {
    filter.user = userId;
  }
  
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);
  
  const pagination = getPaginationInfo(total, Number(page), limitNum);
  
  return { orders, pagination };
};

// Get order by ID (admin)
export const getOrderByIdAdmin = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate('user', 'name email phone')
    .populate('items.product', 'name images')
    .populate('statusHistory.changedBy', 'name email');
  
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  return order;
};

// Update order status (admin)
export const updateOrderStatus = async (orderId, status, note, adminId) => {
  const order = await Order.findById(orderId);
  
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  // Validate status transition
  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };
  
  if (!validTransitions[order.status].includes(status)) {
    const error = new Error(`Cannot change status from ${order.status} to ${status}`);
    error.statusCode = 400;
    error.code = 'ORD_001';
    throw error;
  }
  
  // If cancelling, restore inventory
  if (status === 'cancelled') {
    for (const item of order.items) {
      await inventoryService.adjustStock(item.product, item.quantity);
    }
  }
  
  order.status = status;
  order.statusHistory.push({
    status,
    changedAt: new Date(),
    changedBy: adminId,
    note,
  });
  
  await order.save();
  
  return order;
};
