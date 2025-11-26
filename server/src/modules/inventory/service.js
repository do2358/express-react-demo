import Inventory from './model.js';
import { getPagination, getPaginationInfo } from '../../utils/pagination.js';

// Get all inventory records
export const getAllInventory = async (query) => {
  const { page = 1, limit = 20, productId, lowStock } = query;
  
  const { skip, limit: limitNum } = getPagination(page, limit);
  
  const filter = {};
  
  if (productId) {
    filter.product = productId;
  }
  
  const [inventory, total] = await Promise.all([
    Inventory.find(filter)
      .populate('product', 'name price category status')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum),
    Inventory.countDocuments(filter),
  ]);
  
  // Filter low stock if requested
  let filteredInventory = inventory;
  let filteredTotal = total;
  
  if (lowStock === 'true') {
    filteredInventory = inventory.filter((item) => item.isLowStock);
    filteredTotal = filteredInventory.length;
  }
  
  const pagination = getPaginationInfo(filteredTotal, Number(page), limitNum);
  
  return { inventory: filteredInventory, pagination };
};

// Get inventory by ID
export const getInventoryById = async (inventoryId) => {
  const inventory = await Inventory.findById(inventoryId).populate('product');
  
  if (!inventory) {
    const error = new Error('Inventory not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  return inventory;
};

// Get inventory by product ID
export const getInventoryByProduct = async (productId) => {
  const inventory = await Inventory.findOne({ product: productId }).populate('product');
  
  if (!inventory) {
    const error = new Error('Inventory not found for this product');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  return inventory;
};

// Create inventory
export const createInventory = async (inventoryData) => {
  // Check if inventory already exists for this product
  const existing = await Inventory.findOne({ product: inventoryData.product });
  
  if (existing) {
    const error = new Error('Inventory already exists for this product');
    error.statusCode = 400;
    error.code = 'VAL_001';
    throw error;
  }
  
  const inventory = await Inventory.create({
    ...inventoryData,
    lastRestocked: new Date(),
  });
  
  return await inventory.populate('product');
};

// Update inventory
export const updateInventory = async (inventoryId, updateData) => {
  const inventory = await Inventory.findByIdAndUpdate(
    inventoryId,
    { ...updateData, lastRestocked: new Date() },
    { new: true, runValidators: true }
  ).populate('product');
  
  if (!inventory) {
    const error = new Error('Inventory not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  return inventory;
};

// Delete inventory
export const deleteInventory = async (inventoryId) => {
  const inventory = await Inventory.findByIdAndDelete(inventoryId);
  
  if (!inventory) {
    const error = new Error('Inventory not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  return inventory;
};

// Adjust stock with optimistic locking
export const adjustStock = async (productId, adjustment, reason = '') => {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const inventory = await Inventory.findOne({ product: productId });
      
      if (!inventory) {
        const error = new Error('Inventory not found for this product');
        error.statusCode = 404;
        error.code = 'RES_001';
        throw error;
      }
      
      const newQuantity = inventory.quantity + adjustment;
      
      if (newQuantity < 0) {
        const error = new Error('Insufficient stock');
        error.statusCode = 400;
        error.code = 'INV_001';
        throw error;
      }
      
      // Use version key for optimistic locking
      const updated = await Inventory.findOneAndUpdate(
        { _id: inventory._id, __v: inventory.__v },
        {
          quantity: newQuantity,
          lastRestocked: adjustment > 0 ? new Date() : inventory.lastRestocked,
          $inc: { __v: 1 },
        },
        { new: true }
      ).populate('product');
      
      if (!updated) {
        // Version mismatch - retry
        retries++;
        if (retries >= maxRetries) {
          const error = new Error('Stock adjustment failed due to concurrent updates. Please try again.');
          error.statusCode = 409;
          error.code = 'INV_001';
          throw error;
        }
        continue;
      }
      
      return updated;
    } catch (error) {
      if (retries >= maxRetries - 1) {
        throw error;
      }
      retries++;
    }
  }
};

// Reserve stock for order (called during order creation)
export const reserveStock = async (productId, quantity) => {
  const inventory = await Inventory.findOne({ product: productId });
  
  if (!inventory) {
    const error = new Error('Inventory not found');
    error.statusCode = 404;
    error.code = 'INV_001';
    throw error;
  }
  
  if (inventory.availableQuantity < quantity) {
    const error = new Error('Insufficient stock available');
    error.statusCode = 400;
    error.code = 'INV_001';
    throw error;
  }
  
  inventory.reservedQuantity += quantity;
  await inventory.save();
  
  return inventory;
};

// Release reserved stock (on order cancellation)
export const releaseStock = async (productId, quantity) => {
  const inventory = await Inventory.findOne({ product: productId });
  
  if (!inventory) {
    return; // Silently fail if inventory not found
  }
  
  inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - quantity);
  await inventory.save();
  
  return inventory;
};

// Deduct stock (on order confirmation/completion)
export const deductStock = async (productId, quantity) => {
  const inventory = await Inventory.findOne({ product: productId });
  
  if (!inventory) {
    const error = new Error('Inventory not found');
    error.statusCode = 404;
    error.code = 'INV_001';
    throw error;
  }
  
  inventory.quantity -= quantity;
  inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - quantity);
  
  if (inventory.quantity < 0) {
    const error = new Error('Insufficient stock');
    error.statusCode = 400;
    error.code = 'INV_001';
    throw error;
  }
  
  await inventory.save();
  
  return inventory;
};
