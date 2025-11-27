# Complete E-Commerce Backend Tutorial: Build From Scratch

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Core Problems We're Solving](#2-core-problems-were-solving)
3. [Project Setup](#3-project-setup)
4. [Building the Foundation](#4-building-the-foundation)
5. [Feature 1: Authentication System](#5-feature-1-authentication-system)
6. [Feature 2: Product Management](#6-feature-2-product-management)
7. [Feature 3: Inventory System](#7-feature-3-inventory-system)
8. [Feature 4: Shopping Cart](#8-feature-4-shopping-cart)
9. [Feature 5: Order Processing](#9-feature-5-order-processing)
10. [Testing Your API](#10-testing-your-api)
11. [Best Practices & Next Steps](#11-best-practices--next-steps)

---

## 1. System Overview

### What We're Building
A production-ready REST API for an e-commerce platform with:
- User authentication and authorization
- Product catalog management
- Inventory tracking
- Shopping cart functionality
- Order processing

### Architecture at a Glance
```
server/
├── src/
│   ├── app.js                    # Express app entry point
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── middlewares/              # Reusable middleware
│   │   ├── auth.js               # Authentication & authorization
│   │   ├── errorHandler.js       # Centralized error handling
│   │   ├── validate.js           # Request validation
│   │   └── asyncHandler.js       # Async error wrapper
│   ├── utils/                    # Helper functions
│   │   ├── response.js           # Standardized responses
│   │   └── pagination.js         # Pagination logic
│   └── modules/                  # Feature modules
│       ├── auth/
│       │   ├── index.js          # Routes
│       │   ├── controller.js     # Request handlers
│       │   ├── service.js        # Business logic
│       │   ├── validation.js     # Joi schemas
│       │   └── model.js          # (uses User model)
│       ├── user/
│       │   └── model.js          # Mongoose schema
│       ├── product/
│       ├── inventory/
│       ├── cart/
│       └── order/
└── package.json
```

### Key Architectural Patterns

**1. Layered Architecture**
```
Client Request
    ↓
Routes (index.js) → Define endpoints
    ↓
Validation Middleware → Validate input
    ↓
Controller → Handle HTTP request/response
    ↓
Service → Business logic & data operations
    ↓
Model → Database interaction
    ↓
Database
```

**2. Module-Based Organization**
Each feature is self-contained with its own routes, controllers, services, and validations.

**3. Separation of Concerns**
- Routes: Define endpoints and attach middleware
- Controllers: Handle HTTP (req/res), minimal logic
- Services: Business logic, database operations
- Models: Data structure and validation
- Middleware: Cross-cutting concerns (auth, validation, errors)

---

## 2. Core Problems We're Solving

### Problem 1: Unstructured Codebases
**Issue**: As projects grow, code becomes messy and hard to maintain.

**Solution**: Module-based architecture where each feature lives in its own folder with clear responsibilities.

### Problem 2: Inconsistent Error Handling
**Issue**: Errors handled differently across the app, hard to debug.

**Solution**: Centralized error handler that catches all errors and formats them consistently.

### Problem 3: Async/Await Error Handling Boilerplate
**Issue**: Every async function needs try/catch blocks.

**Solution**: `asyncHandler` wrapper that automatically catches errors and passes them to error handler.

### Problem 4: Repetitive Validation Logic
**Issue**: Manual validation in every route leads to inconsistency.

**Solution**: Joi schemas + validation middleware for declarative, reusable validation.

### Problem 5: Security Vulnerabilities
**Issue**: Passwords stored in plain text, no token expiration, CORS issues.

**Solution**: bcrypt for passwords, JWT with expiration, helmet for headers, CORS configuration.

### Problem 6: Inconsistent API Responses
**Issue**: Different endpoints return different response formats.

**Solution**: Standardized response helpers that ensure uniform structure.

---

## 3. Project Setup

### Step 1: Initialize Project

```bash
# Create project directory
mkdir ecommerce-backend
cd ecommerce-backend

# Initialize npm project
npm init -y
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install express mongoose dotenv cors helmet morgan

# Authentication
npm install bcryptjs jsonwebtoken

# Validation
npm install joi

# Development dependencies
npm install -D nodemon eslint prettier
```

**Dependency Explanation:**
- `express`: Web framework
- `mongoose`: MongoDB object modeling
- `dotenv`: Environment variable management
- `cors`: Cross-Origin Resource Sharing
- `helmet`: Security headers
- `morgan`: HTTP request logging
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token generation/validation
- `joi`: Schema validation
- `nodemon`: Auto-restart on file changes

### Step 3: Configure package.json

Update `package.json`:
```json
{
  "name": "ecommerce-backend",
  "version": "1.0.0",
  "description": "E-Commerce Backend API",
  "main": "src/app.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

**Key point**: `"type": "module"` enables ES6 imports.

### Step 4: Create Environment File

Create `.env`:
```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

Create `.env.example` (without sensitive values):
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=change-this-in-production
JWT_REFRESH_SECRET=change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Add to `.gitignore`:
```
node_modules/
.env
*.log
```

---

## 4. Building the Foundation

### Step 1: Database Configuration

Create `src/config/database.js`:
```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

**What's happening:**
1. Connects to MongoDB using connection string from `.env`
2. Logs connection status
3. Sets up error handlers for connection issues
4. Graceful shutdown on CTRL+C (SIGINT)

### Step 2: Error Handler Middleware

Create `src/middlewares/errorHandler.js`:
```javascript
// Centralized error handler
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      code: 'VAL_001',
      message: 'Validation error',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      code: 'VAL_001',
      message: `${field} already exists`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      code: 'VAL_001',
      message: 'Invalid ID format',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      code: 'AUTH_002',
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      code: 'AUTH_002',
      message: 'Token expired',
    });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    code: err.code || 'SRV_001',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
```

**Why this is important:**
- Catches ALL errors in one place
- Transforms different error types into consistent format
- Provides detailed errors in development, clean errors in production
- Uses error codes for frontend error handling

### Step 3: Async Handler Wrapper

Create `src/middlewares/asyncHandler.js`:
```javascript
// Wrapper for async route handlers to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
```

**Problem it solves:**
Instead of writing:
```javascript
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});
```

You can write:
```javascript
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));
```

### Step 4: Validation Middleware

Create `src/middlewares/validate.js`:
```javascript
// Joi validation middleware
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown keys
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        code: 'VAL_001',
        message: 'Validation error',
        errors,
      });
    }

    // Replace request data with validated data
    req[source] = value;
    next();
  };
};
```

**How it works:**
1. Takes a Joi schema and data source (body, query, params)
2. Validates the data
3. Returns all validation errors (not just first one)
4. Strips unknown fields for security
5. Replaces request data with sanitized version

### Step 5: Response Utilities

Create `src/utils/response.js`:
```javascript
// Standardized API response helpers

