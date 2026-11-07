# Production & Development Dockerfile for NextStopTurkey (Next.js 16 App Router)
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY web-next/package*.json ./
RUN npm ci

# Build Next.js application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY web-next/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runner
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3100

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3100

CMD ["npm", "run", "start"]
