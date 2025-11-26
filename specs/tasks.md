# 📋 Task Breakdown Document

## E-Commerce Web Application

**Version:** 1.0  
**Last Updated:** November 26, 2025  
**Total Estimated Time:** 18-24 working days

---

## 🎯 Current Project Status (As of Nov 26, 2025)

### ✅ Completed Phases
- **Phase 1: Project Setup & Architecture** - 100% Complete
  - Modular backend structure implemented
  - Both frontend apps scaffolded (UI & UI-Admin)
  - All documentation files created
  
- **Phase 2: Backend Development** - ~95% Complete
  - ✅ All models (User, Product, Inventory, Cart, Order)
  - ✅ All middlewares (auth, role, validation, error handler, async wrapper)
  - ✅ All validators (Joi schemas for all modules)
  - ✅ All services & controllers for all modules
  - ✅ All routes configured (modular architecture)
  - ✅ Express app fully configured
  - ✅ Serverless entry point (api/index.js)
  - 🔄 Minor: Some utility functions pending (slug generator, order number generator)
  
- **Phase 5: Documentation** - 100% Complete
  - ✅ All 6 documentation files created and populated

### ✅ Nearly Complete!
- **Phase 3: Customer UI (Frontend)** - ~90% Complete ✨ MAJOR UPDATE
  - ✅ Project structure and contexts setup
  - ✅ All API services (auth, products, cart, orders)
  - ✅ Auth & Cart contexts
  - ✅ Header with cart badge
  - ✅ Footer component
  - ✅ ProductCard component
  - ✅ Main layout & protected routes
  - ✅ Login & Register pages
  - ✅ Home page with hero & featured products
  - ✅ Products page with search & filters
  - ✅ Product detail page
  - ✅ Shopping cart page
  - ✅ Checkout page with full form
  - ✅ Order history page
  - 🔄 Minor polish and testing needed
  
- **Phase 4: Admin UI (Frontend)** - ~90% Complete ✨
  - ✅ All dependencies installed (Ant Design, React Router, Axios)
  - ✅ API services (auth, product, inventory, order)
  - ✅ Auth context with admin role checking
  - ✅ Protected routes
  - ✅ Admin layout with sidebar & header
  - ✅ Login page
  - ✅ Dashboard page with statistics
  - ✅ Products page (full CRUD)
  - ✅ Inventory page (full CRUD with stock alerts)
  - ✅ Orders page (view & status updates)
  - 🔄 Minor polish and testing needed

### ⬜ Not Started
- **Phase 6: Deployment** - 0% Complete
  - ⬜ vercel.json configuration needed
  - ⬜ Production deployment not done yet

### 🎯 Next Priorities
1. **Test Customer UI & Admin UI** (Phases 3 & 4 - Final testing)
2. **Create vercel.json** (Phase 6)
3. **Deploy to Vercel** (Phase 6)

---

## Task Legend

| Priority | Symbol | Description |
|----------|--------|-------------|
| Critical | 🔴 | Blocks other tasks, must do first |
| High | 🟠 | Core functionality |
| Medium | 🟡 | Important features |
| Low | 🟢 | Nice to have, can defer |

| Status | Symbol |
|--------|--------|
| Not Started | ⬜ |
| In Progress | 🔄 |
| Completed | ✅ |
| Blocked | 🚫 |

---

## Phase 1: Project Setup & Architecture

**Duration:** 2-3 days  
**Dependencies:** None

### 1.1 Project Initialization

| Task ID | Task | Priority | Est. Time | Status | Notes |
|---------|------|----------|-----------|--------|-------|
| 1.1.1 | Create project root folder | 🔴 | 5m | ✅ | `mkdir project && cd project` |
| 1.1.2 | Create folder structure | 🔴 | 5m | ✅ | server, ui, ui-admin, docs, specs |
| 1.1.3 | Initialize Git repository | 🟠 | 10m | ✅ | git init, .gitignore |
| 1.1.4 | Create .gitignore | 🟠 | 10m | ✅ | node_modules, .env, dist |

