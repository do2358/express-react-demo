# 🚀 Quick Start Guide - Admin UI Testing

## Prerequisites

Make sure the backend server is running on port 3000.

## Step 1: Create an Admin User

From the server directory:

```bash
cd server
node make-admin.js
```

Enter the following when prompted:
- **Email**: admin@example.com (or your choice)
- **Password**: Admin123! (or your choice)
- **Name**: Admin User

## Step 2: Start the Admin UI

Open a new terminal in the `ui-admin` directory:

```bash
cd ui-admin
npm run dev
```

The admin UI will start at: **http://localhost:5173**

## Step 3: Login

1. Open http://localhost:5173 in your browser
2. You'll be redirected to the login page
3. Enter the admin credentials you created
4. Click "Login"

## Step 4: Explore the Admin Panel

Once logged in, you'll see:

### 📊 Dashboard (/)
- View statistics cards:
  - Total Products
  - Low Stock Items
  - Pending Orders
  - Total Revenue
- See recent orders table

### 🛍️ Products (/admin/products)
- Click "Add Product" to create a new product
- Fill in the form:
  - Name, Description, Price
  - Category (e.g., Electronics, Clothing)
  - Status (draft/active/inactive)
- Edit or delete existing products

### 📦 Inventory (/admin/inventory)
- Click "Add Inventory" to create stock records
- Select a product from the dropdown
- Set quantity and low stock threshold
- View low stock warnings (red badge)

### 🛒 Orders (/admin/orders)
- View all orders
- Click "View" to see order details
- Update order status from the drawer:
  - pending → confirmed → processing → shipped → delivered
  - Or mark as cancelled
- See customer information and shipping address

## Common Test Scenarios

### Test 1: Create a Product
1. Go to Products page
2. Click "Add Product"
3. Fill in:
   - Name: "Laptop"
   - Price: 999.99
   - Category: "Electronics"
   - Status: "active"
4. Click OK
5. Product should appear in the table

### Test 2: Add Inventory
1. Go to Inventory page
2. Click "Add Inventory"
3. Select the product you just created
4. Set Quantity: 50
5. Set Low Stock Threshold: 10
6. Click OK
7. Inventory record should appear

### Test 3: Simulate Low Stock
1. Edit the inventory record
2. Change Quantity to 5 (below threshold)
3. Save
4. You should see a red "Low Stock" badge
5. Dashboard should show updated low stock count

## API Endpoints Being Used

The admin UI connects to these endpoints:

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/inventory` - List inventory
- `POST /api/admin/inventory` - Create inventory
- `PUT /api/admin/inventory/:id` - Update inventory
- `GET /api/admin/orders` - List orders
- `PUT /api/admin/orders/:id/status` - Update order status

## Troubleshooting

### "Access denied. Admin privileges required"
- Make sure you created the user with admin role using `make-admin.js`
- Regular users cannot access the admin panel

### "Failed to fetch..."
- Check that the backend server is running on port 3000
- Check the console for CORS errors
- Verify VITE_API_URL in `.env` is set to `http://localhost:3000/api`

### Network Error
- Make sure both servers are running:
  - Backend: `cd server && npm run dev`
  - Admin UI: `cd ui-admin && npm run dev`

### 401 Unauthorized
- Your token may have expired
- Click logout and login again

## Features to Test

- ✅ Admin login with role checking
- ✅ Dashboard statistics
- ✅ Products CRUD (Create, Read, Update, Delete)
- ✅ Inventory management with low stock alerts
- ✅ Orders viewing and status updates
- ✅ Responsive table pagination
- ✅ Modal forms with validation
- ✅ Confirmation dialogs before delete
- ✅ Auto-logout on 401 errors
- ✅ Sidebar navigation
- ✅ User menu in header

## Next Steps

After testing the admin UI:
1. Build the Customer UI (Phase 3)
2. Create vercel.json for deployment
3. Deploy to production

Enjoy managing your e-commerce store! 🎉
