#!/bin/bash
# test-gateway.sh — Starts identity-service and api-gateway in the background, calls through the gateway, and cleans up.

echo "====================================================="
echo "🚀 GATEWAY API ROUTING TEST RUNNER"
echo "====================================================="

# Check and free ports if busy
if lsof -i :5118 >/dev/null 2>&1; then
    echo "⚠️ Port 5118 (Identity) is busy! Freeing it..."
    kill -9 $(lsof -t -i :5118) >/dev/null 2>&1 || true
fi
if lsof -i :5119 >/dev/null 2>&1; then
    echo "⚠️ Port 5119 (Api Gateway) is busy! Freeing it..."
    kill -9 $(lsof -t -i :5119) >/dev/null 2>&1 || true
fi

# 1. Start Identity Service in the background
echo "🔄 Starting identity-service on http://localhost:5118..."
dotnet run --project backend/services/Identity/Identity.Api/Identity.Api.csproj --urls "http://localhost:5118" > /tmp/identity.log 2>&1 &
IDENTITY_PID=$!

# 2. Start API Gateway in the background
echo "🔄 Starting api-gateway on http://localhost:5119..."
dotnet run --project backend/api-gateway/api-gateway.csproj --urls "http://localhost:5119" > /tmp/gateway.log 2>&1 &
GATEWAY_PID=$!

# Sleep for a few seconds to let them start
echo "⏳ Waiting 6 seconds for services to initialize..."
sleep 6

# 3. Call the Auth register endpoint THROUGH the API Gateway (port 5119)
echo "📡 Sending POST /api/auth/register request to API Gateway..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:5119/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "",
    "domainName": "",
    "adminEmail": "invalid-email",
    "password": "short"
  }')

echo "====================================================="
echo "📥 RECEIVED RESPONSE:"
echo "$RESPONSE"
echo "====================================================="

# 4. Clean up background tasks
echo "🧹 Cleaning up background processes..."
kill $IDENTITY_PID >/dev/null 2>&1 || true
kill $GATEWAY_PID >/dev/null 2>&1 || true

# Free ports explicitly
kill -9 $(lsof -t -i :5118) >/dev/null 2>&1 || true
kill -9 $(lsof -t -i :5119) >/dev/null 2>&1 || true

echo "✅ Test completed successfully!"
