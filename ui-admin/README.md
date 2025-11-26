# Admin UI - E-Commerce Admin Panel

Admin dashboard for managing the e-commerce platform.

## Features

- **Dashboard**: Overview statistics and recent orders
- **Products Management**: CRUD operations for products
- **Inventory Management**: Stock control and low stock alerts
- **Orders Management**: View and update order status

## Tech Stack

- React 19
- Vite
- Ant Design
- React Router DOM
- Axios

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the API URL in `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

### 3. Run Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173`

### 4. Login

Use an admin account to login. You can create an admin user using the backend's `make-admin.js` script.

## Admin Credentials Setup

From the server directory:

```bash
cd ../server
node make-admin.js
```

Follow the prompts to create an admin account.

## Folder Structure

```
src/
├── components/       # Reusable components
│   ├── AdminLayout.jsx
│   └── ProtectedRoute.jsx
├── contexts/         # React contexts
│   └── AuthContext.jsx
├── pages/            # Page components
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProductsPage.jsx
│   ├── InventoryPage.jsx
│   └── OrdersPage.jsx
├── services/         # API services
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── inventoryService.js
│   └── orderService.js
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Details

### Dashboard
- Total products count
- Low stock items alert
- Pending orders count
- Total revenue calculation
- Recent orders table

### Products
- View all products
- Create new products
- Edit existing products
- Delete products
- Set product status (draft, active, inactive)

### Inventory
- View stock levels
- Low stock warnings
- Create inventory records
- Update quantities
- Set low stock thresholds

### Orders
- View all orders
- Filter by status
- Update order status
- View detailed order information
- Track order history

## API Integration

The admin panel integrates with the backend API at `/api/admin/*` endpoints. All requests include JWT authentication tokens.

## Security

- JWT-based authentication
- Admin role verification
- Protected routes
- Automatic token refresh
- Logout on 401 errors

## Notes

- Only users with `role: 'admin'` can access this panel
- All API requests require authentication
- Tokens are stored in localStorage
