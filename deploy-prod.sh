#!/bin/bash

# Production deployment script for NextStopTurkey

echo "🚀 Deploying NextStopTurkey to production..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Build and push Docker images
echo "🐳 Building Docker images..."

# Build production frontend image
docker build -f Dockerfile.prod -t nextstopturkey-frontend:latest .

# Build backend image
docker build -t nextstopturkey-backend:latest ./backend

# Create production docker-compose file
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: tours-postgres-prod
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./backend/migrations:/docker-entrypoint-initdb.d
    networks:
      - tours-network
    restart: unless-stopped

  backend:
    image: nextstopturkey-backend:latest
    container_name: tours-backend-prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3001
      FRONTEND_URL: ${FRONTEND_URL}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    networks:
      - tours-network
    restart: unless-stopped

  frontend:
    image: nextstopturkey-frontend:latest
    container_name: tours-frontend-prod
    ports:
      - "80:80"
      - "443:443"
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

# Create production Dockerfile for frontend
cat > Dockerfile.prod << 'EOF'
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificates (if available)
# COPY ssl/ /etc/nginx/ssl/

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
EOF

echo "✅ Production build completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set your environment variables in .env.prod"
echo "2. Configure SSL certificates in nginx.conf"
echo "3. Run: docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "🔒 Don't forget to:"
echo "- Change default passwords"
echo "- Set up proper JWT secrets"
echo "- Configure backup strategy"
echo "- Set up monitoring"
