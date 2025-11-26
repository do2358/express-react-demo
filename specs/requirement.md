# 📋 Project Requirements Document

## E-Commerce Web Application

**Version:** 1.0  
**Last Updated:** November 2024  
**Status:** Planning Phase

---

## 1. Project Overview

### 1.1 Introduction

Xây dựng một hệ thống bán hàng trực tuyến đơn giản với đầy đủ chức năng quản trị và mua sắm cho khách hàng.

### 1.2 Project Goals

- Xây dựng platform e-commerce hoàn chỉnh với Admin và Customer portal
- Implement authentication & authorization system
- CRUD operations cho Product và Inventory
- Order management system
- Deploy trên Vercel với monorepo structure

### 1.3 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Frontend Customer | ReactJS |
| Frontend Admin | ReactJS |
| Authentication | JWT (JSON Web Token) |
| Deployment | Vercel |
| Architecture | Modular |

---

## 2. System Architecture

### 2.1 Project Structure

```
project/
├── server/                 # Backend Express API
├── ui/                     # Customer Frontend (ReactJS)
├── ui-admin/               # Admin Frontend (ReactJS)
├── docs/                   # Documentation
│   ├── backend-structure.md
│   ├── frontend-structure.md
│   ├── backend-overview.md
│   ├── frontend-overview.md
│   ├── deployment-guide.md
│   └── interviews.md
├── vercel.json
└── package.json
```

### 2.2 Backend Architecture (Modular)

```
server/
├── src/
│   ├── modules/            # Feature modules
│   │   ├── user/           # Example module structure
│   │   │   ├── index.js        # Routes definition
│   │   │   ├── controller.js   # Request handlers
│   │   │   ├── model.js        # Data model
│   │   │   ├── service.js      # Business logic
│   │   │   └── validation.js   # Input validation
│   │   ├── product/
│   │   ├── order/
│   │   └── ...
│   ├── config/             # Global configuration
│   ├── middlewares/        # Shared middlewares
│   ├── utils/              # Shared utilities
│   └── app.js              # Express app entry
├── api/
│   └── index.js            # Vercel serverless entry
└── package.json
```

---

## 3. Functional Requirements

### 3.1 Authentication Module

#### FR-AUTH-001: User Registration
- **Description:** Cho phép người dùng đăng ký tài khoản mới
- **Input:** email, password, name, phone (optional)
- **Output:** User object, JWT token
- **Validation:**
  - Email phải unique và valid format
  - Password tối thiểu 8 ký tự, có chữ và số
- **Access:** Public

#### FR-AUTH-002: User Login
- **Description:** Cho phép user/admin đăng nhập
- **Input:** email, password
- **Output:** JWT access token, refresh token, user info
- **Access:** Public

#### FR-AUTH-003: Token Refresh
- **Description:** Làm mới access token
- **Input:** Refresh token
- **Output:** New access token
- **Access:** Authenticated

#### FR-AUTH-004: Logout
- **Description:** Đăng xuất, invalidate token
- **Input:** Access token
- **Output:** Success message
- **Access:** Authenticated

#### FR-AUTH-005: Get Current User
- **Description:** Lấy thông tin user hiện tại
- **Input:** Access token (header)
- **Output:** User profile
- **Access:** Authenticated

---

### 3.2 Product Module (Admin)

#### FR-PROD-001: Create Product
- **Description:** Admin tạo sản phẩm mới
- **Input:** name, description, price, images[], category, status
- **Output:** Created product object
- **Access:** Admin only

#### FR-PROD-002: List Products (Admin)
- **Description:** Lấy danh sách tất cả sản phẩm (bao gồm inactive)
- **Input:** page, limit, search, category, status (query params)
- **Output:** Paginated product list
- **Access:** Admin only

#### FR-PROD-003: Get Product Detail (Admin)
- **Description:** Xem chi tiết sản phẩm
- **Input:** productId
- **Output:** Product object with full details
- **Access:** Admin only

#### FR-PROD-004: Update Product
- **Description:** Cập nhật thông tin sản phẩm
- **Input:** productId, fields to update
- **Output:** Updated product object
- **Access:** Admin only

