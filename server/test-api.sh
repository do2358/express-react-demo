#!/bin/bash

# MongoDB Connection Test Script

echo "🔍 Testing MongoDB Connection..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with MONGODB_URI"
    exit 1
fi

# Load .env
export $(cat .env | grep -v '^#' | xargs)

# Start server in background
echo "🚀 Starting server..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo ""
echo "========================================="
echo "  API HEALTH CHECK"
echo "========================================="
curl -s http://localhost:3000 | json_pp

echo ""
echo ""
echo "Server is running with PID: $SERVER_PID"
echo "Press Ctrl+C to stop"
echo ""
echo "Next steps:"
echo "1. Test registration: POST http://localhost:3000/api/auth/register"
echo "2. Test login: POST http://localhost:3000/api/auth/login"
echo ""

# Wait for user to stop (Ctrl+C)
wait $SERVER_PID
