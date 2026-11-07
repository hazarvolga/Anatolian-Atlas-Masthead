# NextStopTurkey — Luxury Editorial Travel & Tour Theme Documentation

**NextStopTurkey** is a multi-concept, token-driven luxury travel and tour operator template built with **Next.js 16 App Router (v16.4.5)**, **React 19**, **TypeScript**, **Tailwind CSS v3**, **GSAP + Lenis**, and an **Express + Prisma + PostgreSQL** backend.

---

## 1. Key Architectural Highlights

1. **Three Complete Architectural ConceptPacks (`src/design/concepts.ts`):**
   - `atlas-editorial` (Default): 12-column Swiss cartographic monograph (`Newsreader` + `Source Sans 3`), sharp hairlines, `swiss-bar` header, `masthead` hero, `portrait-4x5` cards, `dossier` tour detail.
   - `aegean-linen`: High-key coastal quiet luxury (`Instrument Serif` + `Plus Jakarta Sans`), asymmetric full-bleed photography, `minimal-overlay` header, `split-cinema` hero, `landscape-row` cards, `story-scroll` detail, desktop `horizontal-scroll` destination index.
   - `ottoman-noir`: Nocturnal obsidian & antique gold ceremonial gallery (`Cormorant Garamond` + `DM Sans`), centered symmetrical monumental frames, `centered-logo` header, `fullscreen-reel` hero, `full-bleed-minimal` cards, `tabs` tour detail.
2. **Three-Layer Design Token Pipeline (`scripts/build-tokens.mjs`):**
   - Generates `src/styles/generated-tokens.css` from `primitives.ts`, `semantic.<preset>.ts`, and `components.ts`, and validates 60/60 foreground/background pairs against WCAG 2.2 AA/AAA (`docs/TOKEN_CONTRAST_REPORT.md`).
3. **Static/ISR Performance + Built-in SEO & GEO:**
   - `/`, `/tours`, and `/destinations` pre-render as Static/ISR (`○ Static`, `Revalidate: 2m`) with **99–100 Mobile Lighthouse Performance** (`CLS: 0.000`).
   - Built-in `/sitemap.xml`, AI-crawler-aware `/robots.txt`, `/llms.txt`, `/llms-full.txt`, dynamic OpenGraph images, and `\u003c`-escaped JSON-LD (`Organization`, `TravelAgency`, `WebSite`, `BreadcrumbList`, `TouristTrip`, `TouristDestination`, `Article`, `FAQPage`).
4. **Hardened Security Architecture (`docs/OWASP_SECURITY_AUDIT.md`):**
   - `HttpOnly; Secure; SameSite=Lax` `__Host-nst_access` (15m) + `__Host-nst_refresh` (7d rotating) cookies, CSRF `Origin` validation, server-side RBAC (`adminMiddleware`), Zod validation, and `isomorphic-dompurify` HTML sanitization.

---

## 2. Quick Start & Installation

### Option A: Standalone Template Demo Mode (No Database Required)
```bash
cd web-next
cp .env.example .env.local
# Set NEXT_PUBLIC_DEMO_MODE=true in .env.local
npm install
npm run build
NEXT_PUBLIC_DEMO_MODE=true npm start
```
Open `http://localhost:3100`. You can preview all 3 ConceptPacks live via:
- `http://localhost:3100/?preset=atlas-editorial`
- `http://localhost:3100/?preset=aegean-linen`
- `http://localhost:3100/?preset=ottoman-noir`

### Option B: Full-Stack Production Mode (Next.js + Express + PostgreSQL)
1. **Configure & Start Backend (`http://localhost:3001`):**
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   npm run dev
   ```
2. **Configure & Start Frontend (`http://localhost:3100`):**
   ```bash
   cd web-next
   cp .env.example .env.local
   # Keep NEXT_PUBLIC_DEMO_MODE=false for strict production behavior
   npm install
   npm run build
   npm start
   ```

---

## 3. Customization Guide

### 3.1 White-Label Rebranding (`src/config/site.config.ts`)
All brand names, taglines, coordinates, contact details, social profiles, and verified agency fields (`legalName`, `tursabLicenseNo`, `taxId`) live in a single file: **`web-next/src/config/site.config.ts`** (or can be edited at runtime in `/admin` → **Site Settings**).
- Note: Unverified legal identifiers (`tursabLicenseNo`, `taxId`) default to empty strings `""` and are omitted from JSON-LD until populated.

### 3.2 Switching ConceptPacks or Overriding Individual Layout Slots (`src/config/theme.config.ts`)
Open **`web-next/src/config/theme.config.ts`**:
```ts
import { resolveThemeFromConcept } from "./theme.config";

export default resolveThemeFromConcept({
  preset: "atlas-editorial", // "atlas-editorial" | "aegean-linen" | "ottoman-noir"
  // Optional per-slot overrides:
  layout: {
    // home: "split-cinema",
    // tourCard: "landscape-row",
  },
});
```

### 3.3 Adding a New ConceptPack or Rebuilding Tokens
1. Add your semantic token palette in `web-next/src/design/tokens/semantic.<your-preset>.ts`.
2. Register the concept in `web-next/src/design/concepts.ts` (`CONCEPT_PACKS`).
3. Run the token compiler and WCAG contrast verifier:
   ```bash
   cd web-next
   node scripts/build-tokens.mjs
   ```

### 3.4 Adding a New Section Variant
1. Create your section component under `web-next/src/components/sections/` or `web-next/src/components/home/`.
2. Register the variant in `web-next/src/components/sections/SectionRenderer.tsx`.
3. Add the section entry to `pageManifests.home` or `pageManifests.tours` in `web-next/src/design/concepts.ts`.

### 3.5 Commercial Placeholder Image Mode
When packaging the theme without bundled Unsplash demo photographs, set:
```env
NEXT_PUBLIC_DEMO_PLACEHOLDER_MODE=true
```
All `DEMO_IMAGES` entries automatically resolve to neutral architectural SVG plates in `/public/placeholders/plate-*.svg`. Full photographer credits for the preview images are documented in `docs/ASSETS_CREDITS.md`.

---

## 4. Verification & Testing Commands

| Command | Purpose |
| :--- | :--- |
| `node scripts/build-tokens.mjs` | Rebuilds `generated-tokens.css` and verifies 60/60 WCAG 2.2 AA/AAA contrast ratios. |
| `npx tsc --noEmit` | Runs full TypeScript type checking across `web-next/`. |
| `npm run build` | Builds the Next.js 16 production bundle and verifies Static/ISR route generation. |
| `node scripts/verify-faz85.mjs` | Runs Playwright visual captures (36 viewports), grayscale acceptance matrices, and 18 `@axe-core/playwright` WCAG 2.2 AA audits. |
| `node scripts/verify-faz9-security.mjs` | Runs automated end-to-end security tests (`HttpOnly` `__Host-` cookies, token rotation, reuse detection, CSRF `Origin` check, RBAC, XSS sanitizer, JSON-LD escaping). |