export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message, code = 'SRV_001', statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    code,
    message,
  });
};

export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};
```

**Why consistent responses matter:**
All success responses look like:
```json
{
  "success": true,
  "message": "User created",
  "data": { ... }
}
```

All error responses look like:
```json
{
  "success": false,
  "code": "AUTH_001",
  "message": "Invalid credentials",
  "errors": [ ... ]  // optional
}
```

Frontend can rely on this structure.

### Step 6: Main Application File

Create `src/app.js`:
```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-Commerce API is running',
    version: '1.0.0',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: 'RES_001',
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
```

**Middleware order is critical:**
1. `helmet()` - Security headers (first for all requests)
2. `morgan()` - Logging (early to log everything)
3. `cors()` - CORS handling
4. `express.json()` - Parse JSON bodies
5. Routes - Your application logic
6. 404 handler - Catch unmatched routes
7. Error handler - MUST be last

### Step 7: Test the Foundation

```bash
# Start MongoDB (if local)
mongod

# In another terminal, start the server
npm run dev
```

Visit `http://localhost:3000` - you should see:
```json
{
  "success": true,
  "message": "E-Commerce API is running",
  "version": "1.0.0"
}
```

**Foundation complete!** ✅

---

## 5. Feature 1: Authentication System

### Requirements
- Users can register with email/password
- Users can login and receive JWT tokens
- Passwords must be hashed
- Token-based authentication for protected routes
- Refresh token mechanism
- Role-based access (user/admin)

