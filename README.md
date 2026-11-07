# NextStopTurkey — Anatolian Atlas Edition (Next.js 16 + Express + PostgreSQL)

An editorial regional travel monograph and full-stack tour reservation platform for **Türkiye**, designed around the **Anatolian Atlas** visual system (Swiss grid discipline, `Newsreader` & `Source Sans 3` typography, and `Warm Limestone Paper / Deep Bosphorus Ink / Terracotta Oxide` tonal architecture).

---

## Architecture Overview

| Layer | Directory | Stack | Default Port |
| :--- | :--- | :--- | :--- |
| **Frontend (Primary)** | [`web-next/`](./web-next) | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS | `http://localhost:3100` |
| **Backend API** | [`backend/`](./backend) | Express.js, Prisma ORM, PostgreSQL, JWT Auth, Stripe | `http://localhost:3001` |
| **Database Schema** | [`prisma/`](./prisma) | PostgreSQL 15+ migrations & seed scripts | `localhost:5432` |
| **Documentation** | [`docs/`](./docs) | Buyer Setup Guide & Asset License Manifest | — |

---

## Quick Start

### 1. Standalone Template Demo Mode (No Database Required)
You can preview and customize the entire Next.js 16 storefront—including 6 Anatolian regions, 6 multi-day & full-day itineraries, filtering, gallery lightbox, and simulated reservation checkout—without running PostgreSQL:

```bash
cd web-next
cp .env.example .env.local
# Set NEXT_PUBLIC_DATA_MODE=demo in .env.local
npm install
npm run dev
```

Open **http://localhost:3100**.

---

### 2. Full-Stack Connected Mode (Next.js 16 + Express + PostgreSQL)

```bash
# 1. Start PostgreSQL (via Docker or local service)
docker-compose up -d postgres

# 2. Install & start the Express API + Prisma migrations
npm install
npm run prisma:generate
npm run prisma:migrate
cd backend && npm install && npm run dev

# 3. In a second terminal, start the Next.js 16 application
cd web-next
cp .env.example .env.local
npm install
npm run dev
```

Or run both development servers together from the root directory:

```bash
./start-dev.sh
```

---

## Documentation & Customization Guides

- **[Template Buyer & Customization Guide (`docs/TEMPLATE-DOCUMENTATION.md`)](./docs/TEMPLATE-DOCUMENTATION.md):** Brand configuration (`web-next/src/config/site.ts`), color tokens, typography, localization (`EN`, `TR`, `ES`, `IT`), and deployment instructions.
- **[Asset & Font License Manifest (`docs/ASSET-MANIFEST.md`)](./docs/ASSET-MANIFEST.md):** Attribution and license details for all photography, fonts, and icons.
- **[Local PostgreSQL Setup Guide (`README-LOCAL-SETUP.md`)](./README-LOCAL-SETUP.md):** Step-by-step local database and Docker configuration.

---

## Verification & Production Build

```bash
cd web-next
npm run typecheck
npm run lint
npm run build
npm run start
```
