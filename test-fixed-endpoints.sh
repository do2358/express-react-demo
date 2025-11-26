#!/bin/bash

API_URL="http://localhost:3000/api"
TEST_EMAIL="testadmin@example.com"
TEST_PASSWORD="TestPass123"

echo "🧪 Testing Fixed API Endpoints"
echo "================================"
echo ""

# Function to make JSON requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4

    if [ -n "$token" ]; then
        if [ -n "$data" ]; then
            curl -s -X $method "$API_URL$endpoint" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token" \
                -d "$data"
        else
            curl -s -X $method "$API_URL$endpoint" \
                -H "Authorization: Bearer $token"
        fi
    else
        if [ -n "$data" ]; then
            curl -s -X $method "$API_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data"
        else
            curl -s -X $method "$API_URL$endpoint"
        fi
    fi
}

echo "1️⃣  Testing Public Endpoints (should work)"
echo "-------------------------------------------"

echo "✓ GET /products (public)"
PRODUCTS=$(make_request GET "/products")
echo "$PRODUCTS" | python3 -m json.tool 2>/dev/null | head -10
echo ""

echo "2️⃣  Testing Admin Login"
echo "-------------------------------------------"

# Register user
echo "Creating test user..."
REGISTER_DATA="{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"Test Admin\",\"phone\":\"1234567890\"}"
REGISTER_RESPONSE=$(make_request POST "/auth/register" "$REGISTER_DATA")
echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null | head -5

# Login
echo ""
echo "Logging in..."
LOGIN_DATA="{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}"
LOGIN_RESPONSE=$(make_request POST "/auth/login" "$LOGIN_DATA")
TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('accessToken', ''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get auth token"
    echo "$LOGIN_RESPONSE"
    exit 1
fi

echo "✓ Got auth token: ${TOKEN:0:20}..."
echo ""

echo "3️⃣  Testing FIXED Admin Product Endpoints"
echo "-------------------------------------------"

echo "Testing: GET /products/admin/all (FIXED)"
ADMIN_PRODUCTS=$(make_request GET "/products/admin/all" "" "$TOKEN")
if echo "$ADMIN_PRODUCTS" | grep -q '"success":false'; then
    echo "❌ FAILED:"
    echo "$ADMIN_PRODUCTS" | python3 -m json.tool 2>/dev/null | head -10
else
    echo "✅ SUCCESS"
    echo "$ADMIN_PRODUCTS" | python3 -m json.tool 2>/dev/null | head -10
fi
echo ""

echo "Testing: POST /products/admin (FIXED)"
PRODUCT_DATA='{"name":"Test Product","description":"Test Description","price":99.99,"category":"Electronics","status":"active"}'
CREATE_PRODUCT=$(make_request POST "/products/admin" "$PRODUCT_DATA" "$TOKEN")
if echo "$CREATE_PRODUCT" | grep -q '"success":false'; then
    echo "❌ FAILED:"
    echo "$CREATE_PRODUCT" | python3 -m json.tool 2>/dev/null
else
    echo "✅ SUCCESS"
    PRODUCT_ID=$(echo "$CREATE_PRODUCT" | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('_id', ''))" 2>/dev/null)
    echo "Created product ID: $PRODUCT_ID"
fi
echo ""

if [ -n "$PRODUCT_ID" ]; then
    echo "Testing: GET /products/admin/$PRODUCT_ID (FIXED)"
    GET_PRODUCT=$(make_request GET "/products/admin/$PRODUCT_ID" "" "$TOKEN")
    if echo "$GET_PRODUCT" | grep -q '"success":false'; then
        echo "❌ FAILED:"
        echo "$GET_PRODUCT" | python3 -m json.tool 2>/dev/null
    else
        echo "✅ SUCCESS"
    fi
    echo ""

    echo "Testing: PUT /products/admin/$PRODUCT_ID (FIXED)"
    UPDATE_DATA='{"price":149.99}'
    UPDATE_PRODUCT=$(make_request PUT "/products/admin/$PRODUCT_ID" "$UPDATE_DATA" "$TOKEN")
    if echo "$UPDATE_PRODUCT" | grep -q '"success":false'; then
        echo "❌ FAILED:"
        echo "$UPDATE_PRODUCT" | python3 -m json.tool 2>/dev/null
    else
        echo "✅ SUCCESS"
    fi
    echo ""
fi

echo "4️⃣  Testing FIXED Admin Order Endpoints"
echo "-------------------------------------------"

echo "Testing: GET /orders/admin/all (FIXED)"
ADMIN_ORDERS=$(make_request GET "/orders/admin/all" "" "$TOKEN")
if echo "$ADMIN_ORDERS" | grep -q '"success":false'; then
    echo "❌ FAILED:"
    echo "$ADMIN_ORDERS" | python3 -m json.tool 2>/dev/null | head -10
else
    echo "✅ SUCCESS"
    echo "$ADMIN_ORDERS" | python3 -m json.tool 2>/dev/null | head -10
fi
echo ""

echo "5️⃣  Testing FIXED Cart Update Endpoint"
echo "-------------------------------------------"

echo "Testing: POST /cart/add (setup)"
ADD_CART=$(make_request POST "/cart/add" "{\"productId\":\"$PRODUCT_ID\",\"quantity\":1}" "$TOKEN")
CART_ITEM_ID=$(echo "$ADD_CART" | python3 -c "import sys, json; cart = json.load(sys.stdin).get('data', {}); items = cart.get('items', []); print(items[0]['_id'] if items else '')" 2>/dev/null)

if [ -n "$CART_ITEM_ID" ]; then
    echo "✓ Added item to cart: $CART_ITEM_ID"
    echo ""

    echo "Testing: PUT /cart/update/$CART_ITEM_ID (FIXED)"
    UPDATE_CART=$(make_request PUT "/cart/update/$CART_ITEM_ID" '{"quantity":3}' "$TOKEN")
    if echo "$UPDATE_CART" | grep -q '"success":false'; then
        echo "❌ FAILED:"
        echo "$UPDATE_CART" | python3 -m json.tool 2>/dev/null
    else
        echo "✅ SUCCESS"
        echo "$UPDATE_CART" | python3 -m json.tool 2>/dev/null | head -10
    fi
else
    echo "⚠️  Could not test cart update (no cart item created)"
fi

echo ""
echo "================================"
echo "🎉 Testing Complete!"
echo "================================"