### 1.2 Setup Server (Backend)

| Task ID | Task | Priority | Est. Time | Status | Notes |
|---------|------|----------|-----------|--------|-------|
| 1.2.1 | Initialize package.json | 🔴 | 5m | ✅ | ES6 modules enabled |
| 1.2.2 | Install core dependencies | 🔴 | 10m | ✅ | express, mongoose, cors, dotenv |
| 1.2.3 | Install auth dependencies | 🔴 | 5m | ✅ | jsonwebtoken, bcryptjs |
| 1.2.4 | Install dev dependencies | 🟡 | 5m | ✅ | nodemon, eslint, prettier |
| 1.2.5 | Create Modular folder structure | 🔴 | 15m | ✅ | modules/, middlewares/, utils/, config/ |
| 1.2.6 | Setup ESLint config | 🟡 | 10m | ✅ | .eslintrc.js |
| 1.2.7 | Setup Prettier config | 🟡 | 5m | ✅ | .prettierrc |
| 1.2.8 | Create .env.example | 🟠 | 10m | ✅ | All env vars documented |

### 1.3 Setup UI (Customer Frontend)

| Task ID | Task | Priority | Est. Time | Status | Notes |
|---------|------|----------|-----------|--------|-------|
| 1.3.1 | Create React app | 🔴 | 5m | ✅ | Vite |
| 1.3.2 | Install routing | 🔴 | 5m | 🔄 | react-router-dom (needs routes) |
| 1.3.3 | Install HTTP client | 🔴 | 5m | 🔄 | axios (api.js exists) |
| 1.3.4 | Install UI framework | 🟠 | 10m | ✅ | Tailwind CSS |
| 1.3.5 | Setup folder structure | 🟠 | 15m | ✅ | pages, components, hooks, contexts, services |
| 1.3.6 | Setup path aliases | 🟡 | 10m | ⬜ | @/ prefix |

### 1.4 Setup UI-Admin (Admin Frontend)

| Task ID | Task | Priority | Est. Time | Status | Notes |
|---------|------|----------|-----------|--------|-------|
| 1.4.1 | Create React app | 🔴 | 5m | ✅ | Vite |
| 1.4.2 | Install routing | 🔴 | 5m | ⬜ | react-router-dom |
| 1.4.3 | Install HTTP client | 🔴 | 5m | ⬜ | axios |
| 1.4.4 | Install UI framework | 🟠 | 10m | ⬜ | Ant Design |
| 1.4.5 | Setup folder structure | 🟠 | 15m | ✅ | pages, components, hooks, contexts, services |
| 1.4.6 | Setup path aliases | 🟡 | 10m | ⬜ | @/ prefix |

### 1.5 Setup Documentation

| Task ID | Task | Priority | Est. Time | Status | Notes |
|---------|------|----------|-----------|--------|-------|
| 1.5.1 | Create docs folder | 🟡 | 2m | ✅ | docs/ created |
| 1.5.2 | Create markdown file templates | 🟡 | 15m | ✅ | 6 files created |

---

## Phase 2: Backend Development

**Duration:** 5-7 days  
**Dependencies:** Phase 1.2 completed

### 2.1 Database Setup

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 2.1.1 | Setup MongoDB Atlas account | 🔴 | 15m | ✅ | - |
| 2.1.2 | Create database cluster | 🔴 | 10m | ✅ | 2.1.1 |
| 2.1.3 | Create database connection config | 🔴 | 20m | ✅ | 2.1.2 |
| 2.1.4 | Test database connection | 🔴 | 10m | ✅ | 2.1.3 |