#### FR-PROD-005: Delete Product
- **Description:** Xóa sản phẩm (soft delete)
- **Input:** productId
- **Output:** Success message
- **Access:** Admin only

#### FR-PROD-006: Upload Product Images
- **Description:** Upload hình ảnh cho sản phẩm
- **Input:** productId, image files
- **Output:** Image URLs
- **Access:** Admin only

---

### 3.3 Inventory Module (Admin)

#### FR-INV-001: Create Inventory
- **Description:** Tạo record inventory mới
- **Input:** productId, quantity, warehouse (optional)
- **Output:** Created inventory object
- **Access:** Admin only

#### FR-INV-002: List Inventory
- **Description:** Danh sách inventory
- **Input:** page, limit, productId, lowStock (query params)
- **Output:** Paginated inventory list
- **Access:** Admin only

#### FR-INV-003: Get Inventory Detail
- **Description:** Chi tiết inventory record
- **Input:** inventoryId
- **Output:** Inventory object
- **Access:** Admin only

#### FR-INV-004: Update Inventory
- **Description:** Cập nhật inventory
- **Input:** inventoryId, quantity, warehouse
- **Output:** Updated inventory object
- **Access:** Admin only

#### FR-INV-005: Delete Inventory
- **Description:** Xóa inventory record
- **Input:** inventoryId
- **Output:** Success message
- **Access:** Admin only

#### FR-INV-006: Get Inventory by Product
- **Description:** Lấy inventory theo product
- **Input:** productId
- **Output:** Inventory object(s)
- **Access:** Admin only

#### FR-INV-007: Adjust Stock
- **Description:** Điều chỉnh số lượng tồn kho
- **Input:** productId, adjustment (+ or -), reason
- **Output:** Updated inventory
- **Access:** Admin only

---

### 3.4 Public Product Module (Customer)

#### FR-PUB-001: List Active Products
- **Description:** Danh sách sản phẩm đang bán
- **Input:** page, limit, category, minPrice, maxPrice, sort
- **Output:** Paginated active products
- **Access:** Public

#### FR-PUB-002: Get Product Detail (Public)
- **Description:** Chi tiết sản phẩm (chỉ active)
- **Input:** productId
- **Output:** Product object (public fields)
- **Access:** Public

#### FR-PUB-003: Filter by Category
- **Description:** Lọc sản phẩm theo danh mục
- **Input:** category, page, limit
- **Output:** Filtered product list
- **Access:** Public

#### FR-PUB-004: Search Products
- **Description:** Tìm kiếm sản phẩm
- **Input:** keyword, page, limit
- **Output:** Search results
- **Access:** Public

---

### 3.5 Cart Module (Customer)

#### FR-CART-001: Get Cart
- **Description:** Lấy giỏ hàng của user
- **Input:** userId (from token)
- **Output:** Cart object with items
- **Access:** Authenticated User

#### FR-CART-002: Add to Cart
- **Description:** Thêm sản phẩm vào giỏ
- **Input:** productId, quantity
- **Output:** Updated cart
- **Validation:** Check stock availability
- **Access:** Authenticated User

#### FR-CART-003: Update Cart Item
- **Description:** Cập nhật số lượng item
- **Input:** itemId, quantity
- **Output:** Updated cart
- **Validation:** Check stock availability
- **Access:** Authenticated User

#### FR-CART-004: Remove from Cart
- **Description:** Xóa item khỏi giỏ
- **Input:** itemId
- **Output:** Updated cart
- **Access:** Authenticated User

#### FR-CART-005: Clear Cart
- **Description:** Xóa toàn bộ giỏ hàng
- **Input:** userId (from token)
- **Output:** Empty cart
- **Access:** Authenticated User

---

### 3.6 Order Module

#### FR-ORD-001: Create Order (Customer)
- **Description:** Tạo đơn hàng từ giỏ
- **Input:** shippingAddress, paymentMethod, notes
- **Output:** Created order object
- **Business Logic:**
  - Validate stock availability
  - Deduct inventory
  - Clear cart after success
- **Access:** Authenticated User

