# Frontend System Overview

## System Purpose

This project includes two React-based single-page applications (SPAs):

1. **Customer UI**: Public-facing e-commerce storefront for browsing products, managing cart, and placing orders
2. **Admin UI**: Management dashboard for administrators to control products, inventory, and orders

Both applications communicate with the same Express.js backend via RESTful APIs.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       USERS                                     │
│  ┌──────────────────┐              ┌──────────────────────┐     │
│  │   Customers      │              │   Administrators     │     │
│  └────────┬─────────┘              └──────────┬───────────┘     │
└───────────┼────────────────────────────────────┼─────────────────┘
            │                                    │
            ▼                                    ▼
┌──────────────────────┐           ┌──────────────────────────┐
│    Customer UI       │           │       Admin UI           │
│  (React + Tailwind)  │           │  (React + Ant Design)    │
│  Port: 5174          │           │  Port: 5173              │
├──────────────────────┤           ├──────────────────────────┤
│ • Browse Products    │           │ • Manage Products (CRUD) │
│ • Search & Filter    │           │ • Track Inventory        │
│ • Shopping Cart      │           │ • Process Orders         │
│ • Checkout           │           │ • View Dashboard Stats   │
│ • Order History      │           │ • Update Order Status    │
└──────────┬───────────┘           └──────────┬───────────────┘
           │                                   │
           └───────────────┬───────────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   Express.js Backend │
                │   REST API           │
                │   Port: 3000         │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │      MongoDB         │
                │      Database        │
                └──────────────────────┘
```

## Technology Comparison

| Aspect | Customer UI | Admin UI | Why Different? |
|--------|-------------|----------|----------------|
| **Port** | 5174 | 5173 | Separate development servers |
| **Styling** | Tailwind CSS | Ant Design | Different UX needs |
| **Components** | Custom + simple | Ant Design library | Admin needs rich components |
| **State** | Auth + Cart | Auth only | Customers manage cart state |
| **Focus** | User experience | Data management | Different primary goals |
| **Forms** | Simple inputs | Complex forms with validation | Different complexity needs |
| **Layout** | Header + Footer | Sidebar + Dashboard | Different navigation patterns |

## Customer UI Deep Dive

### Purpose & Users

**Target Users**: General public, shoppers
**Primary Goals**:
- Browse and search products
- Add items to shopping cart
- Complete checkout process
- Track order status

### Key Features

#### 1. Product Browsing
- **Grid layout**: Responsive product cards
- **Search**: Text search across product names/descriptions
- **Filtering**: By category, price range, availability
- **Pagination**: Navigate through product pages
- **Product details**: Dedicated page for each product

#### 2. Shopping Cart
- **Add to cart**: From product detail page
- **Update quantity**: Increase/decrease item quantities
- **Remove items**: Delete unwanted items
- **Real-time total**: Calculate cart total dynamically
- **Persistent cart**: Cart syncs with backend (logged-in users)
- **Stock validation**: Prevent adding more than available stock

#### 3. Checkout Process
- **Shipping address**: Form for delivery address
- **Payment method**: Select payment option (COD, Card)
- **Order summary**: Review items and total before placing order
- **Order confirmation**: Success message with order number

#### 4. Order Management
- **Order history**: List all user orders
- **Order details**: View items, status, shipping address
- **Status tracking**: See order progression (pending � shipped � delivered)

### Customer User Flows

#### Flow 1: Guest Browsing � Registration � Purchase

```
1. User visits homepage (no login required)
2. Browses products on /products page
3. Views product details at /products/:id
4. Clicks "Add to Cart" � Redirected to /login
5. Clicks "Register" � Fills registration form
6. After registration � Redirected to /products
7. Adds products to cart
8. Navigates to /cart
9. Reviews cart items
10. Proceeds to /checkout
11. Fills shipping address and payment method
12. Places order
13. Views confirmation and order number
14. Can check order status at /orders
```

#### Flow 2: Returning Customer Purchase

```
1. User visits /login
2. Logs in with credentials
3. Backend returns JWT token + user data
4. Token stored in localStorage
5. Axios interceptor adds token to all API requests
6. User browses /products
7. Adds items to cart (API: POST /api/cart/add)
8. Cart count updates in header (CartContext)
9. Navigates to /cart
10. Updates quantities or removes items
11. Proceeds to /checkout
12. Fills shipping information
13. Submits order (API: POST /api/orders)
14. Cart cleared automatically
15. Redirected to /orders to view new order
```

#### Flow 3: Product Search & Filter

```
1. User on /products page
2. Types search term in search box
3. Products filtered in real-time
4. User selects category filter
5. Products re-fetched with category parameter
6. User navigates to page 2 of results
7. New products loaded with pagination
```

### Component Hierarchy (Customer UI)

```
App
 AuthProvider
    CartProvider
        Header (always visible)
           Logo (Link to /)
           Navigation Links
           Cart Badge (shows item count)
           User Menu (login/logout)
       
        Routes
           HomePage
           LoginPage
           RegisterPage
           ProductsPage
              ProductCard (repeated)
           ProductDetailPage
              Product Info
              Add to Cart Button
           ProtectedRoute
              CartPage
                 CartItem (repeated)
              CheckoutPage
                 Shipping Form
              OrdersPage
                  OrderCard (repeated)
       
        Footer (always visible)
            Copyright
            Links
