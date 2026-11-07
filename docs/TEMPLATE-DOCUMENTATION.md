# NextStopTurkey — "Anatolian Atlas" Next.js 16 Travel Template Documentation

**NextStopTurkey** is a cultural, archaeological, and regional travel platform and commercial Next.js template built with **Next.js 16 App Router**, **React 19**, **TypeScript**, and **Tailwind CSS**.

It supports two explicit operating modes out of the box:
1. **Template Demo Mode (`NEXT_PUBLIC_DATA_MODE=demo`)** — Runs standalone with curated, geographically accurate Türkiye destinations, itineraries, gallery archives, and a simulated end-to-end reservation flow. Zero database or Stripe credentials required.
2. **Connected Application Mode (`NEXT_PUBLIC_DATA_MODE=connected`)** — Connects to the included Express + Prisma + PostgreSQL backend (`backend/`) with JWT authentication, admin CRUD, real-time availability, dynamic pricing, and Stripe Checkout integration.

---

## 1. Feature Capability Matrix

| Capability | Status | Notes |
| :--- | :--- | :--- |
| **23 Next.js App Router Routes** (`/`, `/tours`, `/tours/[id]`, `/destinations`, `/destinations/[id]`, `/book/[tourId]`, `/gallery`, `/contact`, `/auth`, `/profile`, `/my-reservations`, `/booking-success`, `/booking-cancel`, `/admin/*`, `/[slug]`) | **Implemented and verified** | Compiled and verified under Next.js 16.4.5 (Turbopack) and TypeScript (`tsc --noEmit`). |
| **"Anatolian Atlas" Editorial Design System** | **Implemented and verified** | Warm Paper (`#F4F2EA`), Deep Aegean Ink (`#172D2B`), Travertine Stone (`#D8D7CE`), and Terracotta Oxide (`#A34430`) tokens with deliberate Dark Mode and WCAG 2.2 AA contrast. |
| **Multi-Language UI Localization (`EN`, `TR`, `ES`, `IT`)** | **Implemented and verified** | Full support for English, Turkish (`İ ı Ş ş Ğ ğ Ç ç Ö ö Ü ü`), Spanish, and Italian in `src/locales/`. |
| **Standalone Template Demo Mode** | **Implemented and verified** | Deterministic Türkiye sample tours, destinations, availability calendar, and simulated checkout confirmation with explicit demo banner. |
| **Express + Prisma + PostgreSQL Backend (`backend/`)** | **Implemented and verified** | Full REST API for tours, destinations, reservations, reviews, pages, newsletter consent, and contact messages. |
| **Stripe Checkout & Webhook Verification** | **Requires integration** | Implemented in `backend/index.js` and `src/hooks/usePayments.ts`; requires your `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in `backend/.env`. |
| **AI Destination / Image Enrichment in Admin** | **Requires integration** | Admin UI panels are included; requires configuring your AI provider API key in Admin -> AI Settings. |
| **Transactional Email Delivery (SMTP / Resend)** | **Not included (Preview UI only)** | Newsletter consent and contact messages are stored in PostgreSQL; live outbound SMTP/transactional email dispatch requires connecting your preferred email provider in `backend/`. |

---

## 2. Quick Start & Installation

### Option A: Run Frontend in Standalone Template Demo Mode (Fastest)
No database or backend server is required.

```bash
cd web-next
npm install
NEXT_PUBLIC_DATA_MODE=demo npm run dev
```
Open `http://localhost:3100` in your browser.

### Option B: Run Full-Stack Connected Mode (Next.js + Express + PostgreSQL)

1. **Start the Backend (`http://localhost:3001`):**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run dev
   ```
2. **Start the Next.js App (`http://localhost:3100`):**
   ```bash
   cd web-next
   npm install
   npm run dev
   ```

---

## 3. Available Scripts (`web-next/package.json`)

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js 16 development server on port `3100`. |
| `npm run build` | Creates an optimized production build using Next.js 16. |
| `npm run start` | Starts the production Next.js SSR server on port `3100`. |
| `npm run typecheck` | Runs TypeScript compiler validation (`tsc --noEmit`). |
| `npm run lint` | Runs ESLint across `app/` and `src/`. |

---

## 4. Project Structure