### API Design

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login user |
| POST | /api/auth/refresh | Public | Refresh access token |
| POST | /api/auth/logout | Private | Logout user |
| GET | /api/auth/me | Private | Get current user |

### Database Schema Design

Create `src/modules/user/model.js`:
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster queries
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
```

**Key concepts:**
- `select: false` on password: Never return password unless explicitly requested
- `pre('save')` hook: Auto-hash password before saving
- `comparePassword` method: Compare plain password with hash
- `toJSON` override: Never expose password in API responses
- Indexes: Speed up email lookups

### Step 1: Validation Schemas

Create `src/modules/auth/validation.js`:
```javascript
import Joi from 'joi';

// Register validation
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)/).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.pattern.base': 'Password must contain letters and numbers',
    'any.required': 'Password is required',
  }),
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
  }),
  phone: Joi.string().optional(),
});

// Login validation
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Refresh token validation
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
```

**Password requirements:**
- Minimum 8 characters
- Must contain letters and numbers
- Custom error messages for better UX

### Step 2: Service Layer (Business Logic)

Create `src/modules/auth/service.js`:
```javascript
import jwt from 'jsonwebtoken';
import User from '../user/model.js';

// Generate JWT access token
export const generateAccessToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

// Generate JWT refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, tokenId: Date.now().toString() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// Register new user
export const register = async (userData) => {
  const { email, password, name, phone } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 400;
    error.code = 'AUTH_001';
    throw error;
  }

  // Create user (password will be auto-hashed by pre-save hook)
  const user = await User.create({
    email,
    password,
    name,
    phone,
  });

  // Generate tokens
  const accessToken = generateAccessToken(user._id, user.email, user.role);
  const refreshToken = generateRefreshToken(user._id);

  return {
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

// Login user
export const login = async (email, password) => {
  // Find user with password field (normally excluded)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.code = 'AUTH_001';
    throw error;
  }

  // Check if user is active
  if (!user.isActive) {
    const error = new Error('Account is inactive');
    error.statusCode = 401;
    error.code = 'AUTH_001';
    throw error;
  }

  // Verify password using model method
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.code = 'AUTH_001';
    throw error;
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id, user.email, user.role);
  const refreshToken = generateRefreshToken(user._id);

  return {
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      error.code = 'AUTH_002';
      throw error;
    }

    const accessToken = generateAccessToken(user._id, user.email, user.role);

    return { accessToken };
  } catch (error) {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    err.code = 'AUTH_002';
    throw err;
  }
};
```

**Security best practices:**
- Never reveal if email exists (use generic "Invalid credentials")
- Check isActive status
- Separate access token (short-lived) and refresh token (long-lived)
- Error codes help frontend handle different scenarios

### Step 3: Controller Layer (HTTP Handlers)

Create `src/modules/auth/controller.js`:
```javascript
import asyncHandler from '../../middlewares/asyncHandler.js';
import { successResponse } from '../../utils/response.js';
import * as authService from './service.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  successResponse(res, result, 'User registered successfully', 201);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  successResponse(res, result, 'Login successful');
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshAccessToken(refreshToken);

  successResponse(res, result, 'Token refreshed successfully');
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  // In production, blacklist the token or invalidate refresh token
  successResponse(res, null, 'Logout successful');
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    phone: req.user.phone,
    role: req.user.role,
  };

  successResponse(res, { user }, 'User retrieved successfully');
});
```

**Controller responsibilities:**
- Extract data from request
- Call service methods
- Format and send response
- NO business logic (that's in service layer)

### Step 4: Authentication Middleware

Create `src/middlewares/auth.js`:
```javascript
import jwt from 'jsonwebtoken';
import User from '../modules/user/model.js';

