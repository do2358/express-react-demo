# 🧪 Complete Testing Guide - E-Commerce Platform

## 📋 Overview

This guide will walk you through testing both the **Admin UI** and **Customer UI** with the backend.

---

## 🚀 Starting All Services

You need 3 terminals running:

### Terminal 1: Backend Server
```bash
cd server
npm run dev
```
**Status**: ✅ Already running on port 3000

### Terminal 2: Admin UI
```bash
cd ui-admin
npm run dev
```
**Expected**: Opens on http://localhost:5173

### Terminal 3: Customer UI
```bash
cd ui
npm run dev
```
**Expected**: Opens on http://localhost:5174

---

## 🔧 One-Time Setup

### Create an Admin User

From the `server` directory:
```bash
node make-admin.js
```

Enter:
- **Email**: admin@example.com
- **Password**: Admin123!
- **Name**: Admin User

---

## 🎯 Test Plan

---

## PART 1: Admin UI Testing (http://localhost:5173)

### Test 1.1: Admin Login ✅
1. Open http://localhost:5173
2. You should be redirected to `/login`
3. Enter admin credentials:
   - Email: admin@example.com
   - Password: Admin123!
4. Click "Login"
5. **Expected**: Redirect to dashboard

**✅ Pass if**: You see the dashboard with sidebar

---

### Test 1.2: Admin Dashboard ✅
1. Check the dashboard displays:
   - 4 statistics cards (Products, Low Stock, Orders, Revenue)
   - Recent orders table (may be empty)
2. **Expected**: Dashboard loads without errors

**✅ Pass if**: Dashboard shows statistics (even if zeros)

---

### Test 1.3: Create Products ✅
1. Click "Products" in sidebar
2. Click "Add Product" button
3. Fill in the form:
   - **Name**: Laptop Pro 15
   - **Description**: High-performance laptop for professionals
   - **Price**: 1299.99
   - **Category**: Electronics
   - **Status**: Active
4. Click "OK"
5. **Expected**: Product appears in the table

**Repeat** to create 3-5 products with different categories:
- Electronics: Laptop, Phone, Headphones
- Clothing: T-Shirt, Jeans
- Books: Novel, Cookbook

**✅ Pass if**: All products created successfully

---

### Test 1.4: Edit Product ✅
1. Find a product in the list
2. Click "Edit" button
3. Change the price or description
4. Click "OK"
5. **Expected**: Product updated in table

**✅ Pass if**: Changes are saved and visible

---

### Test 1.5: Create Inventory ✅
1. Click "Inventory" in sidebar
2. Click "Add Inventory"
3. Select a product from dropdown
4. Enter:
   - **Quantity**: 100
   - **Low Stock Threshold**: 10
   - **Warehouse**: Main Warehouse
5. Click "OK"
6. **Expected**: Inventory record created

**Repeat** for all products

**✅ Pass if**: Inventory shows for each product

---

### Test 1.6: Low Stock Alert ✅
1. Edit an inventory record
2. Change quantity to 5 (below threshold of 10)
3. Save
4. **Expected**: Red "Low Stock" badge appears
5. Go back to Dashboard
6. **Expected**: Low Stock Items count increases

**✅ Pass if**: Low stock indicators work

---

### Test 1.7: View Orders (Empty State) ✅
1. Click "Orders" in sidebar
2. **Expected**: Empty table (no orders yet)

**✅ Pass if**: Page loads without errors

---

## PART 2: Customer UI Testing (http://localhost:5174)

### Test 2.1: Home Page ✅
1. Open http://localhost:5174
2. **Expected**: 
   - Hero section with "Welcome to ShopHub"
   - Featured products grid
   - Features section at bottom
3. Products should show (the ones you created)

**✅ Pass if**: Home page loads with products

---

### Test 2.2: Browse Products ✅
1. Click "Products" in header OR "Shop Now" button
2. **Expected**: 
   - All products displayed in grid
   - Search bar at top
   - Category filter buttons
3. Try searching for a product name
4. Try filtering by category

**✅ Pass if**: Search and filters work

---

### Test 2.3: View Product Detail ✅
1. Click on any product card
2. **Expected**:
   - Large product image
   - Full description
   - Price display
   - Quantity selector
   - "Add to Cart" button

**✅ Pass if**: Product details load correctly

---

### Test 2.4: Register Customer Account ✅
1. Click "Sign Up" in header
2. Fill registration form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: Password123!
   - **Confirm Password**: Password123!
3. Click "Sign Up"
4. **Expected**: Redirect to home page, logged in

**✅ Pass if**: Registration successful, user logged in

---

### Test 2.5: Add to Cart ✅
1. Go to Products page
2. Click "Add to Cart" on a product
3. **Expected**: Alert "Product added to cart!"
4. Look at header - cart icon should show badge with "1"
5. Add 2-3 more products