```

## Admin UI Deep Dive

### Purpose & Users

**Target Users**: System administrators, store managers
**Primary Goals**:
- Manage product catalog
- Track inventory levels
- Process customer orders
- Monitor business metrics

### Key Features

#### 1. Dashboard
- **Statistics cards**: Total products, low stock items, pending orders
- **Quick actions**: Links to common tasks
- **Recent activity**: Latest orders or inventory changes

#### 2. Product Management (CRUD)
- **List view**: Table with all products
- **Create**: Modal form to add new product
- **Edit**: Modal form to update product details
- **Delete**: Soft delete with confirmation
- **Search**: Filter products by name or category
- **Status control**: Draft, Active, Inactive

#### 3. Inventory Management
- **Stock levels**: View quantity, reserved, available
- **Low stock alerts**: Highlight items below threshold
- **Update stock**: Adjust quantity with reason
- **Stock history**: Track all inventory changes
- **Warehouse**: Assign products to warehouses

#### 4. Order Management
- **All orders view**: Table with filtering by status
- **Order details**: View items, customer info, totals
- **Status updates**: Change order status with notes
- **Status history**: See all status changes
- **Customer info**: View customer details and address

### Admin User Flows

#### Flow 1: Admin Login & Dashboard Access

```
1. Admin visits /login
2. Enters admin credentials
3. AuthContext verifies role === 'admin'
4. If not admin � Error: "Admin access required"
5. If admin � Token stored, redirected to /
6. Dashboard page shows statistics
7. Sidebar navigation available
```

#### Flow 2: Create Product & Set Inventory

```
1. Admin navigates to /products
2. Clicks "Add Product" button
3. Modal opens with form
4. Fills product details (name, price, category, etc.)
5. Clicks "Submit"
6. API: POST /api/admin/products
7. Product created with status 'draft'
8. Modal closes, table refreshes
9. Admin navigates to /inventory
10. Clicks "Set Stock" for new product
11. Enters quantity and warehouse
12. API: POST /api/admin/inventory
13. Stock record created
14. Product now available for customers
```

#### Flow 3: Process Customer Order

```
1. Customer places order (status: 'pending')
2. Admin navigates to /orders
3. Sees new order in table (status: pending)
4. Clicks order to view details
5. Reviews items, customer info, address
6. Changes status to 'confirmed'
7. API: PUT /api/admin/orders/:id/status
8. Backend deducts reserved stock from inventory
9. Status history updated
10. Admin changes status to 'processing'
11. Later changes to 'shipped'
12. Finally changes to 'delivered'
13. Customer sees status updates in customer UI
```

#### Flow 4: Manage Low Stock

```
1. Admin on /inventory page
2. Table shows 'Low Stock' tag for items below threshold
3. Clicks "Update Stock" button
4. Modal opens with current stock info
5. Enters new quantity and reason
6. API uses optimistic locking to prevent conflicts
7. If concurrent update detected � Retry or fail
8. Stock updated successfully
9. History entry added with reason
10. Low stock tag removed if above threshold
```

### Component Hierarchy (Admin UI)

```
App
 AuthProvider
    LoginPage (public route)
   
    ProtectedRoute (requires admin role)
        AdminLayout
            Sider (collapsible sidebar)
               Logo
               Menu
                   Dashboard
                   Products
                   Inventory
                   Orders
           
            Header
               Page Title
           
            Content (Outlet for routes)
                DashboardPage
                   StatisticCard (repeated)
                   RecentOrders Table
               
                ProductsPage
                   Add Button
                   Products Table
                   Product Modal (create/edit)
               
                InventoryPage
                   Inventory Table
                   Update Stock Modal
               
                OrdersPage
                    Orders Table
                    Order Details Modal