#### FR-ORD-002: Get User Orders
- **Description:** Danh sách đơn hàng của user
- **Input:** page, limit, status (query)
- **Output:** Paginated orders
- **Access:** Authenticated User (own orders only)

#### FR-ORD-003: Get Order Detail (Customer)
- **Description:** Chi tiết đơn hàng
- **Input:** orderId
- **Output:** Order object with items
- **Access:** Authenticated User (own order only)

#### FR-ORD-004: Cancel Order
- **Description:** Hủy đơn hàng
- **Input:** orderId
- **Output:** Updated order (status: cancelled)
- **Business Logic:**
  - Only allow cancel if status is 'pending' or 'confirmed'
  - Restore inventory
- **Access:** Authenticated User (own order only)

#### FR-ORD-005: List All Orders (Admin)
- **Description:** Danh sách tất cả đơn hàng
- **Input:** page, limit, status, userId, dateRange
- **Output:** Paginated orders
- **Access:** Admin only

#### FR-ORD-006: Update Order Status (Admin)
- **Description:** Cập nhật trạng thái đơn
- **Input:** orderId, status
- **Output:** Updated order
- **Valid Statuses:** pending → confirmed → processing → shipped → delivered
- **Access:** Admin only

---

## 4. Database Schema

### 4.1 User Schema

```javascript
{
  _id: ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // hashed
  name: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 Product Schema

```javascript
{
  _id: ObjectId,
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  comparePrice: Number,  // original price for discount
  images: [String],      // array of image URLs
  category: { type: String, required: true },
  tags: [String],
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'draft' },
  isDeleted: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 Inventory Schema

```javascript
{
  _id: ObjectId,
  product: { type: ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 0 },
  reservedQuantity: { type: Number, default: 0 },  // reserved for pending orders
  warehouse: String,
  lowStockThreshold: { type: Number, default: 10 },
  lastRestocked: Date,
  __v: { type: Number, select: true }, // Optimistic locking version key
  createdAt: Date,
  updatedAt: Date
}
```

### 4.4 Cart Schema

```javascript
{
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1 },
    addedAt: Date
  }],
  updatedAt: Date
}
```

### 4.5 Order Schema

```javascript
{
  _id: ObjectId,
  orderNumber: { type: String, unique: true },  // auto-generated
  user: { type: ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: ObjectId, ref: 'Product' },
    name: String,           // snapshot at order time
    price: Number,          // snapshot at order time
    quantity: Number,
    subtotal: Number
  }],
  subtotal: Number,
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    district: String,
    ward: String,
    notes: String
  },
  paymentMethod: { type: String, enum: ['cod', 'banking'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedAt: Date,
    changedBy: ObjectId,
    note: String
  createdAt: Date,
  updatedAt: Date,
  __v: { type: Number, select: true } // Optimistic locking version key
}
```

---

## 5. API Endpoints Summary

### 5.1 Authentication APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | User registration | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/logout` | Logout | Auth |
| POST | `/api/auth/refresh` | Refresh token | Auth |
| GET | `/api/auth/me` | Get current user | Auth |

### 5.2 Public Product APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | List products | Public |
| GET | `/api/products/:id` | Product detail | Public |
| GET | `/api/products/category/:category` | By category | Public |
| GET | `/api/products/search` | Search | Public |

### 5.3 Cart APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Get cart | User |
| POST | `/api/cart/add` | Add item | User |
| PUT | `/api/cart/update` | Update quantity | User |
| DELETE | `/api/cart/remove/:itemId` | Remove item | User |
| DELETE | `/api/cart/clear` | Clear cart | User |

### 5.4 Order APIs (Customer)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Create order | User |
| GET | `/api/orders` | My orders | User |
| GET | `/api/orders/:id` | Order detail | User |
| PUT | `/api/orders/:id/cancel` | Cancel order | User |

### 5.5 Admin Product APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/products` | List all | Admin |
| GET | `/api/admin/products/:id` | Get one | Admin |
| POST | `/api/admin/products` | Create | Admin |
| PUT | `/api/admin/products/:id` | Update | Admin |
| DELETE | `/api/admin/products/:id` | Delete | Admin |
| POST | `/api/admin/products/upload` | Upload images | Admin |

