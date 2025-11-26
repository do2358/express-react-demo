import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';

// Import routes
import authRoutes from './modules/auth/index.js';
import productRoutes from './modules/product/index.js';
import inventoryRoutes from './modules/inventory/index.js';
import cartRoutes from './modules/cart/index.js';
import orderRoutes from './modules/order/index.js';

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
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      admin: {
        products: '/api/admin/products',
        inventory: '/api/admin/inventory',
        orders: '/api/admin/orders',
      },
    },
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/inventory', inventoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

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

