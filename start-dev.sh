#!/bin/bash

# NextStopTurkey Local Development Startup Script

echo "🚀 Starting NextStopTurkey with local PostgreSQL..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "🐘 Starting PostgreSQL service..."
    brew services start postgresql
    sleep 3
fi

# Test database connection
echo "🔍 Testing database connection..."
if ! PGPASSWORD=postgres psql -h localhost -U postgres -d nextstopturkey -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Database connection failed. Please check PostgreSQL setup."
    exit 1
fi

echo "✅ Database connection successful"

# Start backend
echo "🔧 Starting backend API..."
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start backend in background
node server.js &
BACKEND_PID=$!

cd ..

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🎨 Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 NextStopTurkey is running!"
echo ""
echo "🐘 Database:  localhost:5432 (PostgreSQL)"
echo "🔧 Backend:   http://localhost:3001"
echo "🎨 Frontend:  http://localhost:5174"
echo ""
echo "Admin Login: hazarvolga@gmail.com / 1872017"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

wait