### 2.2 Models (Mongoose Schemas)

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 2.2.1 | Create User model | 🔴 | 30m | ✅ | 2.1.4 |
| 2.2.2 | Create Product model | 🔴 | 30m | ✅ | 2.1.4 |
| 2.2.3 | Create Inventory model | 🔴 | 25m | ✅ | 2.2.2 |
| 2.2.4 | Create Cart model | 🟠 | 25m | ✅ | 2.2.1, 2.2.2 |
| 2.2.5 | Create Order model | 🟠 | 40m | ✅ | 2.2.1, 2.2.2 |
| 2.2.6 | Add model indexes | 🟡 | 20m | ✅ | All models |
| 2.2.7 | Create models index file | 🟡 | 10m | 🔄 | All models in modules |

### 2.3 Middlewares

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 2.3.1 | Create auth middleware (JWT verify) | 🔴 | 45m | ✅ | 2.2.1 |
| 2.3.2 | Create role middleware | 🔴 | 30m | ✅ | 2.3.1 |
| 2.3.3 | Create validation middleware | 🟠 | 30m | ✅ | - |
| 2.3.4 | Create error handler middleware | 🟠 | 45m | ✅ | - |
| 2.3.5 | Create async handler wrapper | 🟡 | 15m | ✅ | - |
| 2.3.6 | Create rate limiter middleware | 🟡 | 20m | ⬜ | - |

### 2.4 Validators

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 2.4.1 | Install Joi | 🟠 | 5m | ✅ | - |
| 2.4.2 | Create auth validators | 🟠 | 30m | ✅ | 2.4.1 |
| 2.4.3 | Create product validators | 🟠 | 25m | ✅ | 2.4.1 |
| 2.4.4 | Create inventory validators | 🟠 | 20m | ✅ | 2.4.1 |
| 2.4.5 | Create order validators | 🟠 | 25m | ✅ | 2.4.1 |
| 2.4.6 | Create cart validators | 🟠 | 15m | ✅ | 2.4.1 |

### 2.5 Services (Business Logic)

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 2.5.1 | Create auth service | 🔴 | 1.5h | ✅ | 2.2.1, 2.3.1 |
| 2.5.2 | Create product service | 🔴 | 1.5h | ✅ | 2.2.2 |
| 2.5.3 | Create inventory service | 🔴 | 1h | ✅ | 2.2.3 |
| 2.5.4 | Create cart service | 🟠 | 1h | ✅ | 2.2.4 |
| 2.5.5 | Create order service | 🟠 | 2h | ✅ | 2.2.5, 2.5.3 |

### 2.6 Controllers

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 2.6.1 | Create auth controller | 🔴 | 1h | ✅ | 2.5.1 |
| 2.6.2 | Create product controller (public) | 🔴 | 45m | ✅ | 2.5.2 |
| 2.6.3 | Create product controller (admin) | 🔴 | 1h | ✅ | 2.5.2 |
| 2.6.4 | Create inventory controller (admin) | 🔴 | 1h | ✅ | 2.5.3 |
| 2.6.5 | Create cart controller | 🟠 | 45m | ✅ | 2.5.4 |
| 2.6.6 | Create order controller (customer) | 🟠 | 1h | ✅ | 2.5.5 |
| 2.6.7 | Create order controller (admin) | 🟠 | 45m | ✅ | 2.5.5 |

### 2.7 Routes

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 2.7.1 | Create auth routes | 🔴 | 30m | ✅ | 2.6.1 |
| 2.7.2 | Create public product routes | 🔴 | 20m | ✅ | 2.6.2 |
| 2.7.3 | Create admin product routes | 🔴 | 25m | ✅ | 2.6.3 |
| 2.7.4 | Create admin inventory routes | 🔴 | 25m | ✅ | 2.6.4 |
| 2.7.5 | Create cart routes | 🟠 | 20m | ✅ | 2.6.5 |
| 2.7.6 | Create customer order routes | 🟠 | 20m | ✅ | 2.6.6 |
| 2.7.7 | Create admin order routes | 🟠 | 20m | ✅ | 2.6.7 |
| 2.7.8 | Create routes index (combine all) | 🔴 | 20m | ✅ | Modular routes in app.js |

