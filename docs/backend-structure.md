# Backend Architecture & Structure

## Overview

The backend follows a **modular, layered architecture** with clear separation of concerns. Each feature is self-contained in its own module with consistent internal structure.

## Directory Structure

```
server/
 src/
    app.js                    # Express app configuration
    server.js                 # HTTP server entry point
    config/
       database.js           # MongoDB connection
    middlewares/
       errorHandler.js       # Centralized error handling
       asyncHandler.js       # Async/await wrapper
       auth.js               # JWT authentication middleware
       validate.js           # Joi validation middleware
    modules/                  # Feature modules (domain-driven)
       auth/
       user/
       product/
       inventory/
       cart/
       order/
    utils/
        responses.js          # Standardized API responses
        errorCodes.js         # Error code constants
 make-admin.js                 # CLI tool for creating admin users
 package.json
 .env.example
```

## Module Structure Pattern

Every module follows this **consistent internal structure**:

```
modules/<feature>/
 index.js        # Express router (route definitions)
 controller.js   # Route handlers (HTTP layer)
 service.js      # Business logic (core operations)
 validation.js   # Joi schemas (input validation)
 model.js        # Mongoose model (data layer) [if applicable]
```

### Example: Product Module

```
modules/product/
 index.js        # Routes: GET /products, POST /products, etc.
 controller.js   # getProducts(), createProduct(), etc.
 service.js      # findProducts(), createProduct() business logic
 validation.js   # productSchema, createProductSchema
 model.js        # Product Mongoose schema
```

## Layered Architecture

### Layer 1: Routes (`index.js`)
- **Responsibility**: Define HTTP endpoints and methods
- **Pattern**: Express Router
- **Example**:
```javascript
import express from 'express';
import * as controller from './controller.js';
import { auth, adminAuth } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as validation from './validation.js';

const router = express.Router();

router.get('/', controller.getProducts);
router.post('/', adminAuth, validate(validation.createProductSchema), controller.createProduct);

export default router;
```

**Key Points**:
- Routes are declarative and readable
- Middleware applied in order: auth � validation � controller
- Each route maps to a controller method

### Layer 2: Controllers (`controller.js`)
- **Responsibility**: Handle HTTP requests and responses
- **Pattern**: Async handlers wrapped with `asyncHandler`
- **Example**:
```javascript
import asyncHandler from '../../middlewares/asyncHandler.js';
import * as service from './service.js';
import { successResponse } from '../../utils/responses.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, category, search } = req.query;
  const result = await service.findProducts({ page, limit, category, search });
  successResponse(res, result, 'Products retrieved successfully');
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await service.createProduct(req.body, req.user.id);
  successResponse(res, product, 'Product created successfully', 201);
});
```

**Key Points**:
- Controllers don't contain business logic
- Extract request data and pass to services
- Use standard response utilities
- Errors automatically handled by `asyncHandler`

### Layer 3: Services (`service.js`)
- **Responsibility**: Business logic and data operations
- **Pattern**: Pure functions that orchestrate database operations
- **Example**:
```javascript
import Product from './model.js';
import AppError from '../../utils/AppError.js';
import { ERROR_CODES } from '../../utils/errorCodes.js';

export const findProducts = async ({ page = 1, limit = 10, category, search }) => {
  const query = { deletedAt: null, status: 'active' };

  if (category) query.category = category;
  if (search) query.$text = { $search: search };

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).limit(limit).skip(skip).sort({ createdAt: -1 }),
    Product.countDocuments(query)
  ]);

  return {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const createProduct = async (productData, userId) => {
  // Business logic: generate slug, set defaults
  const slug = productData.name.toLowerCase().replace(/\s+/g, '-');

  const product = new Product({
    ...productData,
    slug,
    createdBy: userId
  });

  await product.save();
  return product;
};
```

**Key Points**:
- Services contain all business logic
- Services can call other services
- Throw `AppError` for business rule violations
- Return data, not HTTP responses

### Layer 4: Models (`model.js`)
- **Responsibility**: Data structure and database schema
- **Pattern**: Mongoose schemas with virtuals and methods
- **Example**:
```javascript
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  category: { type: String, index: true },
  status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'draft' },
  images: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true,
  versionKey: '__v'  // Important for optimistic locking
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });

// Virtuals
productSchema.virtual('isDeleted').get(function() {
  return this.deletedAt !== null;
});

export default mongoose.model('Product', productSchema);
```

