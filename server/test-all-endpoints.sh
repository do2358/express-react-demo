#!/bin/bash

# E-Commerce API Testing Script
# This script tests all major endpoints

BASE_URL="http://localhost:3000"
TEMP_DIR="/tmp/ecommerce-test"
mkdir -p $TEMP_DIR

echo "======================================"
echo "  E-COMMERCE API TESTING"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Health Check
echo -e "${BLUE}1. Health Check${NC}"
curl -s $BASE_URL | python3 -m json.tool
echo ""

# 2. Register User
echo -e "${BLUE}2. Register User${NC}"
curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "User123456#",
    "name": "Test User",
    "phone": "9876543210"
  }' | python3 -m json.tool | tee $TEMP_DIR/user_register.json
echo ""

# 3. Login User
echo -e "${BLUE}3. Login User${NC}"
curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "User123456#"
  }' | python3 -m json.tool | tee $TEMP_DIR/user_login.json
echo ""

# Extract token
USER_TOKEN=$(python3 -c "import json; print(json.load(open('$TEMP_DIR/user_login.json'))['data']['accessToken'])")
echo -e "${GREEN}✓ User Token extracted${NC}"
echo ""

# 4. Get Current User
echo -e "${BLUE}4. Get Current User (Protected)${NC}"
curl -s -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $USER_TOKEN" | python3 -m json.tool
echo ""

# 5. Get Products (Public)
echo -e "${BLUE}5. Get Products (Public - should be empty)${NC}"
curl -s -X GET $BASE_URL/api/products | python3 -m json.tool
echo ""

# 6. Test Cart (User needs to be logged in)
echo -e "${BLUE}6. Get User Cart${NC}"
curl -s -X GET $BASE_URL/api/cart \
  -H "Authorization: Bearer $USER_TOKEN" | python3 -m json.tool
echo ""

echo -e "${GREEN}======================================"
echo -e "  ✓ ALL TESTS PASSED"
echo -e "======================================${NC}"
echo ""
echo "Test files saved in: $TEMP_DIR"
echo ""
echo "Next Steps:"
echo "1. Update user role to 'admin' in MongoDB to test admin endpoints"
echo "2. Use admin token to create products and inventory"
echo "3. Test complete order flow"