### 5.6 Admin Inventory APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/inventory` | List all | Admin |
| GET | `/api/admin/inventory/:id` | Get one | Admin |
| GET | `/api/admin/inventory/product/:productId` | By product | Admin |
| POST | `/api/admin/inventory` | Create | Admin |
| PUT | `/api/admin/inventory/:id` | Update | Admin |
| DELETE | `/api/admin/inventory/:id` | Delete | Admin |
| PUT | `/api/admin/inventory/adjust` | Adjust stock | Admin |

### 5.7 Admin Order APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/orders` | List all | Admin |
| GET | `/api/admin/orders/:id` | Get one | Admin |
| PUT | `/api/admin/orders/:id/status` | Update status | Admin |

---

## 6. Non-Functional Requirements

### 6.1 Security

| ID | Requirement |
|----|-------------|
| NFR-SEC-001 | Password phải được hash bằng bcrypt (salt rounds >= 10) |
| NFR-SEC-002 | JWT access token expiry: 15 phút |
| NFR-SEC-003 | JWT refresh token expiry: 7 ngày |
| NFR-SEC-004 | Rate limiting: 100 requests/minute per IP |
| NFR-SEC-005 | Input validation cho tất cả endpoints |
| NFR-SEC-006 | CORS configuration cho allowed origins |
| NFR-SEC-007 | Helmet.js cho HTTP security headers |
| NFR-SEC-008 | Implement OWASP Top 10 protections (Injection, Broken Auth, etc.) |
| NFR-SEC-009 | Sanitize user input to prevent XSS and NoSQL Injection |
| NFR-SEC-010 | Use secure dependencies (audit via npm audit) |

### 6.2 Performance

| ID | Requirement |
|----|-------------|
| NFR-PERF-001 | API response time < 500ms (average) |
| NFR-PERF-002 | Support 1000 concurrent users |
| NFR-PERF-003 | Database indexing cho frequently queried fields |
| NFR-PERF-004 | Pagination cho list endpoints (default: 20 items) |

### 6.3 Reliability

| ID | Requirement |
|----|-------------|
| NFR-REL-001 | Graceful error handling |
| NFR-REL-002 | Centralized error logging |
| NFR-REL-003 | Database connection retry logic |
| NFR-REL-004 | Optimistic Locking (versioning) để xử lý race conditions trong Inventory/Order |

### 6.4 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-MNT-001 | Code follows ESLint/Prettier standards |
| NFR-MNT-002 | Modular architecture với clear separation |
| NFR-MNT-003 | Modular codebase |
| NFR-MNT-004 | API documentation (Swagger) |
| NFR-MNT-005 | Environment-based configuration |

---

## 7. User Interface Requirements

### 7.1 Customer UI (ui/)

#### Pages Required

| Page | Description | Features |
|------|-------------|----------|
| Home | Landing page | Featured products, categories, banner |
| Product List | Catalog page | Grid view, filters, sort, pagination |
| Product Detail | Single product | Images, info, add to cart |
| Cart | Shopping cart | Items list, quantity update, subtotal |
| Checkout | Order placement | Address form, payment method |
| Order History | Past orders | Order list, status |
| Order Detail | Single order | Items, status, tracking |
| Login | Authentication | Email/password form |
| Register | Registration | Registration form |
| Profile | User profile | Edit info, change password |

#### UI Components

- Header (navigation, cart icon, user menu)
- Footer (links, contact)
- ProductCard
- CartItem
- LoadingSpinner
- ErrorBoundary
- ProtectedRoute
- Pagination
- SearchBar
- CategoryFilter
- PriceFilter

### 7.2 Admin UI (ui-admin/)

#### Pages Required

| Page | Description | Features |
|------|-------------|----------|
| Login | Admin auth | Email/password |
| Dashboard | Overview | Stats cards, charts |
| Product List | Product management | Table, search, CRUD actions |
| Product Form | Create/Edit | Form with validation |
| Inventory List | Stock management | Table, low stock alerts |
| Inventory Form | Create/Edit | Form with validation |
| Order List | Order management | Table, filters, status |
| Order Detail | Single order | Items, status update |