**✅ Pass if**: Cart badge updates with item count

---

### Test 2.6: View Cart ✅
1. Click cart icon in header
2. **Expected**:
   - List of items you added
   - Quantity controls (+/- buttons)
   - Remove button (trash icon)
   - Order summary with total
3. Try updating quantity
4. Try removing an item

**✅ Pass if**: Cart operations work correctly

---

### Test 2.7: Checkout Flow ✅
1. From cart, click "Proceed to Checkout"
2. Fill shipping form:
   - **Full Name**: John Doe
   - **Phone**: +1234567890
   - **Address**: 123 Main Street
   - **Ward**: Ward 1
   - **District**: District 1
   - **City**: New York
3. Select payment method (COD or Banking)
4. Review order summary on right
5. Click "Place Order"
6. **Expected**: 
   - Alert "Order placed successfully!"
   - Redirect to Orders page

**✅ Pass if**: Order created successfully

---

### Test 2.8: View Orders ✅
1. Click "My Orders" in header
2. **Expected**: Your order appears with:
   - Order number
   - Status badge (PENDING)
   - Total amount
   - "View Details" button

**✅ Pass if**: Order visible in list

---

### Test 2.9: Customer Logout ✅
1. Click "Logout" button
2. **Expected**: Redirect to home page
3. Cart icon should disappear from header

**✅ Pass if**: Logout works, UI updates

---

## PART 3: Admin Order Management

### Test 3.1: View Customer Order (Admin) ✅
1. Go back to Admin UI (http://localhost:5173)
2. Click "Orders" in sidebar
3. **Expected**: Customer's order appears
4. Click "View" button
5. **Expected**: Drawer opens with full order details

**✅ Pass if**: Admin can see customer order

---

### Test 3.2: Update Order Status ✅
1. In the order drawer, find status dropdown
2. Change from "pending" to "confirmed"
3. **Expected**: Status updates immediately
4. Try changing to "processing", then "shipped", then "delivered"

**✅ Pass if**: Status changes save successfully

---

### Test 3.3: Verify Customer Sees Updated Status ✅
1. Go to Customer UI (http://localhost:5174)
2. Login as john@example.com if needed
3. Go to "My Orders"
4. **Expected**: Order status reflects admin's change

**✅ Pass if**: Status sync works

---

## 📊 Test Results Summary

### Admin UI Tests
- [ ] 1.1 Admin Login
- [ ] 1.2 Dashboard View
- [ ] 1.3 Create Products
- [ ] 1.4 Edit Product
- [ ] 1.5 Create Inventory
- [ ] 1.6 Low Stock Alert
- [ ] 1.7 View Orders

### Customer UI Tests
- [ ] 2.1 Home Page
- [ ] 2.2 Browse Products
- [ ] 2.3 Product Detail
- [ ] 2.4 Register Account
- [ ] 2.5 Add to Cart
- [ ] 2.6 View Cart
- [ ] 2.7 Checkout
- [ ] 2.8 View Orders
- [ ] 2.9 Logout

### Integration Tests
- [ ] 3.1 Admin View Customer Order
- [ ] 3.2 Update Order Status
- [ ] 3.3 Customer See Status Update

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch"
**Solution**: Make sure backend is running on port 3000

### Issue: "Access denied" on admin login
**Solution**: Create admin user with `node make-admin.js`

### Issue: "Please login to add items to cart"
**Solution**: Register/login to customer account first

### Issue: Cart shows 0 items after adding
**Solution**: Make sure you're logged in and backend is running

### Issue: Products not showing
**Solution**: Create products in Admin UI first

### Issue: Can't place order
**Solution**: 
1. Make sure you have items in cart
2. Make sure inventory exists for products
3. Check backend console for errors

---

## ✅ Success Criteria

Your platform is working correctly if:

1. **Admin can**:
   - ✅ Login to admin panel
   - ✅ Create/edit/delete products
   - ✅ Manage inventory with low stock alerts
   - ✅ View all orders
   - ✅ Update order status

2. **Customer can**:
   - ✅ Browse and search products
   - ✅ View product details
   - ✅ Add items to cart
   - ✅ Complete checkout
   - ✅ View order history

3. **Integration works**:
   - ✅ Orders flow from customer to admin
   - ✅ Status updates sync between UIs
   - ✅ Inventory decreases when orders placed
   - ✅ Auth tokens work correctly

---

## 🎉 Next Steps After Testing

Once all tests pass:

1. **Document any bugs** you find
2. **Take screenshots** of the UIs for your portfolio
3. **Create vercel.json** for deployment
4. **Deploy to Vercel** and go live!

---

## 📝 Notes

- Backend: http://localhost:3000/api
- Admin UI: http://localhost:5173
- Customer UI: http://localhost:5174

**Happy Testing! 🚀**
