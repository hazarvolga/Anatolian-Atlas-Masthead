# Changelog

All notable changes to the **NextStopTurkey — Luxury Editorial Travel & Tour Theme** are documented in this file.

## [2.0.0] - 2026-11-07

### Added
- **Full ConceptPack Identity Engine (`src/design/concepts.ts`):**
  - 3 complete architectural identities (`atlas-editorial`, `aegean-linen`, `ottoman-noir`), each defining distinct design tokens, typography pairings (`Newsreader + Source Sans 3`, `Instrument Serif + Plus Jakarta Sans`, `Cormorant Garamond + DM Sans`), layout slot defaults, `home` and `tours` page manifests with different section ordering, motion profiles, photographic treatments, and geometric ornament sets.
  - Passed the **Grayscale Structural Acceptance Test**: all 3 concepts remain visually distinct in monochrome through layout geometry, grid symmetry, card aspect ratios, and header/footer architecture alone.
- **3-Layer Design Token Pipeline (`scripts/build-tokens.mjs`):**
  - Automated CSS Custom Properties generator (`src/styles/generated-tokens.css`) and WCAG 2.2 AA/AAA contrast verification script (`60/60` pairs verified in `docs/TOKEN_CONTRAST_REPORT.md`).
- **Section Registry & Layout Variants:**
  - Data-driven `SectionRenderer` (Server Component) with 4 Hero variants (`masthead`, `split-cinema`, `fullscreen-reel`, `editorial-index`), 4 TourCard variants (`portrait-4x5`, `landscape-row`, `full-bleed-minimal`, `minimal-list`), 3 Destination Index variants (`map-index`, `grid-mosaic`, `horizontal-scroll`), 3 Tour Detail variants (`dossier`, `story-scroll`, `tabs`), 3 Header variants, and 3 Footer variants.
- **Editorial Monograph Journal (`/journal` & `/journal/[slug]`):**
  - 6 long-form Türkiye cultural and architectural monographs with verified scholarly bibliographic citations, explicit demo editorial notice, and `Article` + `BreadcrumbList` JSON-LD schemas.
- **SEO & Generative Engine Optimization (GEO):**
  - Next.js 16 `proxy.ts` localization (`localePrefix: 'as-needed'`, default English prefixless, `/tr`, `/es`, `/it` localized routes, reciprocal `hreflang` + `x-default`, and `noindex, follow` with English canonical for untranslated long-form slugs).
  - Dynamic `/sitemap.xml`, AI-crawler-configurable `/robots.txt` (`GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`), `/llms.txt`, `/llms-full.txt`, and dynamic OpenGraph image generation (`opengraph-image.tsx`).
  - Answer-first GEO factual summary blocks and semantic `<dl>` specification tables on tour and destination dossiers.
- **Motion System (GSAP + Lenis + Custom Micro-Components):**
  - Synchronized Lenis + GSAP ScrollTrigger provider (`SmoothScrollProvider`) with automatic disable on touch devices, `/book/*`, `/auth/*`, `/admin/*`, `prefers-reduced-motion: reduce`, and `motion.level === 'off'`.
  - 5 custom-authored, MIT-clean GSAP micro-components (`SplitTextReveal`, `ClipMaskReveal`, `SpotlightCard`, `EditorialCountUp`, `SubtleMarquee`).
- **Commercial Placeholder Asset Mode (`src/lib/data/demo-images.ts`):**
  - Set `NEXT_PUBLIC_DEMO_PLACEHOLDER_MODE=true` to swap all demo photographs with neutral architectural SVG plates (`/public/placeholders/*.svg`) for clean marketplace distribution.
- **Admin Theme & SEO Studio (`src/components/admin/AdminSiteSettings.tsx`):**
  - Live `ConceptPack` selector, layout variant overrides, motion/radius/density controls, AI crawler permissions, and server-validated SEO fields (`canonical_url`, `og_image`, SERP preview) persisted to PostgreSQL with automatic `revalidateTag("site-settings")`.

### Security
- **HttpOnly Cookie Authentication & Token Rotation:**
  - Migrated all 24 client hooks and components away from `localStorage.authToken` to the shared `api` client (`withCredentials: true`).
  - Implemented `__Host-nst_access` (15m short-lived JWT) and `__Host-nst_refresh` (7d rotating JWT) `HttpOnly; Secure; SameSite=Lax` cookies with `jti` + `familyId` reuse detection and automatic 401 refresh retry.
  - Added CSRF `originCheckMiddleware`, account lockout after 5 failed login attempts, honeypot spam protection on public forms, timing-safe `REVALIDATE_SECRET` verification on `/api/revalidate`, `isomorphic-dompurify` HTML sanitization, and `\u003c` JSON-LD escaping.

### Performance & Accessibility
- Preserved Static/ISR (`○ Static`, `Revalidate: 2m`) on `/`, `/tours`, and `/destinations` by removing `cookies()` and `headers()` reads from the root layout.
- Achieved **99–100 Mobile Lighthouse Performance, 99–100 Accessibility, 100 Best Practices, and 100 SEO** (`CLS: 0.000`, `LCP: 1.2s–1.8s`) across all 3 ConceptPacks, with `0` `@axe-core/playwright` WCAG 2.2 AA violations across 18/18 scans.