```

## State Management Strategy

### AuthContext (Both UIs)

**Purpose**: Global authentication state

**State**:
```javascript
{
  user: { id, email, name, role },
  isAuthenticated: boolean,
  loading: boolean
}
```

**Methods**:
- `login(email, password)`: Authenticate user
- `logout()`: Clear auth state
- `register(userData)`: Create new account (customer UI only)

**Storage**: `localStorage` for persistence across page reloads

**Auto-logout**: Axios interceptor detects 401 responses and triggers logout

### CartContext (Customer UI Only)

**Purpose**: Global shopping cart state

**State**:
```javascript
{
  cart: {
    items: [
      { product, quantity, price }
    ]
  },
  cartItemCount: number,
  cartTotal: number,
  loading: boolean
}
```

**Methods**:
- `addToCart(productId, quantity)`: Add item
- `updateCartItem(productId, quantity)`: Change quantity
- `removeFromCart(productId)`: Remove item
- `fetchCart()`: Sync with backend
- `clearCart()`: Empty cart (after order)

**Sync**: Cart syncs with backend on login and after each modification

## API Communication Patterns

### Axios Instance Configuration

**Base configuration**:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

### Request Interceptor Pattern

**Automatic token injection**:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Benefits**:
- No manual token handling in components
- Centralized auth header management
- Tokens automatically included in all requests

### Response Interceptor Pattern

**Automatic error handling**:
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Benefits**:
- Global 401 handling
- Automatic logout on token expiry
- Consistent error propagation

### Service Layer Pattern

**Structure**:
```javascript
// services/productService.js
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
```

**Benefits**:
- Clean separation from components
- Reusable API calls
- Easy to mock for testing
- Single source of truth for endpoints

## Styling Philosophies

### Customer UI: Tailwind CSS (Utility-First)

**Philosophy**: Compose styles from utility classes

**Example**:
```jsx
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Add to Cart
</button>
```

**Benefits**:
- **Fast development**: No CSS files to manage
- **Consistency**: Design tokens built-in
- **Responsive**: Mobile-first utilities
- **Performance**: Purges unused CSS

**Responsive Design**:
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {/* 1 column on mobile, 3 on tablet, 4 on desktop */}
</div>
```

### Admin UI: Ant Design (Component Library)

**Philosophy**: Use pre-built, enterprise-grade components

**Example**:
```jsx
<Table
  dataSource={products}
  columns={columns}
  rowKey="_id"
  pagination={{ pageSize: 10 }}
  loading={loading}
/>
```