**Key Points**:
- Define schema with validations
- Create indexes for performance
- Use virtuals for computed properties
- Enable timestamps and version keys

### Layer 5: Validation (`validation.js`)
- **Responsibility**: Input validation schemas
- **Pattern**: Joi schemas
- **Example**:
```javascript
import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().max(1000),
  price: Joi.number().required().min(0),
  category: Joi.string().required(),
  status: Joi.string().valid('draft', 'active', 'inactive').default('draft'),
  images: Joi.array().items(Joi.string().uri())
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().max(1000),
  price: Joi.number().min(0),
  category: Joi.string(),
  status: Joi.string().valid('draft', 'active', 'inactive'),
  images: Joi.array().items(Joi.string().uri())
});

export const productIdSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});
```

**Key Points**:
- Separate schemas for create/update operations
- Validation rules match business requirements
- Used via `validate` middleware

## Core Modules Deep Dive

### Authentication Module (`auth/`)

**Purpose**: User registration, login, token management

**Routes**:
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - User/admin login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (invalidate refresh token)

**Key Patterns**:
```javascript
// service.js - Password hashing
import bcrypt from 'bcryptjs';

export const register = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new User({ ...userData, password: hashedPassword });
  await user.save();

  const tokens = generateTokens(user);
  return { user: sanitizeUser(user), ...tokens };
};

// service.js - JWT token generation
import jwt from 'jsonwebtoken';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
```

### Inventory Module (`inventory/`)

**Purpose**: Stock management with concurrency control

**Key Patterns**:

**Optimistic Locking**:
```javascript
// service.js - Adjust stock with retry logic
export const adjustStock = async (productId, adjustment, reason = '') => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const inventory = await Inventory.findOne({ product: productId });
      if (!inventory) throw new AppError('Inventory not found', 404);

      const newQuantity = inventory.quantity + adjustment;
      if (newQuantity < 0) {
        throw new AppError('Insufficient stock', 400, ERROR_CODES.INSUFFICIENT_STOCK);
      }

      // Use version key for optimistic locking
      const updated = await Inventory.findOneAndUpdate(
        { _id: inventory._id, __v: inventory.__v },  // Match current version
        {
          quantity: newQuantity,
          $inc: { __v: 1 },  // Increment version
          $push: {
            history: {
              type: adjustment > 0 ? 'increase' : 'decrease',
              quantity: Math.abs(adjustment),
              reason,
              timestamp: new Date()
            }
          }
        },
        { new: true }
      );

      if (!updated) {
        // Version mismatch - another update happened
        retries++;
        continue;
      }

      return updated;
    } catch (error) {
      if (retries >= maxRetries - 1) throw error;
      retries++;
    }
  }

  throw new AppError('Failed to update inventory after retries', 500);
};
```

**Stock Reservation System**:
```javascript
// model.js
const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 0 },
  reserved: { type: Number, default: 0 },  // Stock reserved for pending orders
  lowStockThreshold: { type: Number, default: 10 }
});

// Virtual: available stock
inventorySchema.virtual('available').get(function() {
  return this.quantity - this.reserved;
});

// service.js - Reserve stock
export const reserveStock = async (productId, quantity) => {
  const inventory = await Inventory.findOne({ product: productId });

  if (inventory.available < quantity) {
    throw new AppError('Insufficient available stock', 400);
  }

  const updated = await Inventory.findOneAndUpdate(
    { _id: inventory._id, __v: inventory.__v },
    {
      $inc: { reserved: quantity, __v: 1 }
    },
    { new: true }
  );

  return updated;
};

// service.js - Deduct reserved stock (on order completion)
export const deductReservedStock = async (productId, quantity) => {
  const updated = await Inventory.findOneAndUpdate(
    { product: productId },
    {
      $inc: { quantity: -quantity, reserved: -quantity }
    },
    { new: true }
  );

  return updated;
};
```

### Order Module (`order/`)

**Purpose**: Order creation with stock management and rollback

**Key Patterns**:

**Order Snapshots**:
```javascript
// model.js - Store product data at time of purchase
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productSnapshot: {
    name: String,
    price: Number,
    description: String,
    image: String
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }  // Price at time of purchase
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: { /* ... */ },
  paymentMethod: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  totalAmount: { type: Number, required: true }
}, { timestamps: true });
```

**Transaction-like Order Creation**:
```javascript
// service.js
import * as inventoryService from '../inventory/service.js';
import * as cartService from '../cart/service.js';

export const createOrder = async (userId, orderData) => {
  const cart = await cartService.getCart(userId);
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // Step 1: Reserve stock for all items
  const reservations = [];
  try {
    for (const item of cart.items) {
      await inventoryService.reserveStock(item.product._id, item.quantity);
      reservations.push({ productId: item.product._id, quantity: item.quantity });
    }
  } catch (error) {
    // Rollback reservations
    for (const res of reservations) {
      await inventoryService.releaseReservedStock(res.productId, res.quantity);
    }
    throw error;
  }

  // Step 2: Create order with product snapshots
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    productSnapshot: {
      name: item.product.name,
      price: item.product.price,
      description: item.product.description,
      image: item.product.images?.[0]
    },
    quantity: item.quantity,
    price: item.price
  }));

  const order = new Order({
    orderNumber,
    user: userId,
    items: orderItems,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    totalAmount: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    status: 'pending',
    statusHistory: [{
      status: 'pending',
      timestamp: new Date(),
      note: 'Order created'
    }]
  });

  await order.save();

  // Step 3: Clear cart
  await cartService.clearCart(userId);

  return order;
};

// service.js - Update order status with history
export const updateOrderStatus = async (orderId, status, note = '') => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  // If confirming order, deduct reserved stock
  if (status === 'confirmed' && order.status === 'pending') {
    for (const item of order.items) {
      await inventoryService.deductReservedStock(item.product, item.quantity);
    }
  }

  // If cancelling order, release reserved stock
  if (status === 'cancelled') {
    for (const item of order.items) {
      await inventoryService.releaseReservedStock(item.product, item.quantity);
    }
  }

  order.status = status;
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    note
  });

  await order.save();
  return order;
};
```

## Middleware System

### Error Handler (`middlewares/errorHandler.js`)

**Purpose**: Centralized error handling for consistent API responses

```javascript
import { errorResponse } from '../utils/responses.js';

const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err);

  // Default to 500 server error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errorCode = err.errorCode || 'INTERNAL_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
    errorCode = 'VALIDATION_ERROR';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    errorCode = 'INVALID_ID';
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
    errorCode = 'DUPLICATE_ERROR';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    errorCode = 'INVALID_TOKEN';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    errorCode = 'TOKEN_EXPIRED';
  }

  errorResponse(res, message, statusCode, errorCode);
};

export default errorHandler;
```

### Async Handler (`middlewares/asyncHandler.js`)

**Purpose**: Eliminate try-catch boilerplate in async route handlers

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
```

**Usage**:
```javascript
// Without asyncHandler
export const getProducts = async (req, res, next) => {
  try {
    const products = await service.findProducts(req.query);
    successResponse(res, products);
  } catch (error) {
    next(error);
  }
};

// With asyncHandler
export const getProducts = asyncHandler(async (req, res) => {
  const products = await service.findProducts(req.query);
  successResponse(res, products);
});
```

### Authentication Middleware (`middlewares/auth.js`)

**Purpose**: Verify JWT tokens and attach user to request

```javascript
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import User from '../modules/user/model.js';

// Base auth middleware
export const auth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new AppError('User not found', 401, 'UNAUTHORIZED');
  }

  req.user = user;
  next();
});