### 2.8 App Configuration

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 2.8.1 | Setup Express app | 🔴 | 30m | ✅ | - |
| 2.8.2 | Configure CORS | 🔴 | 15m | ✅ | 2.8.1 |
| 2.8.3 | Configure body parser | 🔴 | 10m | ✅ | 2.8.1 |
| 2.8.4 | Configure helmet | 🟡 | 10m | ✅ | 2.8.1 |
| 2.8.5 | Configure morgan (logging) | 🟡 | 10m | ✅ | 2.8.1 |
| 2.8.6 | Mount all routes | 🔴 | 20m | ✅ | 2.7.8 |
| 2.8.7 | Configure error handling | 🔴 | 15m | ✅ | 2.3.4 |
| 2.8.8 | Create server entry point | 🔴 | 15m | ✅ | 2.8.6, 2.8.7 |

### 2.9 Utilities

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 2.9.1 | Create response helper | 🟠 | 20m | ✅ | - |
| 2.9.2 | Create pagination helper | 🟠 | 25m | 🔄 | Partial implementation |
| 2.9.3 | Create slug generator | 🟡 | 15m | ⬜ | - |
| 2.9.4 | Create order number generator | 🟡 | 15m | ⬜ | - |
| 2.9.5 | Create logger utility | 🟡 | 20m | 🔄 | Using morgan |

### 2.10 Vercel Serverless Setup

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 2.10.1 | Create api/index.js entry | 🔴 | 30m | ✅ | 2.8.8 |
| 2.10.2 | Configure serverless adapter | 🔴 | 20m | ✅ | 2.10.1 |
| 2.10.3 | Test locally with vercel dev | 🟠 | 15m | 🔄 | Testing with npm run dev |

---

## Phase 3: Frontend - Customer UI

**Duration:** 4-5 days  
**Dependencies:** Phase 2 (partial - APIs ready)

### 3.1 Core Setup

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 3.1.1 | Setup React Router | 🔴 | 30m | ⬜ | 1.3.2 |
| 3.1.2 | Create route configuration | 🔴 | 20m | ⬜ | 3.1.1 |
| 3.1.3 | Setup Auth Context | 🔴 | 45m | ⬜ | 1.3.3 |
| 3.1.4 | Setup Cart Context | 🟠 | 30m | ⬜ | 3.1.3 |
| 3.1.5 | Create Axios instance | 🔴 | 30m | ⬜ | 3.1.3 |
| 3.1.6 | Create API service modules | 🔴 | 1h | ⬜ | 3.1.5 |
| 3.1.7 | Setup Tailwind config | 🟠 | 20m | ⬜ | 1.3.4 |

### 3.2 Layout Components

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 3.2.1 | Create Header component | 🔴 | 1h | ⬜ | 3.1.7 |
| 3.2.2 | Create Footer component | 🟠 | 30m | ⬜ | 3.1.7 |
| 3.2.3 | Create MainLayout | 🔴 | 20m | ⬜ | 3.2.1, 3.2.2 |
| 3.2.4 | Create ProtectedRoute | 🔴 | 30m | ⬜ | 3.1.3 |

### 3.3 Shared Components

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 3.3.1 | Create Button component | 🟠 | 20m | ⬜ | 3.1.7 |
| 3.3.2 | Create Input component | 🟠 | 25m | ⬜ | 3.1.7 |
| 3.3.3 | Create ProductCard | 🔴 | 45m | ⬜ | 3.1.7 |
| 3.3.4 | Create CartItem | 🟠 | 30m | ⬜ | 3.1.7 |
| 3.3.5 | Create LoadingSpinner | 🟠 | 15m | ⬜ | 3.1.7 |
| 3.3.6 | Create ErrorMessage | 🟠 | 15m | ⬜ | 3.1.7 |
| 3.3.7 | Create Pagination | 🟡 | 30m | ⬜ | 3.1.7 |
| 3.3.8 | Create Modal | 🟡 | 30m | ⬜ | 3.1.7 |
| 3.3.9 | Create Toast/Notification | 🟡 | 30m | ⬜ | 3.1.7 |
| 3.3.10 | Create SearchBar | 🟡 | 25m | ⬜ | 3.1.7 |