// Verify JWT token and attach user to request
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_002',
        message: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          code: 'AUTH_001',
          message: 'User not found or inactive',
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_002',
        message: 'Invalid or expired token',
      });
    }
  } catch (error) {
    next(error);
  }
};

// Check if user has required role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_002',
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        code: 'AUTH_003',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};
```

**Usage:**
```javascript
// Require authentication
router.get('/profile', authenticate, controller.getProfile);

// Require specific role
router.delete('/users/:id', authenticate, authorize('admin'), controller.deleteUser);
```

### Step 5: Routes

Create `src/modules/auth/index.js`:
```javascript
import express from 'express';
import * as authController from './controller.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema, loginSchema, refreshTokenSchema } from './validation.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), authController.registerUser);
router.post('/login', validate(loginSchema), authController.loginUser);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logoutUser);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
```

**Middleware chain:**
```
POST /api/auth/register
  ↓
validate(registerSchema)  → Validates request body
  ↓
authController.registerUser  → Handles request
  ↓
asyncHandler  → Catches errors
  ↓
authService.register  → Business logic
  ↓
successResponse  → Sends response
```

### Step 6: Mount Routes in App

Update `src/app.js`:
```javascript
// Add this import at the top
import authRoutes from './modules/auth/index.js';

// Add this before the 404 handler
app.use('/api/auth', authRoutes);
```

### Step 7: Test Authentication

**Test Registration:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Pass1234",
    "name": "John Doe",
    "phone": "1234567890"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Test Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Pass1234"
  }'
```

**Test Protected Route:**
```bash
# Get token from login response
TOKEN="your-access-token-here"

curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Test Validation:**
```bash
# Should fail - password too short
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123",
    "name": "Test"
  }'
