# Architectural Technical Debt Register (`docs/TECHNICAL_DEBT.md`)

This document tracks deliberate engineering trade-offs and scheduled migrations in the **NextStopTurkey — Anatolian Atlas** Next.js 16 platform.

---

## TD-001: Server Data Caching (`unstable_cache` vs. Next.js 16 `"use cache"` Directive)

- **Status:** Active (Tracked for future migration once `cacheComponents` Suspense boundaries are finalized across all admin/account routes)
- **Affected Files:**
  - `web-next/src/lib/data/server-catalog.ts`
  - `web-next/app/api/revalidate/route.ts`
  - `web-next/next.config.ts`

### 1. Context & Next.js 16.4.x API Inspection
In Next.js 16.4.x (`node_modules/next/cache.d.ts` & `revalidate.d.ts`), two caching mechanisms coexist:
1. **`"use cache"` Directive + `cacheTag()` + `cacheLife()`:**
   - The modern replacement for `unstable_cache` introduced in Next.js 15/16.
   - Requires enabling `cacheComponents: true` (formerly `experimental.dynamicIO`) in `next.config.ts`.
   - When `cacheComponents: true` is enabled globally, Next.js enforces strict build-time rules requiring **every** uncached dynamic data access (`headers()`, `cookies()`, `searchParams`, or uncached `fetch`) across all 25 routes in the application to be wrapped in explicit `<Suspense>` boundaries, otherwise failing the production build.
2. **`unstable_cache(cb, keyParts, { revalidate, tags })` + 2-argument `revalidateTag(tag, { expire: 0 })`:**
   - Works without enabling global `cacheComponents: true`.
   - Allows throwing `CatalogUpstreamError` inside the callback so HTTP 500 or empty `[]` responses from Express are immediately rejected **before** writing to the Next.js Data Cache (preventing ISR cache poisoning).
   - Works seamlessly with Next.js 16's updated 2-argument `revalidateTag(tag, { expire: 0 })` API for immediate on-demand cache eviction when Admin updates a Tour, Destination, or CMS Page.

### 2. Decision
We retain `unstable_cache` wrapped inside `withNonPoisoningCache()` in `web-next/src/lib/data/server-catalog.ts` paired with Next.js 16's 2-argument `revalidateTag(tag, { expire: 0 })` in `web-next/app/api/revalidate/route.ts`.

### 3. Future Migration Plan to `"use cache"`
When migrating to `cacheComponents: true`:
1. Enable `cacheComponents: true` in `web-next/next.config.ts` and register a custom `cacheLife` profile (`catalog: { stale: 60, revalidate: 120, expire: 3600 }`).
2. Replace `withNonPoisoningCache` in `src/lib/data/server-catalog.ts` with `"use cache"`, `cacheTag("catalog-tours")`, and `cacheLife("catalog")`.
3. Audit all `/admin/*`, `/auth`, `/profile`, and `/my-reservations` client/server boundaries to ensure every dynamic route segment has an explicit `<Suspense>` boundary.