### 3.4 Authentication Pages

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 3.4.1 | Create LoginPage | 🔴 | 1h | ⬜ | 3.1.6, 3.3.1, 3.3.2 |
| 3.4.2 | Create RegisterPage | 🔴 | 1h | ⬜ | 3.1.6, 3.3.1, 3.3.2 |
| 3.4.3 | Create login form validation | 🟠 | 20m | ⬜ | 3.4.1 |
| 3.4.4 | Create register form validation | 🟠 | 20m | ⬜ | 3.4.2 |

### 3.5 Product Pages

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 3.5.1 | Create HomePage | 🔴 | 1.5h | ⬜ | 3.3.3, 3.1.6 |
| 3.5.2 | Create ProductListPage | 🔴 | 2h | ⬜ | 3.3.3, 3.3.7 |
| 3.5.3 | Create ProductDetailPage | 🔴 | 1.5h | ⬜ | 3.1.6 |
| 3.5.4 | Create category filter | 🟠 | 30m | ⬜ | 3.5.2 |
| 3.5.5 | Create price filter | 🟡 | 30m | ⬜ | 3.5.2 |
| 3.5.6 | Create sort dropdown | 🟡 | 20m | ⬜ | 3.5.2 |

### 3.6 Cart Pages

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 3.6.1 | Create CartPage | 🔴 | 1.5h | ⬜ | 3.3.4, 3.1.4 |
| 3.6.2 | Create CartSummary component | 🟠 | 30m | ⬜ | 3.6.1 |
| 3.6.3 | Implement quantity update | 🟠 | 30m | ⬜ | 3.6.1 |
| 3.6.4 | Implement remove item | 🟠 | 20m | ⬜ | 3.6.1 |

### 3.7 Checkout & Order Pages

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 3.7.1 | Create CheckoutPage | 🔴 | 2h | ⬜ | 3.6.1 |
| 3.7.2 | Create AddressForm component | 🟠 | 45m | ⬜ | 3.7.1 |
| 3.7.3 | Create OrderSummary component | 🟠 | 30m | ⬜ | 3.7.1 |
| 3.7.4 | Create OrderHistoryPage | 🟠 | 1.5h | ⬜ | 3.1.6 |
| 3.7.5 | Create OrderDetailPage | 🟠 | 1h | ⬜ | 3.1.6 |
| 3.7.6 | Create OrderStatusBadge | 🟡 | 20m | ⬜ | 3.7.4 |

### 3.8 Profile Pages

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 3.8.1 | Create ProfilePage | 🟡 | 1h | ⬜ | 3.1.6 |
| 3.8.2 | Create EditProfileForm | 🟡 | 45m | ⬜ | 3.8.1 |
| 3.8.3 | Create ChangePasswordForm | 🟡 | 30m | ⬜ | 3.8.1 |

### 3.9 Integration & Polish

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 3.9.1 | Integrate all routes | 🔴 | 30m | ⬜ | All pages |
| 3.9.2 | Add error boundaries | 🟠 | 30m | ⬜ | 3.9.1 |
| 3.9.3 | Add loading states | 🟠 | 30m | ⬜ | 3.9.1 |
| 3.9.4 | Add toast notifications | 🟡 | 30m | ⬜ | 3.3.9 |
| 3.9.5 | Responsive design check | 🟠 | 1h | ⬜ | 3.9.1 |
| 3.9.6 | Build optimization | 🟡 | 30m | ⬜ | 3.9.1 |

---

## Phase 4: Frontend - Admin UI

**Duration:** 4-5 days  
**Dependencies:** Phase 2 (partial - APIs ready)