```

Response:
```json
{
  "success": false,
  "code": "VAL_001",
  "message": "Validation error",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**Authentication complete!** ✅

---

## 6. Feature 2: Product Management

### Requirements
- Admin can create, read, update, delete products
- Customers can view active products
- Products have name, description, price, images, category
- Auto-generate URL-friendly slugs
- Soft delete (mark as deleted, don't remove from DB)
- Search and filter products

### API Design

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/products | Public | List all active products |
| GET | /api/products/:id | Public | Get product details |
| POST | /api/admin/products | Admin | Create product |
| PUT | /api/admin/products/:id | Admin | Update product |
| DELETE | /api/admin/products/:id | Admin | Soft delete product |

### Database Schema

Create `src/modules/product/model.js`:
```javascript
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    comparePrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'draft',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filter
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ slug: 1 });

// Auto-generate slug from name if not provided
productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
```

**Key features:**
- `comparePrice`: For showing discounts
- `slug`: Auto-generated URL-friendly identifier
- Text indexes: Enable full-text search
- `isDeleted`: Soft delete (keep data for reporting)

### Validation Schemas

Create `src/modules/product/validation.js`:
```javascript
import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().min(0).required(),
  comparePrice: Joi.number().min(0).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('active', 'inactive', 'draft').optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().min(0).optional(),
  comparePrice: Joi.number().min(0).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  category: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('active', 'inactive', 'draft').optional(),
});

export const productQuerySchema = Joi.object({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).max(100).optional(),
  category: Joi.string().optional(),
  search: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'draft').optional(),
});
```

### Service Layer

Create `src/modules/product/service.js`:
```javascript
import Product from './model.js';

// Get paginated products with filters
export const getProducts = async (filters = {}, page = 1, limit = 20) => {
  const query = { isDeleted: false };

  // Filter by category
  if (filters.category) {
    query.category = filters.category;
  }

  // Filter by status
  if (filters.status) {
    query.status = filters.status;
  } else {
    // Default: only show active products to public
    query.status = 'active';
  }

  // Full-text search
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get single product by ID or slug
export const getProductById = async (identifier) => {
  const product = await Product.findOne({
    $or: [{ _id: identifier }, { slug: identifier }],
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

// Create product (admin only)
export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

// Update product (admin only)
export const updateProduct = async (productId, updateData) => {
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

// Soft delete product (admin only)
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
```

**Service best practices:**
- Use `lean()` for read-only operations (faster)
- Parallel queries with `Promise.all` for better performance
- Always filter by `isDeleted: false`
- Accept ID or slug for flexibility

### Controller Layer

Create `src/modules/product/controller.js`:
```javascript
import asyncHandler from '../../middlewares/asyncHandler.js';
import { successResponse, paginatedResponse } from '../../utils/response.js';
import * as productService from './service.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search, status } = req.query;

  const filters = {};
  if (category) filters.category = category;
  if (search) filters.search = search;
  // Only admins can filter by status
  if (status && req.user?.role === 'admin') filters.status = status;

  const result = await productService.getProducts(
    filters,
    parseInt(page),
    parseInt(limit)
  );

  paginatedResponse(
    res,
    result.products,
    result.pagination,
    'Products retrieved successfully'
  );
});

// @desc    Get product by ID or slug
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
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

// @desc    Delete product (soft delete)
// @route   DELETE /api/admin/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  successResponse(res, null, 'Product deleted successfully');
});
```

### Routes

Create `src/modules/product/index.js`:
```javascript
import express from 'express';
import * as productController from './controller.js';
import { validate } from '../../middlewares/validate.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from './validation.js';
import { authenticate, authorize } from '../../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get(
  '/',
  validate(productQuerySchema, 'query'),
  productController.getProducts
);
router.get('/:id', productController.getProduct);

// Admin routes
router.post(
  '/admin/products',
  authenticate,
  authorize('admin'),
  validate(createProductSchema),
  productController.createProduct
);

router.put(
  '/admin/products/:id',
  authenticate,
  authorize('admin'),
  validate(updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/admin/products/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);

export default router;
```

### Mount in App

Update `src/app.js`:
```javascript
import productRoutes from './modules/product/index.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', productRoutes); // For /api/admin/products routes
```

### Test Products

**Create Product (Admin):**
```bash
# First, login as admin to get token
TOKEN="admin-access-token"

curl -X POST http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "comparePrice": 1299.99,
    "category": "Electronics",
    "tags": ["laptop", "computer"],
    "status": "active"
  }'
```

**List Products (Public):**
```bash
curl http://localhost:3000/api/products
```

**Search Products:**
```bash
curl "http://localhost:3000/api/products?search=laptop&category=Electronics"
```

**Product management complete!** ✅

---

## 7. Feature 3: Inventory System

### Requirements
- Track stock quantity for each product
- Reserved quantity (items in pending orders)
- Low stock alerts
- Optimistic locking (prevent race conditions)
- Stock adjustment operations (restock, deduct, reserve, release)

### API Design

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/admin/inventory | Admin | List all inventory |
| GET | /api/admin/inventory/:id | Admin | Get inventory details |
| POST | /api/admin/inventory | Admin | Create inventory record |
| PUT | /api/admin/inventory/:id | Admin | Update inventory |
| DELETE | /api/admin/inventory/:id | Admin | Delete inventory |

### Database Schema

Create `src/modules/inventory/model.js`:
```javascript
import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      unique: true, // One inventory record per product
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Reserved quantity cannot be negative'],
    },
    warehouse: {
      type: String,
      trim: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Threshold cannot be negative'],
    },
    lastRestocked: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: '__v', // Enable optimistic locking
  }
);

// Indexes
inventorySchema.index({ product: 1 });

// Virtual for available quantity (not reserved)
inventorySchema.virtual('availableQuantity').get(function () {
  return this.quantity - this.reservedQuantity;
});

// Virtual for low stock check
inventorySchema.virtual('isLowStock').get(function () {
  return this.availableQuantity <= this.lowStockThreshold;
});

// Ensure virtuals are included in JSON
inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
```

**Key concepts:**
- `quantity`: Total physical stock
- `reservedQuantity`: Stock allocated to pending orders
- `availableQuantity` (virtual): `quantity - reservedQuantity`
- `isLowStock` (virtual): Computed based on threshold
- `__v`: Version key for optimistic locking (prevents race conditions)

### Service Layer Highlights

Create `src/modules/inventory/service.js` (key functions):
```javascript
import Inventory from './model.js';

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
          const error = new Error('Stock adjustment failed. Please try again.');
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
```

**Optimistic locking explained:**
```
User A reads inventory (version: 1, quantity: 100)
User B reads inventory (version: 1, quantity: 100)
User A deducts 10 → Update succeeds (version: 2, quantity: 90)
User B tries to deduct 20 → Update fails (version mismatch)
User B retries → Reads new version → Update succeeds
```

This prevents the "lost update" problem in concurrent environments.

**Inventory system complete!** ✅

---

## 8. Feature 4: Shopping Cart

### Requirements
- Each user has one cart
- Add/remove/update items in cart
- Check stock availability before adding
- Auto-create cart if doesn't exist
- Clear cart after order creation

### API Design

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/cart | Private | Get user's cart |
| POST | /api/cart/add | Private | Add item to cart |
| PUT | /api/cart/items/:itemId | Private | Update item quantity |
| DELETE | /api/cart/items/:itemId | Private | Remove item from cart |
| DELETE | /api/cart | Private | Clear cart |

### Database Schema

Create `src/modules/cart/model.js`:
```javascript
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true, // One cart per user
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster user cart lookups
cartSchema.index({ user: 1 });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
```

**Schema design:**
- One cart per user (enforced by unique constraint)
- Items stored as subdocuments (embedded)
- Each item has product reference, quantity, and timestamp

### Service Layer

Create `src/modules/cart/service.js`:
```javascript
import Cart from './model.js';
import Product from '../product/model.js';
import Inventory from '../inventory/model.js';

// Get user's cart
export const getUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    // Auto-create empty cart if doesn't exist
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

// Add item to cart
export const addToCart = async (userId, productId, quantity) => {
  // Validate product exists and is active
  const product = await Product.findOne({
    _id: productId,
    status: 'active',
    isDeleted: false
  });

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

  const item = cart.items.id(itemId); // Mongoose subdocument method

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

  cart.items.id(itemId).deleteOne(); // Mongoose subdocument delete

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
```

**Key features:**
- Stock validation before adding to cart
- Prevent adding more than available stock
- Auto-create cart on first add
- Subdocument operations with `.id()` and `.deleteOne()`

### Controller & Routes

Follow the same pattern as previous modules (controller → routes → mount in app).

**Test Cart Operations:**
```bash
TOKEN="user-access-token"

# Get cart
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/cart

# Add to cart
curl -X POST http://localhost:3000/api/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product-id-here",
    "quantity": 2
  }'
```

**Shopping cart complete!** ✅

---

## 9. Feature 5: Order Processing

### Requirements
- Create order from cart
- Auto-generate unique order numbers
- Deduct inventory when order is created
- Track order status history
- Support COD and banking payment
- Admin can view all orders and update status
- Customers can view their own orders

### API Design

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/orders | Private | Create order from cart |
| GET | /api/orders | Private | Get user's orders |
| GET | /api/orders/:id | Private | Get order details |
| GET | /api/admin/orders | Admin | Get all orders |
| PUT | /api/admin/orders/:id/status | Admin | Update order status |

### Database Schema

Create `src/modules/order/model.js`:
```javascript
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      district: String,
      ward: String,
      notes: String,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'banking'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: '__v', // Enable optimistic locking
  }
);

// Indexes for performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
```

**Why snapshot product data:**
- Store `name` and `price` in order (not just reference)
- Product details can change after order is placed
- Order should reflect price at time of purchase
- Enables proper historical reporting

### Order Number Generator

Create `src/utils/orderNumber.js`:
```javascript
export const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  return `ORD${year}${month}${day}${random}`;
};
```

Example output: `ORD2501271234` (2025-01-27-1234)

### Service Layer

Create `src/modules/order/service.js`:
```javascript
import Order from './model.js';
import Cart from '../cart/model.js';
import * as inventoryService from '../inventory/service.js';
import * as cartService from '../cart/service.js';
import { generateOrderNumber } from '../../utils/orderNumber.js';

// Create order from cart
export const createOrder = async (userId, orderData) => {
  // Get user's cart with populated products
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

    // Deduct inventory (with rollback on failure)
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
      name: item.product.name, // Snapshot
      price: item.product.price, // Snapshot
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

// Update order status (admin only)
export const updateOrderStatus = async (orderId, newStatus, adminId, note = '') => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    error.code = 'RES_001';
    throw error;
  }

  // Add to status history
  order.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy: adminId,
    note,
  });

  order.status = newStatus;

  await order.save();

  return order;
};
```

**Transaction flow:**
1. Validate cart has items
2. Check each product is available
3. Deduct inventory (with rollback if any fails)
4. Snapshot product details
5. Calculate totals
6. Create order
7. Clear cart

**Test Order Creation:**
```bash
TOKEN="user-access-token"

curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "fullName": "John Doe",
      "phone": "1234567890",
      "address": "123 Main St",
      "city": "New York",
      "district": "Manhattan",
      "ward": "Downtown"
    },
    "paymentMethod": "cod",
    "shippingFee": 5.00
  }'
```

**Order processing complete!** ✅

---

## 10. Testing Your API

### Manual Testing with cURL

**1. Register & Login:**
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "Pass1234",
    "name": "Jane Customer",
    "phone": "1234567890"
  }'

# Save the accessToken from response
TOKEN="paste-access-token-here"
```

**2. Create Product (Admin):**
```bash
# First create an admin user using make-admin.js
node make-admin.js

# Login as admin
ADMIN_TOKEN="paste-admin-token-here"

# Create product
curl -X POST http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse",
    "price": 29.99,
    "category": "Electronics",
    "status": "active"
  }'

