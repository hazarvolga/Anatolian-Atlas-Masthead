# NextStopTurkey — Local Development & PostgreSQL Setup Guide

## Prerequisites
- **Node.js** 20+ and `npm`
- **PostgreSQL** 15+ (local installation or Docker Compose)

---

## 1. One-Command Startup

```bash
./start-dev.sh
```

This script verifies PostgreSQL connectivity, starts the Express API on `http://localhost:3001`, and launches the Next.js 16 App Router storefront on `http://localhost:3100`.

---

## 2. Manual Setup

### Step 1: Start PostgreSQL
```bash
docker-compose up -d postgres
```

### Step 2: Configure & Start the Backend API (`http://localhost:3001`)
```bash
npm install
npm run prisma:generate
npm run prisma:migrate

cd backend
npm install
npm run dev
```

### Step 3: Configure & Start the Next.js 16 Storefront (`http://localhost:3100`)
```bash
cd web-next
cp .env.example .env.local
npm install
npm run dev
```

---

## 3. Environment Variables

### `web-next/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3100
NEXT_PUBLIC_DATA_MODE=connected
```
*(Set `NEXT_PUBLIC_DATA_MODE=demo` to run with built-in Anatolian Atlas sample data without a backend.)*

### Root / Backend `.env`
```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/tours_db
JWT_SECRET=replace-with-a-secure-random-secret
PORT=3001
FRONTEND_URL=http://localhost:3100
```

---

## 4. Full Docker Compose Deployment

```bash
docker-compose up -d --build
docker-compose logs -f
```