```text
web-next/
├── app/
│   ├── layout.tsx                    # Root layout, Newsreader & Source Sans 3 fonts, metadata
│   ├── providers.tsx                 # React Query, Theme, Language, Auth providers
│   ├── (public)/                     # Public storefront routes (Header + Footer layout)
│   │   ├── page.tsx                  # Homepage ("Anatolian Atlas" sequence)
│   │   ├── tours/                    # /tours catalog & /tours/[id] detail page
│   │   ├── destinations/             # /destinations index & /destinations/[id] detail page
│   │   ├── book/[tourId]/            # Multi-step booking & calendar flow
│   │   ├── gallery/                  # Photographic archive with lightbox
│   │   ├── contact/                  # Galata planning desk & inquiry form
│   │   ├── email-confirmation/       # Newsletter confirmation route
│   │   ├── unsubscribe/              # Newsletter unsubscribe route
│   │   └── [slug]/                   # Dynamic CMS pages
│   ├── (auth)/auth/                  # Sign-in and registration route
│   ├── (account)/                    # Authenticated traveler routes (/profile, /my-reservations)
│   ├── (checkout)/                   # /booking-success and /booking-cancel routes
│   └── admin/                        # Admin dashboard & CRUD routes (dynamically code-split)
├── src/
│   ├── config/site.ts                # Centralized brand, contact, currency, and dataMode config
│   ├── lib/data/demo-content.ts      # Curated Türkiye sample destinations, tours, and gallery
│   ├── locales/{en,tr,es,it}.ts      # Localization dictionaries
│   ├── styles/                       # Anatolian Atlas CSS tokens (themes.css, base.css, components.css)
│   ├── components/                   # Editorial UI, booking, tour-card, and admin components
│   └── hooks/                        # Data-fetching hooks supporting demo & connected modes
```

---

## 5. Customization & Rebranding Guide

### 5.1 Changing Brand Name, Contact Info, and Currency
Open **`web-next/src/config/site.ts`**. All primary brand strings, Galata/İstanbul office coordinates, phone numbers, social URLs, currency symbol (`€`), and operating mode (`demo` vs `connected`) are centralized in `siteConfig`:

```ts
export const siteConfig = {
  brand: {
    name: "NextStopTurkey",
    tagline: "Anatolian Atlas — Regional Journeys",
    headline: "Türkiye, place by place.",
    // ...
  },
  // ...
};
```

### 5.2 Customizing Colors & Typography ("Anatolian Atlas" Theme)
- **Color Tokens:** Edit `web-next/src/styles/themes.css`. The palette uses semantic HSL variables (`--atlas-paper`, `--atlas-ivory`, `--atlas-ink`, `--atlas-slate`, `--atlas-stone`, `--atlas-oxide`) mapped to `--background`, `--foreground`, `--primary`, `--border`, etc.
- **Fonts:** Edit `web-next/app/layout.tsx` to swap `Newsreader` (`--font-serif`) or `Source_Sans_3` (`--font-sans`) via `next/font/google`.

### 5.3 Editing Sample Tours, Destinations, and Gallery Photos
Open **`web-next/src/lib/data/demo-content.ts`**:
- `DEMO_DESTINATIONS`: Edit or add regional destinations, coordinates, best travel seasons, and descriptions.
- `DEMO_TOURS`: Edit or add itineraries, day-by-day schedules, inclusions, adult/child EUR pricing, and group capacities.
- `DEMO_GALLERY_ITEMS`: Edit or add visual archive photographs and location captions.

### 5.4 Editing Translations (`EN`, `TR`, `ES`, `IT`)
Open **`web-next/src/locales/`** and update `en.ts`, `tr.ts`, `es.ts`, and `it.ts`. All four files share the same key structure.

---

## 6. Switching Between Demo Mode and Connected Backend Mode

| Environment Variable | Value | Behavior |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_DATA_MODE` | `demo` | Uses local deterministic data from `src/lib/data/demo-content.ts`. Booking submissions store a simulated confirmation in `sessionStorage` and display a clear "Template Demo Mode" notice on `/booking-success`. |
| `NEXT_PUBLIC_DATA_MODE` | `connected` (default) | Connects to `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:3001`). Automatically falls back to `demo-content.ts` if the backend is offline during preview. |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3001` | Base URL of the Express + Prisma backend server. |

---

## 7. Deployment

### Deploying to Vercel (Recommended for Demo or Connected Frontend)
1. Import the repository into Vercel and set the Root Directory to `web-next` (or repository root after promotion).
2. Set `NEXT_PUBLIC_DATA_MODE=demo` for a standalone template preview deployment, or set `NEXT_PUBLIC_DATA_MODE=connected` and `NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com` for production.

### Deploying with Docker / Coolify
The root `Dockerfile` and `docker-compose.yml` build and serve the Next.js 16 production server alongside the Express backend and PostgreSQL database.