# Save the product ID from response
PRODUCT_ID="paste-product-id-here"
```

**3. Create Inventory:**
```bash
curl -X POST http://localhost:3000/api/admin/inventory \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product": "'$PRODUCT_ID'",
    "quantity": 100,
    "lowStockThreshold": 10,
    "warehouse": "Main Warehouse"
  }'
```

**4. Browse & Add to Cart (Customer):**
```bash
# List products
curl http://localhost:3000/api/products

# Add to cart
curl -X POST http://localhost:3000/api/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "'$PRODUCT_ID'",
    "quantity": 2
  }'

# View cart
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/cart
```

**5. Create Order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "fullName": "Jane Customer",
      "phone": "1234567890",
      "address": "456 Oak Ave",
      "city": "Boston",
      "district": "Downtown",
      "ward": "Central"
    },
    "paymentMethod": "cod",
    "shippingFee": 5.00
  }'
```

**6. View Orders:**
```bash
# Customer view their orders
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/orders

# Admin view all orders
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3000/api/admin/orders
```

### Testing with Postman

1. Import endpoints as a collection
2. Set up environment variables for tokens
3. Create test suites for each module
4. Use pre-request scripts to chain requests

### Automated Testing (Optional)

Create `tests/auth.test.js` using Jest or Mocha:
```javascript
import request from 'supertest';
import app from '../src/app.js';

describe('Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Pass1234',
        name: 'Test User',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should reject invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test2@example.com',
        password: '123', // Too short
        name: 'Test User',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
```

