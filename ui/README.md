# Customer UI - E-Commerce Store

Customer-facing e-commerce website for browsing and purchasing products.

## Features

- **Home Page**: Hero section and featured products
- **Product Catalog**: Browse all products with search and filters
- **Product Details**: View detailed product information
- **Shopping Cart**: Manage cart items
- **Checkout**: Complete orders with shipping details
- **Order History**: View past orders and status

## Tech Stack

- React 19
- Vite
- Tailwind CSS
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

The store will be available at `http://localhost:5174`

## Features

### 🏠 Home Page
- Eye-catching hero section
- Featured products showcase
- Key features highlights

### 🛍️ Products
- Grid view with product cards
- Search functionality
- Category filtering
- Product detail pages

### 🛒 Shopping Cart
- Add/remove items
- Update quantities
- Real-time total calculation
- Proceed to checkout

### 📦 Orders
- View order history
- Track order status
- View order details

### 🔐 Authentication
- User registration
- Login/logout
- Protected routes

## Folder Structure

```
src/
├── components/       # Reusable components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── MainLayout.jsx
│   └── ProtectedRoute.jsx
├── contexts/         # React contexts
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── pages/            # Page components
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   └── OrdersPage.jsx
├── services/         # API services
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── cartService.js
│   └── orderService.js
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The customer UI connects to these endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Browse products
- `GET /api/products/:id` - Product details
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## Design

Built with Tailwind CSS for:
- Responsive design
- Modern UI components
- Smooth animations
- Beautiful gradients
- Consistent styling

## Security

- JWT-based authentication
- Protected routes
- Automatic token refresh
- Logout on 401 errors