// Admin-only middleware
export const adminAuth = asyncHandler(async (req, res, next) => {
  await auth(req, res, () => {});

  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required', 403, 'FORBIDDEN');
  }

  next();
});
```

### Validation Middleware (`middlewares/validate.js`)

**Purpose**: Validate request body/params/query against Joi schemas

```javascript
import { errorResponse } from '../utils/responses.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return errorResponse(res, 'Validation failed', 400, 'VALIDATION_ERROR', errors);
    }

    next();
  };
};
```

## Utility Functions

### Standard Responses (`utils/responses.js`)

**Purpose**: Consistent API response format

```javascript
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message, statusCode = 500, errorCode = 'ERROR', details = null) => {
  const response = {
    success: false,
    message,
    errorCode
  };

  if (details) response.details = details;

  res.status(statusCode).json(response);
};
```

### Error Codes (`utils/errorCodes.js`)

**Purpose**: Centralized error code constants

```javascript
export const ERROR_CODES = {
  // Auth errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_ID: 'INVALID_ID',

  // Business logic errors
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',

  // Generic errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND'
};
```

## Key Design Patterns

### 1. Soft Delete Pattern
```javascript
// Instead of deleting, mark as deleted
export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { deletedAt: new Date() },
    { new: true }
  );

  return product;
};

// Filter out deleted items in queries
const query = { deletedAt: null };
const products = await Product.find(query);
```

### 2. Optimistic Locking Pattern
```javascript
// Use __v (version key) for concurrency control
const updated = await Inventory.findOneAndUpdate(
  { _id: inventory._id, __v: inventory.__v },  // Match current version
  { quantity: newQuantity, $inc: { __v: 1 } }, // Increment version
  { new: true }
);

if (!updated) {
  // Version mismatch - retry or fail
}
```

### 3. Service Composition Pattern
```javascript
// Services call other services
export const createOrder = async (userId, orderData) => {
  // Use cart service
  const cart = await cartService.getCart(userId);

  // Use inventory service
  for (const item of cart.items) {
    await inventoryService.reserveStock(item.product._id, item.quantity);
  }

  // Create order
  const order = await Order.create(/* ... */);

  // Use cart service again
  await cartService.clearCart(userId);

  return order;
};
```

### 4. Snapshot Pattern
```javascript
// Store current state for historical accuracy
const orderItem = {
  product: productId,
  productSnapshot: {
    name: product.name,
    price: product.price,
    description: product.description
  },
  quantity: 2,
  price: product.price  // Price at time of purchase
};
```

## Application Flow

### Request-Response Cycle

```
HTTP Request
    �
Express Routing
    �
Middleware Chain
     CORS
     Body Parser
     Auth (if protected)
     Validation (if schema defined)
    �
Controller (HTTP layer)
    �
Service (Business logic)
    �
Model (Data layer)
    �
MongoDB
    �
Response
     Success � successResponse()
     Error � errorHandler middleware
    �
HTTP Response (JSON)
```

### Example Flow: Create Order

```
1. POST /api/orders
2. Auth middleware verifies JWT token
3. Validate middleware checks order data schema
4. orderController.createOrder() extracts request data
5. orderService.createOrder() business logic:
   a. Get user's cart (cartService.getCart)
   b. Reserve stock for each item (inventoryService.reserveStock)
   c. Create order document with snapshots
   d. Clear user's cart (cartService.clearCart)
6. Return order data
7. successResponse() formats JSON
8. HTTP 201 response
```

## Best Practices Demonstrated

1. **Separation of Concerns**: Clear layers (routes � controllers � services � models)
2. **Error Handling**: Centralized error handler, consistent error responses
3. **Validation**: Input validation at API boundary with Joi
4. **Security**: Password hashing, JWT tokens, role-based access control
5. **Data Integrity**: Optimistic locking, soft deletes, transaction-like operations
6. **Code Organization**: Module-based structure, consistent file naming
7. **Reusability**: Service composition, utility functions
8. **Maintainability**: Clear patterns, standardized responses

## Applying to New Projects

To build a similar system:

1. **Start with structure**: Create `modules/`, `middlewares/`, `utils/` directories
2. **Set up foundation**: Database, error handler, async handler, validation
3. **Define modules**: One module per domain/feature
4. **Follow patterns**: Use the same file structure for each module
5. **Build layers**: Routes � Controllers � Services � Models
6. **Add middleware**: Auth, validation, error handling
7. **Use utilities**: Standard responses, error codes
8. **Test incrementally**: Test each module before moving to next

This architecture scales well for:
- E-commerce platforms
- Content management systems
- API-driven applications
- Multi-tenant SaaS applications
- Business management systems

**See also**: `server/REBUILD_TUTORIAL.md` for step-by-step implementation guide