### 4.1 Core Setup

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 4.1.1 | Setup React Router | 🔴 | 30m | ⬜ | 1.4.2 |
| 4.1.2 | Create route configuration | 🔴 | 20m | ⬜ | 4.1.1 |
| 4.1.3 | Setup Admin Auth Context | 🔴 | 45m | ⬜ | 1.4.3 |
| 4.1.4 | Create Axios instance | 🔴 | 30m | ⬜ | 4.1.3 |
| 4.1.5 | Create Admin API services | 🔴 | 1h | ⬜ | 4.1.4 |
| 4.1.6 | Configure Ant Design theme | 🟠 | 20m | ⬜ | 1.4.4 |

### 4.2 Layout Components

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 4.2.1 | Create AdminLayout | 🔴 | 1.5h | ⬜ | 4.1.6 |
| 4.2.2 | Create Sidebar | 🔴 | 1h | ⬜ | 4.1.6 |
| 4.2.3 | Create AdminHeader | 🟠 | 45m | ⬜ | 4.1.6 |
| 4.2.4 | Create AdminProtectedRoute | 🔴 | 30m | ⬜ | 4.1.3 |
| 4.2.5 | Create Breadcrumb | 🟡 | 20m | ⬜ | 4.1.6 |

### 4.3 Shared Components

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 4.3.1 | Create DataTable component | 🔴 | 1.5h | ⬜ | 4.1.6 |
| 4.3.2 | Create FormModal | 🟠 | 45m | ⬜ | 4.1.6 |
| 4.3.3 | Create ConfirmDialog | 🟠 | 30m | ⬜ | 4.1.6 |
| 4.3.4 | Create StatCard | 🟠 | 25m | ⬜ | 4.1.6 |
| 4.3.5 | Create StatusBadge | 🟡 | 20m | ⬜ | 4.1.6 |
| 4.3.6 | Create ImageUploader | 🟠 | 1h | ⬜ | 4.1.6 |
| 4.3.7 | Create SearchFilter | 🟡 | 30m | ⬜ | 4.1.6 |

### 4.4 Authentication

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 4.4.1 | Create AdminLoginPage | 🔴 | 1h | ⬜ | 4.1.6 |
| 4.4.2 | Implement admin login flow | 🔴 | 30m | ⬜ | 4.4.1, 4.1.5 |

### 4.5 Dashboard

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 4.5.1 | Create DashboardPage | 🟠 | 2h | ⬜ | 4.3.4 |
| 4.5.2 | Add order stats | 🟡 | 30m | ⬜ | 4.5.1 |
| 4.5.3 | Add product stats | 🟡 | 30m | ⬜ | 4.5.1 |
| 4.5.4 | Add recent orders table | 🟡 | 45m | ⬜ | 4.5.1 |
| 4.5.5 | Add low stock alerts | 🟡 | 30m | ⬜ | 4.5.1 |

### 4.6 Product Management

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 4.6.1 | Create ProductListPage | 🔴 | 1.5h | ⬜ | 4.3.1 |
| 4.6.2 | Create ProductFormPage | 🔴 | 2h | ⬜ | 4.3.6 |
| 4.6.3 | Implement product search/filter | 🟠 | 30m | ⬜ | 4.6.1 |
| 4.6.4 | Implement create product | 🔴 | 45m | ⬜ | 4.6.2, 4.1.5 |
| 4.6.5 | Implement edit product | 🔴 | 45m | ⬜ | 4.6.2, 4.1.5 |
| 4.6.6 | Implement delete product | 🟠 | 30m | ⬜ | 4.3.3, 4.1.5 |
| 4.6.7 | Implement image upload | 🟠 | 45m | ⬜ | 4.3.6 |

### 4.7 Inventory Management

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 4.7.1 | Create InventoryListPage | 🔴 | 1.5h | ⬜ | 4.3.1 |
| 4.7.2 | Create InventoryFormPage | 🔴 | 1.5h | ⬜ | 4.1.6 |
| 4.7.3 | Implement inventory search/filter | 🟠 | 30m | ⬜ | 4.7.1 |
| 4.7.4 | Implement create inventory | 🔴 | 30m | ⬜ | 4.7.2, 4.1.5 |
| 4.7.5 | Implement edit inventory | 🔴 | 30m | ⬜ | 4.7.2, 4.1.5 |
| 4.7.6 | Implement delete inventory | 🟠 | 20m | ⬜ | 4.3.3, 4.1.5 |
| 4.7.7 | Add low stock indicator | 🟡 | 20m | ⬜ | 4.7.1 |
| 4.7.8 | Implement stock adjustment | 🟠 | 45m | ⬜ | 4.1.5 |