---

## 11. Best Practices & Next Steps

### Code Quality

**1. Error Handling**
- Always use try/catch or asyncHandler
- Return meaningful error messages
- Use error codes for frontend handling
- Never expose sensitive information in errors

**2. Validation**
- Validate all inputs (body, query, params)
- Use Joi schemas for consistency
- Sanitize user input
- Validate at both API and database level

**3. Security**
- Never commit secrets to git
- Use environment variables
- Enable helmet for security headers
- Implement rate limiting (express-rate-limit)
- Sanitize inputs to prevent injection attacks
- Use HTTPS in production

**4. Performance**
- Use database indexes
- Implement pagination
- Use `lean()` for read-only queries
- Cache frequently accessed data
- Use `select()` to limit returned fields

**5. Maintainability**
- Follow consistent naming conventions
- Keep functions small and focused
- Document complex logic
- Use meaningful variable names
- Follow the module pattern consistently

### Production Checklist

**Environment:**
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure production database
- [ ] Set up proper CORS origins
- [ ] Enable compression middleware

**Security:**
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Set up HTTPS
- [ ] Configure helmet properly
- [ ] Implement refresh token rotation

**Monitoring:**
- [ ] Set up error logging (Winston, Sentry)
- [ ] Add performance monitoring
- [ ] Configure health check endpoints
- [ ] Set up uptime monitoring

