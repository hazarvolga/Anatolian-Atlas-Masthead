FROM node:18-alpine

WORKDIR /app

# Build context is the repository root so the Prisma schema is available
COPY backend/package*.json ./
RUN npm install --no-audit --no-fund

COPY prisma ./prisma
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    npx prisma generate --schema ./prisma/schema.prisma

COPY backend/server.js ./
COPY backend/config ./config
COPY backend/middleware ./middleware
COPY backend/routes ./routes
COPY backend/scripts ./scripts

EXPOSE 3001

CMD ["npm", "run", "dev"]