### 4.8 Order Management

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 4.8.1 | Create OrderListPage | 🔴 | 1.5h | ⬜ | 4.3.1 |
| 4.8.2 | Create OrderDetailPage | 🔴 | 1.5h | ⬜ | 4.1.5 |
| 4.8.3 | Implement order filters | 🟠 | 30m | ⬜ | 4.8.1 |
| 4.8.4 | Implement status update | 🔴 | 45m | ⬜ | 4.8.2, 4.1.5 |
| 4.8.5 | Add order timeline | 🟡 | 45m | ⬜ | 4.8.2 |

### 4.9 Integration & Polish

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 4.9.1 | Integrate all routes | 🔴 | 30m | ⬜ | All pages |
| 4.9.2 | Add error handling | 🟠 | 30m | ⬜ | 4.9.1 |
| 4.9.3 | Add loading states | 🟠 | 30m | ⬜ | 4.9.1 |
| 4.9.4 | Add success/error notifications | 🟡 | 30m | ⬜ | 4.9.1 |
| 4.9.5 | Build optimization | 🟡 | 30m | ⬜ | 4.9.1 |

---

## Phase 5: Documentation

**Duration:** 2 days  
**Dependencies:** Phase 2, 3, 4 completed

### 5.1 Backend Documentation

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 5.1.1 | Write backend-structure.md | 🟠 | 1.5h | ✅ | Phase 2 |
| 5.1.2 | Write backend-overview.md | 🟠 | 2h | ✅ | Phase 2 |
| 5.1.3 | Document all API endpoints | 🟠 | 2h | ✅ | Phase 2 |
| 5.1.4 | Document authentication flow | 🟠 | 1h | ✅ | Phase 2 |
| 5.1.5 | Document database schema | 🟡 | 1h | ✅ | Phase 2 |
| 5.1.6 | Document error codes | 🟡 | 30m | ✅ | Phase 2 |

### 5.2 Frontend Documentation

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 5.2.1 | Write frontend-structure.md | 🟠 | 1.5h | ✅ | Phase 3, 4 |
| 5.2.2 | Write frontend-overview.md | 🟠 | 2h | ✅ | Phase 3, 4 |
| 5.2.3 | Document component hierarchy | 🟡 | 1h | ✅ | Phase 3, 4 |
| 5.2.4 | Document state management | 🟡 | 1h | ✅ | Phase 3, 4 |
| 5.2.5 | Document routing structure | 🟡 | 30m | ✅ | Phase 3, 4 |

### 5.3 Deployment Documentation

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 5.3.1 | Write deployment-guide.md | 🔴 | 2h | ✅ | Phase 6 |
| 5.3.2 | Document Vercel setup | 🔴 | 1h | ✅ | Phase 6 |
| 5.3.3 | Document environment variables | 🔴 | 30m | ✅ | Phase 6 |
| 5.3.4 | Document MongoDB Atlas setup | 🟡 | 30m | ✅ | 2.1 |
| 5.3.5 | Write troubleshooting guide | 🟡 | 1h | ✅ | Phase 6 |

### 5.4 Interview Documentation

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 5.4.1 | Write interviews.md | 🟡 | 3h | ✅ | All phases |
| 5.4.2 | Add architecture Q&A | 🟡 | 45m | ✅ | 5.4.1 |
| 5.4.3 | Add code samples | 🟡 | 1h | ✅ | 5.4.1 |
| 5.4.4 | Add design decision explanations | 🟡 | 1h | ✅ | 5.4.1 |

---

