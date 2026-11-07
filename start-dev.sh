#!/bin/bash

# NextStopTurkey Local Development Startup Script (Next.js 16 + Express API)

echo "Starting NextStopTurkey development environment..."

# Start backend API
echo "Starting Express backend API on port 3001..."
(cd backend && npm install --silent && npm run dev) &
BACKEND_PID=$!

# Start Next.js 16 frontend
echo "Starting Next.js 16 storefront on port 3100..."
(cd web-next && npm install --silent && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "NextStopTurkey is running:"
echo "  Storefront (Next.js 16): http://localhost:3100"
echo "  Backend API (Express):   http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"

trap 'echo "Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
wait
