#!/bin/bash

# NextStopTurkey Local Development Startup Script

echo "🚀 Starting NextStopTurkey with local PostgreSQL..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any running containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down

# Start PostgreSQL database
echo "🐘 Starting PostgreSQL database..."
docker-compose -f docker-compose.dev.yml up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if database is accessible
echo "🔍 Testing database connection..."
docker exec nextstopturkey-postgres-dev pg_isready -U postgres

# Run database migrations
echo "📊 Running database migrations..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Run migrations if they exist
if [ -f "scripts/migrate.js" ]; then
    npm run migrate
else
    echo "⚠️  Migration script not found. Creating migration script..."
    
    # Create migration script
    mkdir -p scripts
    cat > scripts/migrate.js << 'EOF'
import fs from 'fs';
import path from 'path';
import { pool } from '../config/database.js';

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    const migrationFile = path.join(process.cwd(), 'migrations', '001_initial_schema.sql');
    
    if (fs.existsSync(migrationFile)) {
      const sql = fs.readFileSync(migrationFile, 'utf8');
      await pool.query(sql);
      console.log('✅ Migrations completed successfully');
    } else {
      console.log('⚠️  No migration file found');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
EOF
    
    node scripts/migrate.js
fi

# Start backend in background
echo "🔧 Starting backend API..."
npm run dev &
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
echo "🎉 NextStopTurkey is starting up!"
echo ""
echo "📊 Database:  http://localhost:5432 (PostgreSQL)"
echo "🔧 Backend:   http://localhost:3001"
echo "🎨 Frontend:  http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID; docker-compose -f docker-compose.dev.yml down; exit 0' INT

wait