**Database:**
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Add database indexes
- [ ] Plan for scaling (sharding/replication)

### Next Features to Add

**1. File Uploads**
- Use `multer` for file handling
- Store images on S3 or Cloudinary
- Implement image resizing

**2. Email Notifications**
- Use `nodemailer` or SendGrid
- Order confirmations
- Password reset emails

**3. Advanced Features**
- Product reviews and ratings
- Wishlist functionality
- Coupon/discount codes
- Advanced search with filters
- Order tracking
- Payment gateway integration (Stripe, PayPal)

**4. Admin Dashboard Features**
- Sales analytics
- Revenue reports
- Inventory alerts
- Customer management
- Bulk operations

**5. API Enhancements**
- GraphQL API
- Webhooks
- API versioning (/api/v1, /api/v2)
- Real-time updates with WebSockets

### Deployment Options

**1. Traditional Hosting:**
- VPS (DigitalOcean, Linode)
- Install Node.js and MongoDB
- Use PM2 for process management
- Nginx as reverse proxy

**2. Platform as a Service:**
- Heroku (easy deployment)
- Railway
- Render
- Use MongoDB Atlas for database

**3. Containerization:**
- Docker containers
- Docker Compose for local development
- Kubernetes for orchestration

**4. Serverless:**
- AWS Lambda + API Gateway
- Vercel/Netlify (for API routes)

### Learning Resources

**Node.js & Express:**
- Express.js official docs
- Node.js best practices guide
- RESTful API design principles

**MongoDB & Mongoose:**
- MongoDB University (free courses)
- Mongoose documentation
- Database design patterns

**Security:**
- OWASP Top 10
- Node.js security checklist
- JWT best practices

**Architecture:**
- Clean Architecture principles
- Microservices patterns
- Domain-Driven Design

---

## Conclusion

Congratulations! 🎉 You've built a complete e-commerce backend with:

✅ **Authentication** - JWT-based with refresh tokens
✅ **Products** - CRUD operations with search
✅ **Inventory** - Stock management with optimistic locking
✅ **Cart** - Shopping cart with stock validation
✅ **Orders** - Complete order processing flow

### Key Takeaways

1. **Layered Architecture** - Routes → Controllers → Services → Models
2. **Separation of Concerns** - Each layer has a clear responsibility
3. **Module Pattern** - Features are self-contained and scalable
4. **Error Handling** - Centralized, consistent, and user-friendly
5. **Validation** - Declarative with Joi, enforced everywhere
6. **Security** - Password hashing, JWT, CORS, Helmet
7. **Data Integrity** - Optimistic locking, transactions, snapshots

### What Makes This Production-Ready

- Consistent error handling
- Input validation on all endpoints
- Authentication and authorization
- Optimistic locking for concurrency
- Soft deletes for data safety
- Pagination for performance
- Stock management with reservations
- Order history tracking
- Standardized API responses
- Proper indexes for performance

### Next Steps

1. Add the features you need most
2. Write tests for critical paths
3. Set up CI/CD pipeline
4. Deploy to production
5. Monitor and iterate

**Happy coding!** 🚀

---

*This tutorial is based on the reference implementation in `server/`. For questions or improvements, refer to the actual codebase or consult the documentation.*
