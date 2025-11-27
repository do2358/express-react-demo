# Interview Questions for E-Commerce Project

## 1. System Architecture & Database Design
- **High-Level Overview:** Can you explain the overall architecture of the application? Why did you choose the MERN stack (MongoDB, Express, React, Node.js) for this specific use case?
- **Database Modeling:** I see you have models for `User`, `Product`, `Order`, `Cart`, and `Inventory`.
    - How are you handling the relationship between `Orders` and `Products`?
    - Did you choose to **embed** product details in the order document or just **reference** the product ID? Why did you make that choice? (Hint: Check `modules/order/model.js`)
    - Why is `Inventory` separated from `Product`? What are the pros and cons of this normalization?
- **Mongoose Features:**
    - In `modules/inventory/model.js`, you use a "Virtual" property for `availableQuantity`. Does this value get stored in the database? How does this affect querying performance if we want to sort by availability?
    - You are using `pre('save')` middleware in the `User` model for password hashing. Why is it better to do this in the model rather than the controller?

## 2. Backend Logic & Concurrency
- **Inventory Management:**
    - In `modules/inventory/service.js`, specifically the `adjustStock` function, I noticed you are using `__v` (version key) in your query. Can you explain what pattern this is and why it's critical for an e-commerce platform?
    - What happens if two users try to buy the last item at the exact same millisecond?
- **Authentication:**
    - You've implemented `access` and `refresh` tokens. Can you walk me through the security benefits of this approach compared to a single long-lived token?
    - How does the frontend know when to use the refresh token?
- **Error Handling:**
    - You use a centralized `errorHandler` middleware. How does this help maintain the codebase compared to try-catch blocks with `res.status().json()` in every controller?
    - Explain the purpose of the `asyncHandler` wrapper used in your controllers.

## 3. Frontend Architecture (React)
- **State Management:**
    - You are using React Context (`AuthContext`, `CartContext`) for state management.
    - What are the limitations of this approach? At what scale would you consider migrating to a library like Redux, Zustand, or React Query?
- **Performance:**
    - How are you handling large lists of products? I see pagination on the backend, but how is it consumed on the frontend?
    - In `CartPage.jsx`, how do you ensure that updating the quantity of one item doesn't cause unnecessary re-renders of the entire page?
- **Component Design:**
    - In `AdminLayout.jsx`, you are using nested routes with `<Outlet />`. How does this structure help with layout management and code reusability?
    - Explain how the `ProtectedRoute` component works. How does it handle the "loading" state of authentication?

## 4. Security & Best Practices
- **API Security:**
    - I see `helmet` and `cors` in `app.js`. What specific vulnerabilities do they help prevent?
    - How are you validating user input? I see `Joi` being used. Why validate on the backend if the frontend likely has form validation too?
- **Data Integrity:**
    - In the `createOrder` service, you deduct stock. What happens if the stock deduction succeeds but the order creation fails? How do you handle that inconsistency? (Hint: Check `modules/order/service.js` try-catch block).
- **Client-Side Security:**
    - You are storing JWT tokens in `localStorage` (seen in `ui/src/contexts/AuthContext.jsx`). What is the primary security risk associated with this storage method (XSS vs CSRF)? Ideally, where should tokens be stored?

## 5. Scalability & DevOps
- **Scaling:**
    - If we run a marketing campaign and traffic spikes by 100x, which part of this system do you think will bottleneck first? The Node.js server or MongoDB?
    - How would you modify the architecture to handle full-text search better than the current MongoDB `$text` search?
- **Background Jobs:**
    - Currently, emails (e.g., order confirmation) seem to be missing or synchronous (hypothetically). If you were to add email notifications, how would you implement them to ensure they don't slow down the API response? (Hint: Message Queues).

## 6. Code Quality & Testing
- **Testing Strategy:**
    - I see shell scripts (`test-all-endpoints.sh`) for testing. While useful, what are the limitations of this approach compared to a framework like Jest or Mocha?
    - How would you write a unit test for the `generateUniqueSlug` utility function?
- **Code Structure:**
    - You've organized your backend by "modules" (auth, cart, product) instead of technical layers (controllers, models, routes). Why do you prefer this structure?
    - What is the responsibility of the `service` layer versus the `controller` layer in your code?

## 7. Advanced Scenarios
- **Order Status Logic:**
    - In `modules/order/service.js`, you validate status transitions (e.g., can't go from 'delivered' to 'pending'). This is a simple State Machine. If the order flow became complex (e.g., returns, partial refunds), how would you refactor this to be more manageable?
- **Cart Persistence:**
    - Currently, the cart is stored in MongoDB. What are the trade-offs of storing the cart in a fast Key-Value store like Redis instead?

## 8. Frontend Deep Dive (UI & Admin)
- **Performance Anti-Pattern (Admin Dashboard):**
    - In `ui-admin/src/pages/DashboardPage.jsx`, I see you are calculating total revenue by fetching *all* orders (`limit: 1000`) and filtering them on the client side.
        - *Question:* Why is this bad for performance as the business grows? How would you refactor the backend to provide these stats efficiently? (Hint: MongoDB Aggregation Pipeline).
- **User Experience (Optimistic UI):**
    - When a user clicks "Add to Cart", there is currently a loading state (`await addToCart`).
        - *Question:* How would you implement "Optimistic UI" here so the interface feels instant, even before the server responds? What are the risks of that approach?
- **Component Architecture:**
    - You have `ProductCard` in the customer UI and a Table row in the Admin UI.
        - *Question:* If you wanted to share the "Product Status Badge" logic (colors for active/draft/inactive) between both apps, how would you structure your code to avoid duplication? (Hint: Shared utils or a monorepo structure).
- **Form Handling:**
    - In `RegisterPage.jsx`, you are using controlled inputs (state for every field).
        - *Question:* For a very complex form (like a multi-step checkout), would you stick with this approach or use a library like `react-hook-form`? Why?

## 9. Future Features & Roadmap ("If you had more time...")
- **Real-Time Updates:**
    - *Scenario:* Currently, the Admin has to refresh the page to see new orders.
    - *Question:* If you had more time, how would you implement real-time notifications so the admin gets a popup the moment a customer places an order? (Hint: WebSockets/Socket.io).
- **Payment Integration:**
    - *Scenario:* Right now, payments are manual (COD/Banking).
    - *Question:* If you were to integrate Stripe or PayPal, how would you handle the payment confirmation securely? specifically, why are **Webhooks** critical in that process?
- **Image Handling:**
    - *Scenario:* You are currently storing image URLs as strings.
    - *Question:* How would you implement an actual image upload feature? Would you store the binary data in MongoDB (GridFS) or use a service like AWS S3 / Cloudinary? Why?
- **Docker & Deployment:**
    - *Question:* To ensure this app runs the same way on your machine and the production server, how would you set up a `Dockerfile` and `docker-compose.yml` for this MERN stack?