## Phase 6: Deployment

**Duration:** 1-2 days  
**Dependencies:** Phase 2, 3, 4 completed

### 6.1 Vercel Configuration

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 6.1.1 | Create vercel.json | 🔴 | 30m | ⬜ | - |
| 6.1.2 | Configure API routes | 🔴 | 30m | ⬜ | 6.1.1 |
| 6.1.3 | Configure UI routes | 🔴 | 20m | ⬜ | 6.1.1 |
| 6.1.4 | Configure UI-Admin routes | 🔴 | 20m | ⬜ | 6.1.1 |

### 6.2 Environment Setup

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 6.2.1 | Setup MongoDB Atlas production | 🔴 | 20m | ⬜ | 2.1.1 |
| 6.2.2 | Configure production env vars | 🔴 | 30m | ⬜ | 6.2.1 |
| 6.2.3 | Set Vercel environment variables | 🔴 | 15m | ⬜ | 6.2.2 |

### 6.3 Deployment

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 6.3.1 | Connect Vercel to GitHub | 🔴 | 10m | ⬜ | Git setup |
| 6.3.2 | Initial deployment | 🔴 | 15m | ⬜ | 6.1, 6.2 |
| 6.3.3 | Verify API endpoints | 🔴 | 30m | ⬜ | 6.3.2 |
| 6.3.4 | Verify UI deployment | 🔴 | 20m | ⬜ | 6.3.2 |
| 6.3.5 | Verify UI-Admin deployment | 🔴 | 20m | ⬜ | 6.3.2 |
| 6.3.6 | Test CORS configuration | 🔴 | 15m | ⬜ | 6.3.3 |

### 6.4 Post-Deployment

| Task ID | Task | Priority | Est. Time | Status | Depends On |
|---------|------|----------|-----------|--------|------------|
| 6.4.1 | Create admin account | 🔴 | 10m | ⬜ | 6.3.3 |
| 6.4.2 | Add sample products | 🟡 | 30m | ⬜ | 6.4.1 |
| 6.4.3 | End-to-end testing | 🔴 | 1h | ⬜ | 6.4.2 |
| 6.4.4 | Performance check | 🟡 | 30m | ⬜ | 6.4.3 |
| 6.4.5 | Setup custom domain (optional) | 🟢 | 30m | ⬜ | 6.4.3 |

---

## Summary Statistics

### By Phase

| Phase | Total Tasks | Est. Time |
|-------|-------------|-----------|
| Phase 1: Setup | 25 | 2-3 days |
| Phase 2: Backend | 65 | 5-7 days |
| Phase 3: Customer UI | 50 | 4-5 days |
| Phase 4: Admin UI | 45 | 4-5 days |
| Phase 5: Documentation | 18 | 2 days |
| Phase 6: Deployment | 18 | 1-2 days |
| **Total** | **221** | **18-24 days** |

### By Priority

| Priority | Count |
|----------|-------|
| 🔴 Critical | ~65 |
| 🟠 High | ~85 |
| 🟡 Medium | ~55 |
| 🟢 Low | ~16 |

---

## Sprint Suggestions

### Sprint 1 (Week 1)
- Phase 1: Project Setup ✓
- Phase 2: Database, Models, Middlewares, Auth

### Sprint 2 (Week 2)
- Phase 2: Complete Services, Controllers, Routes
- Phase 3: Start Customer UI Core

### Sprint 3 (Week 3)
- Phase 3: Complete Customer UI
- Phase 4: Start Admin UI

### Sprint 4 (Week 4)
- Phase 4: Complete Admin UI
- Phase 5: Documentation
- Phase 6: Deployment

---

## Notes

1. **Parallel Work**: Phase 3 and Phase 4 can run in parallel if multiple developers
2. **API First**: Backend APIs should be completed before frontend integration
3. **Testing**: Add unit/integration tests as stretch goals
4. **MVP First**: Focus on 🔴 and 🟠 tasks first for MVP

---

*End of Task Breakdown Document*