### MongoDB Atlas Setup - Quick Reference

## Connection String Format:
```
mongodb+srv://<username>:<password>@<cluster>.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
```

Replace:
- `<username>`: Your database user (e.g., `ecommerce_user`)
- `<password>`: Your database password
- `<cluster>`: Your cluster name
- `<database>`: Database name (e.g., `ecommerce`)

## Example .env Configuration:
```env
MONGODB_URI=mongodb+srv://ecommerce_user:YourPassword123@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-also-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

## After Setting Up:

1. Update server/.env with your MONGODB_URI
2. Run: `cd server && npm run dev`
3. Test endpoints with curl or Thunder Client

## Test Endpoints (in order):

### 1. Health Check
```bash
curl http://localhost:3000
```

### 2. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "1234567890"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Create Admin User (MongoDB Compass or direct DB access)
```javascript
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

Once you have the MongoDB connection string, paste it here and I'll help you test the API!
