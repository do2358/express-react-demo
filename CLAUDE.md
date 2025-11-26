# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack e-commerce platform with three separate applications:
- **Backend** (`server/`): Express.js REST API with MongoDB
- **Customer UI** (`ui/`): React customer-facing storefront
- **Admin UI** (`ui-admin/`): React admin dashboard

## Development Commands

### Starting All Services (3 terminals required)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev  # Runs on http://localhost:3000
```

**Terminal 2 - Customer UI:**
```bash
cd ui
npm run dev  # Runs on http://localhost:5174
```

**Terminal 3 - Admin UI:**
```bash
cd ui-admin
npm run dev  # Runs on http://localhost:5173
```

### Backend Commands

```bash
cd server
npm run dev     # Development with nodemon
npm start       # Production
npm run lint    # ESLint
npm run format  # Prettier
node make-admin.js  # Create admin user interactively
```

### Frontend Commands (same for both ui/ and ui-admin/)

```bash
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
npm run lint    # ESLint
```

## Environment Configuration

### Backend (server/.env)
Copy `.env.example` to `.env` and configure:
- `MONGODB_URI`: MongoDB connection string (Atlas or local)
- `JWT_SECRET` and `JWT_REFRESH_SECRET`: Change in production
- `CORS_ORIGIN`: Frontend URLs (comma-separated)
- `PORT`: Default 3000

### Frontends (ui/.env and ui-admin/.env)
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000/api)

## Architecture Patterns

### Backend Module Structure

Each feature module follows this pattern:
```
server/src/modules/<feature>/
├── index.js        # Express router with route definitions
├── controller.js   # Route handlers (business logic entry points)
├── service.js      # Business logic and data operations
├── validation.js   # Joi validation schemas
└── model.js        # Mongoose models (if applicable)
```

Modules: `auth`, `user`, `product`, `inventory`, `cart`, `order`

**Key Architectural Patterns:**
- **Separation of concerns**: Routes → Controllers → Services → Models
- **Express Router**: Each module exports an Express router mounted in app.js
- **Centralized error handling**: Use `asyncHandler` middleware wrapper
- **Request validation**: Joi schemas validated via `validate` middleware
- **Authentication**: JWT-based with `auth` and `adminAuth` middlewares

### Frontend Architecture (Both UIs)

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers (AuthContext, CartContext)
├── hooks/          # Custom React hooks
├── pages/          # Page-level components (route components)
├── services/       # API client modules (axios instances)
├── utils/          # Utility functions
├── App.jsx         # Main app with routing
└── main.jsx        # React entry point
```

**Key Patterns:**
- **Context for global state**: AuthContext (user/token), CartContext (cart items)
- **Service layer**: Each domain has a service (authService, productService, etc.)
- **Protected routes**: ProtectedRoute component wraps authenticated pages
- **API interceptors**: Axios interceptors handle auth tokens and 401 errors
- **Customer UI**: Uses Tailwind CSS for styling
- **Admin UI**: Uses Ant Design component library

## Authentication Flow

1. **Login**: POST `/api/auth/login` returns JWT tokens
2. **Token storage**: Stored in localStorage (accessed via AuthContext)
3. **API requests**: Tokens sent via Authorization header (interceptors)
4. **Protected routes**: Frontend guards + backend middleware verification
5. **Admin access**: Backend checks `role === 'admin'` for admin routes
6. **Auto-logout**: 401 responses trigger logout and redirect

## Database Schema Overview

- **User**: email, password (bcrypt), name, role (customer/admin), phone, addresses
- **Product**: name, description, price, category, status (draft/active/inactive), images
- **Inventory**: product reference, quantity, lowStockThreshold, warehouse
- **Cart**: user reference, items array (product, quantity, price)
- **Order**: user reference, items, shippingAddress, paymentMethod, status, totalAmount

## API Routes Structure

### Public Routes
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - User/admin login

### Customer Routes (require authentication)
- `GET /api/products` - Browse products
- `GET /api/products/:id` - Product details
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `POST /api/orders` - Create order
- `GET /api/orders` - User's orders

### Admin Routes (require admin role)
- All routes under `/api/admin/*`
- Products: CRUD operations
- Inventory: CRUD operations
- Orders: View all, update status

## Testing Workflow

1. **Setup**: Create admin user with `node make-admin.js` from server directory
2. **Admin testing**: Follow `ui-admin/QUICKSTART.md` to create products/inventory
3. **Customer testing**: Follow `TESTING_GUIDE.md` for end-to-end scenarios
4. **Test scripts**: Backend has `test-api.sh` and `test-all-endpoints.sh` for API testing

## Common Development Tasks

### Adding a new API endpoint
1. Create/update route in `server/src/modules/<module>/index.js`
2. Add controller method in `controller.js`
3. Implement business logic in `service.js`
4. Add validation schema in `validation.js`
5. Test with curl or frontend integration

### Adding a new UI page
1. Create page component in `src/pages/`
2. Add route in `App.jsx`
3. Create service methods in `src/services/` for API calls
4. Use AuthContext/CartContext for global state
5. Add navigation links in Header/Sidebar components

### Modifying database schemas
1. Update model in `server/src/modules/<module>/model.js`
2. Update validation schemas in `validation.js`
3. Update service layer to handle new fields
4. Consider migration needs for existing data

## Code Style

- **Backend**: ES modules (`"type": "module"`), async/await, Joi validation
- **Frontend**: Functional components, hooks, JSX, async/await
- **Formatting**: Use ESLint and Prettier (configured in both projects)
- **Naming**: camelCase for JS/JSX, PascalCase for components

## Common Issues

- **CORS errors**: Verify `CORS_ORIGIN` in server/.env matches frontend URLs
- **401 on admin routes**: User must have `role: 'admin'` in database
- **Failed to fetch**: Ensure backend is running and `VITE_API_URL` is correct
- **Token expiry**: Tokens expire (15min default), use refresh or re-login
- **Port conflicts**: Backend on 3000, Admin on 5173, Customer on 5174
- **Tailwind not working**: Project uses Tailwind CSS v3 with traditional PostCSS setup. Use `@tailwind base/components/utilities` directives, not v4 `@import` syntax
