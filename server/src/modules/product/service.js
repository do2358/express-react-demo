import Product from './model.js';
import { getPagination, getPaginationInfo } from '../../utils/pagination.js';
import { generateUniqueSlug } from '../../utils/slug.js';

// Get all products (public - only active)
export const getActiveProducts = async (query) => {
  const { page = 1, limit = 20, category, minPrice, maxPrice, sort = '-createdAt', search } = query;
  
  const { skip, limit: limitNum } = getPagination(page, limit);
  
  // Build filter
  const filter = { status: 'active', isDeleted: false };
  
  if (category) {
    filter.category = category;
  }
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  
  if (search) {
    filter.$text = { $search: search };
  }
  
  // Execute query
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-isDeleted'),
    Product.countDocuments(filter),
  ]);
  
  const pagination = getPaginationInfo(total, Number(page), limitNum);
  
  return { products, pagination };
};

// Get single product (public)
export const getProductById = async (productId) => {
  const product = await Product.findOne({
    _id: productId,
    status: 'active',
    isDeleted: false,
  });
  
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  return product;
};

// ===== ADMIN FUNCTIONS =====

// Get all products (admin - includes all statuses)
export const getAllProducts = async (query) => {
  const { page = 1, limit = 20, category, status, search } = query;
  
  const { skip, limit: limitNum } = getPagination(page, limit);
  
  // Build filter  
  const filter = { isDeleted: false };
  
  if (category) {
    filter.category = category;
  }
  
  if (status) {
    filter.status = status;
  }
  
  if (search) {
    filter.$text = { $search: search };
  }
  
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);
  
  const pagination = getPaginationInfo(total, Number(page), limitNum);
  
  return { products, pagination };
};

// Get product by ID (admin)
export const getProductByIdAdmin = async (productId) => {
  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
  });
  
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  return product;
};

// Create product
export const createProduct = async (productData) => {
  // Generate unique slug if not provided
  if (!productData.slug) {
    const baseSlug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    productData.slug = await generateUniqueSlug(Product, baseSlug);
  }
  
  const product = await Product.create(productData);
  return product;
};

// Update product
export const updateProduct = async (productId, updateData) => {
  // If name is changed, regenerate slug
  if (updateData.name) {
    const baseSlug = updateData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    updateData.slug = await generateUniqueSlug(Product, baseSlug, productId);
  }
  
  const product = await Product.findOneAndUpdate(
    { _id: productId, isDeleted: false },
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  return product;
};

// Delete product (soft delete)
export const deleteProduct = async (productId) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }
  
  return product;
};
