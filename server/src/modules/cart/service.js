import Cart from './model.js';
import Product from '../product/model.js';
import Inventory from '../inventory/model.js';

// Get user's cart
export const getUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  
  if (!cart) {
    // Create empty cart if doesn't exist
    cart = await Cart.create({ user: userId, items: [] });
  }
  
  return cart;
};

// Add item to cart
export const addToCart = async (userId, productId, quantity) => {
  // Check if product exists and is active
  const product = await Product.findOne({ _id: productId, status: 'active', isDeleted: false });
  
  if (!product) {
    const error = new Error('Product not found or is not available');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  // Check stock availability
  const inventory = await Inventory.findOne({ product: productId });
  
  if (!inventory || inventory.availableQuantity < quantity) {
    const error = new Error('Insufficient stock available');
    error.statusCode = 400;
    error.code = 'INV_001';
    throw error;
  }
  
  // Get or create cart
  let cart = await Cart.findOne({ user: userId });
  
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }
  
  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  
  if (existingItemIndex !== -1) {
    // Update quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    
    // Check if new quantity exceeds stock
    if (newQuantity > inventory.availableQuantity) {
      const error = new Error('Insufficient stock for requested quantity');
      error.statusCode = 400;
      error.code = 'INV_001';
      throw error;
    }
    
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      addedAt: new Date(),
    });
  }
  
  await cart.save();
  await cart.populate('items.product');
  
  return cart;
};

// Update cart item quantity
export const updateCartItem = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  
  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  const item = cart.items.id(itemId);
  
  if (!item) {
    const error = new Error('Item not found in cart');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  // Check stock availability
  const inventory = await Inventory.findOne({ product: item.product });
  
  if (!inventory || inventory.availableQuantity < quantity) {
    const error = new Error('Insufficient stock available');
    error.statusCode = 400;
    error.code = 'INV_001';
    throw error;
  }
  
  item.quantity = quantity;
  
  await cart.save();
  await cart.populate('items.product');
  
  return cart;
};

// Remove item from cart
export const removeFromCart = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId });
  
  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  cart.items.id(itemId).deleteOne();
  
  await cart.save();
  await cart.populate('items.product');
  
  return cart;
};

// Clear cart
export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  
  if (!cart) {
    return null;
  }
  
  cart.items = [];
  await cart.save();
  
  return cart;
};