**Benefits**:
- **Rich components**: Tables, forms, modals, etc.
- **Consistent design**: Professional admin UI
- **Built-in features**: Sorting, filtering, pagination
- **Accessibility**: WCAG compliant
- **Internationalization**: Multi-language support

**Component Composition**:
```jsx
<Modal title="Edit Product" open={visible} onOk={handleSave}>
  <Form form={form} layout="vertical">
    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
  </Form>
</Modal>
```

## Security Patterns

### 1. Protected Routes

**Pattern**: Redirect unauthenticated users

```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/cart" element={<CartPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
</Route>
```

**Implementation**:
```jsx
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
```

### 2. Admin Role Verification

**Pattern**: Verify role on login (Admin UI)

```javascript
const login = async (email, password) => {
  const response = await authService.login(email, password);

  if (response.data.user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  // Store token and user
};
```

### 3. Token Management

**Storage**: `localStorage` (alternative: `sessionStorage`, cookies)

**Auto-logout**: 401 response triggers logout

**Token refresh**: Implement refresh token flow (recommended)

### 4. Input Sanitization

**Forms**: Validate on client before sending to server

```jsx
const handleSubmit = (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert('All fields required');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  login(email, password);
};
```

## Performance Optimizations

### 1. Pagination

**Pattern**: Load data in pages

```javascript
const [page, setPage] = useState(1);
const [limit] = useState(12);

const fetchProducts = async () => {
  const response = await productService.getProducts({ page, limit });
  setProducts(response.data.data.products);
};
```

**Benefits**:
- Reduce initial load time
- Lower bandwidth usage
- Better user experience

### 2. Lazy Loading (Recommended)

**Pattern**: Load components on demand

```jsx
import { lazy, Suspense } from 'react';

const ProductsPage = lazy(() => import('./pages/ProductsPage'));

<Suspense fallback={<div>Loading...</div>}>
  <Route path="/products" element={<ProductsPage />} />
</Suspense>
```

### 3. Memoization (Recommended)

**Pattern**: Cache expensive computations

```jsx
import { useMemo } from 'react';

function CartPage() {
  const { cart } = useContext(CartContext);

  const cartTotal = useMemo(() => {
    return cart?.items?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  return <div>Total: ${cartTotal}</div>;
}
```

### 4. Image Optimization

**Pattern**: Use optimized image formats and lazy loading

```jsx
<img
  src={product.image}
  alt={product.name}
  loading="lazy"
  className="w-full h-48 object-cover"
/>
```

## User Experience Patterns

### 1. Loading States

**Pattern**: Show feedback during async operations

```jsx
{loading ? (
  <div className="text-center py-8">Loading products...</div>
) : (
  <ProductGrid products={products} />
)}
```

### 2. Error Handling

**Pattern**: Display user-friendly error messages

```jsx
try {
  await addToCart(productId, quantity);
  message.success('Added to cart');
} catch (error) {
  message.error(error.response?.data?.message || 'Failed to add to cart');
}
```

### 3. Form Validation

**Pattern**: Validate before submission

```jsx
<Form.Item
  name="email"
  label="Email"
  rules={[
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email format' }
  ]}
>
  <Input />
</Form.Item>
```

### 4. Confirmation Dialogs

**Pattern**: Confirm destructive actions

```jsx
<Popconfirm
  title="Are you sure you want to delete this product?"
  onConfirm={() => handleDelete(product._id)}
>
  <Button danger>Delete</Button>
</Popconfirm>
```

## Common Workflows Summary

### Customer Journey
```
Visit � Browse � Search/Filter � View Details �
Login/Register � Add to Cart � Review Cart �
Checkout � Place Order � Track Order Status
```

### Admin Workflow
```
Login (admin check) � Dashboard � Manage Products (CRUD) �
Set Inventory � Process Orders � Update Status � Monitor Metrics
```

## Development Workflow

### Local Development

**Customer UI**:
```bash
cd ui
npm install
npm run dev  # http://localhost:5174
```

