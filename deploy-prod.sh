#!/bin/bash
set -e

# Production deployment script for NextStopTurkey (Anatolian Atlas — Next.js 16 + Express API)

echo "Building NextStopTurkey production containers..."

# 1. Verify Next.js 16 build locally
npm --prefix web-next run typecheck
npm --prefix web-next run build

# 2. Build production Docker images
docker build -f Dockerfile -t nextstopturkey-frontend:latest .
docker build -f backend/Dockerfile -t nextstopturkey-backend:latest .

# 3. Generate production compose manifest
cat > docker-compose.prod.yml << 'EOF'
services:
  postgres:
    image: postgres:15-alpine
    container_name: tours-postgres-prod
    environment:
      POSTGRES_DB: ${DB_NAME:-nextstopturkey}
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    networks:
      - tours-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres}"]
      interval: 30s
      timeout: 10s
      retries: 5

  backend:
    image: nextstopturkey-backend:latest
    container_name: tours-backend-prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD}@postgres:5432/${DB_NAME:-nextstopturkey}
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3001
      FRONTEND_URL: ${FRONTEND_URL:-http://localhost:3100}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY:-}
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    command: sh -c "npx prisma migrate deploy --schema ./prisma/schema.prisma && npm start"
    networks:
      - tours-network
    restart: unless-stopped

  frontend:
    image: nextstopturkey-frontend:latest
    container_name: tours-frontend-prod
    environment:
      NODE_ENV: production
      PORT: 3100
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:3001}
      NEXT_PUBLIC_SITE_URL: ${FRONTEND_URL:-http://localhost:3100}
      NEXT_PUBLIC_DATA_MODE: ${NEXT_PUBLIC_DATA_MODE:-connected}
    ports:
      - "3100:3100"
    depends_on:
      - backend
    networks:
      - tours-network
    restart: unless-stopped

volumes:
  postgres_prod_data:

networks:
  tours-network:
    driver: bridge
EOF

echo "Production images built and docker-compose.prod.yml generated."
echo "Run: docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d"