#### UI Components

- AdminLayout (sidebar, header, content)
- Sidebar navigation
- DataTable (reusable)
- FormModal
- ConfirmDialog
- ImageUploader
- StatCard
- StatusBadge
- Breadcrumb

---

## 8. Authentication & Authorization

### 8.1 Role Definitions

| Role | Description | Permissions |
|------|-------------|-------------|
| `user` | Regular customer | View products, manage cart, place orders, view own orders |
| `admin` | Administrator | Full access to admin panel, CRUD all entities |

### 8.2 Access Control Matrix

| Resource | Public | User | Admin |
|----------|--------|------|-------|
| View products | ✅ | ✅ | ✅ |
| Manage cart | ❌ | ✅ | ❌ |
| Place orders | ❌ | ✅ | ❌ |
| View own orders | ❌ | ✅ | ❌ |
| Cancel own orders | ❌ | ✅ | ❌ |
| CRUD products | ❌ | ❌ | ✅ |
| CRUD inventory | ❌ | ❌ | ✅ |
| View all orders | ❌ | ❌ | ✅ |
| Update order status | ❌ | ❌ | ✅ |

### 8.3 JWT Token Structure

```javascript
// Access Token Payload
{
  userId: ObjectId,
  email: String,
  role: 'user' | 'admin',
  iat: Number,
  exp: Number
}

// Refresh Token Payload
{
  userId: ObjectId,
  tokenId: String,  // for revocation
  iat: Number,
  exp: Number
}
```

---

## 9. Deployment Requirements

### 9.1 Vercel Configuration

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "ui/package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "ui-admin/package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/api/index.js" },
    { "src": "/admin/(.*)", "dest": "ui-admin/$1" },
    { "src": "/(.*)", "dest": "ui/$1" }
  ]
}
```

### 9.2 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `your-refresh-secret` |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `NODE_ENV` | Environment | `production` |
| `CORS_ORIGIN` | Allowed origins | `https://your-domain.vercel.app` |

---

## 10. Documentation Requirements

| File | Content |
|------|---------|
| `backend-structure.md` | Server folder structure, modules, naming conventions |
| `frontend-structure.md` | UI & UI-Admin folder structure, components |
| `backend-overview.md` | API docs, auth flow, database schema, error codes |
| `frontend-overview.md` | Pages, routing, state management, API integration |
| `deployment-guide.md` | Vercel setup, env config, CI/CD, troubleshooting |
| `interviews.md` | Technical Q&A, code samples, architecture decisions |

---

## 11. Acceptance Criteria

### 11.1 Backend

- [ ] All CRUD operations work correctly
- [ ] Authentication flow works (register, login, logout, refresh)
- [ ] Authorization properly restricts access by role
- [ ] Input validation prevents invalid data
- [ ] Error handling returns appropriate status codes
- [ ] API documentation is complete

### 11.2 Frontend (Customer)

- [ ] User can browse products
- [ ] User can search and filter products
- [ ] User can add/update/remove cart items
- [ ] User can complete checkout
- [ ] User can view order history
- [ ] Protected routes redirect to login

### 11.3 Frontend (Admin)

- [ ] Admin can login
- [ ] Admin can CRUD products
- [ ] Admin can CRUD inventory
- [ ] Admin can view and update orders
- [ ] Dashboard shows overview stats

### 11.4 Deployment

- [ ] All 3 apps deploy successfully to Vercel
- [ ] API endpoints work in production
- [ ] CORS is properly configured
- [ ] Environment variables are set

---

## Appendix A: Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_001` | 401 | Invalid credentials |
| `AUTH_002` | 401 | Token expired |
| `AUTH_003` | 403 | Insufficient permissions |
| `VAL_001` | 400 | Validation error |
| `RES_001` | 404 | Resource not found |
| `INV_001` | 400 | Insufficient stock |
| `ORD_001` | 400 | Cannot cancel order |
| `SRV_001` | 500 | Internal server error |

---

## Appendix B: Order Status Flow

```
pending → confirmed → processing → shipped → delivered
    ↓
cancelled (only from pending/confirmed)
```

---

*End of Requirements Document*