**Admin UI**:
```bash
cd ui-admin
npm install
npm run dev  # http://localhost:5173
```

**Both UIs connect to backend**:
```bash
cd server
npm install
npm run dev  # http://localhost:3000
```

### Environment Setup

**Both UIs** (`.env`):
```bash
VITE_API_URL=http://localhost:3000/api
```

**Production**:
```bash
VITE_API_URL=https://api.yourdomain.com/api
```

### Build Process

```bash
# Build for production
npm run build

# Output: dist/ folder with optimized assets
```

### Deployment

**Static hosting options**:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

**Configuration**:
- Set `VITE_API_URL` to production API URL
- Configure redirects for client-side routing
- Enable HTTPS
- Set CORS on backend to allow frontend domain

## Key Differences: Customer vs Admin

| Feature | Customer UI | Admin UI |
|---------|-------------|----------|
| **Navigation** | Header links | Sidebar menu |
| **Auth** | Optional for browsing | Required for all pages |
| **Data Operations** | Read-only + cart | Full CRUD |
| **Forms** | Simple (login, checkout) | Complex with validation |
| **Tables** | Product grids | Data tables with actions |
| **Modals** | Rare | Frequent (create/edit) |
| **Focus** | User journey | Data management |
| **Complexity** | Lower | Higher |

## Integration with Backend

### API Endpoints Used

**Customer UI**:
- `POST /api/auth/register` - Registration
- `POST /api/auth/login` - Login
- `GET /api/products` - Browse products
- `GET /api/products/:id` - Product details
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove/:id` - Remove item
- `POST /api/orders` - Create order
- `GET /api/orders` - User's orders

**Admin UI**:
- `POST /api/auth/login` - Admin login (role check)
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/inventory` - List inventory
- `POST /api/admin/inventory` - Create inventory
- `PUT /api/admin/inventory/:id` - Update stock
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id/status` - Update order status

### Response Handling

**Success**:
```javascript
{
  success: true,
  message: "Products retrieved successfully",
  data: { products: [...], pagination: {...} }
}
```

**Error**:
```javascript
{
  success: false,
  message: "Product not found",
  errorCode: "PRODUCT_NOT_FOUND"
}
```

**Frontend extracts data**:
```javascript
const response = await productService.getProducts();
const products = response.data.data.products;
```

## Best Practices Applied

1. **Component reusability**: Shared components (ProtectedRoute, ProductCard)
2. **State management**: Context API for global state
3. **Code organization**: Consistent folder structure
4. **Error handling**: Try-catch with user feedback
5. **Loading states**: Feedback during async operations
6. **Responsive design**: Mobile-first approach
7. **Security**: Protected routes, token management
8. **Performance**: Pagination, lazy loading recommendations

## Learning Path

To understand these frontends:

1. **Start with Customer UI**: Simpler, fewer components
2. **Understand Context API**: Study AuthContext and CartContext
3. **Follow a user flow**: Trace browse � cart � checkout � order
4. **Explore Admin UI**: Study CRUD patterns with Ant Design
5. **Compare patterns**: See how both UIs solve similar problems differently
6. **Build your own**: Use tutorials to recreate from scratch

## Next Steps

To extend these UIs:

**Customer UI**:
- Product reviews and ratings
- Wishlist functionality
- Advanced filtering (price range, multi-category)
- Social login (Google, Facebook)
- Order tracking with timeline
- Recommended products

**Admin UI**:
- Dashboard charts and analytics
- Bulk product operations
- Export data to CSV/Excel
- Customer management
- Discount and promotion management
- Sales reports and analytics

**See also**:
- `frontend-structure.md` - Detailed architecture and patterns
- `ui/REBUILD_UI.md` - Customer UI step-by-step tutorial
- `ui-admin/REBUILD_UI_ADMIN.md` - Admin UI step-by-step tutorial
