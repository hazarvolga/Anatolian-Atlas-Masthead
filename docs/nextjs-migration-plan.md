# Next.js App Router Migration Plan

Status: in progress
Target: Next.js 16 App Router, TypeScript, React 19
Backend: unchanged Express API on port 3001

## Current baseline (verified 2026-11-07)

- React 18 + Vite 5 + Tailwind 3 + shadcn/Radix + TanStack Query, `react-router-dom` v6.
- 23 route entries in `src/App.tsx` (including a duplicated `/profile`).
- Auth uses `localStorage` keys `authToken` and `authUser`; ~30 hooks attach the bearer token per request.
- API base: `import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'` in ~48 files.
- No Next.js files, no test runner, no typecheck script, no CI.
- Dead files: `Admin_fixed.tsx`, `*.backup`, `*.bak`, zero-byte email modules, unused `pages/MyReservations.tsx`.
- Render-time browser access: `SEOHead.tsx` reads `window.location.href`; GTM snippet emitted during render.

## Approach

Build the Next.js application in a sibling package `web-next/` while the Vite app keeps
serving on port 5173. Copy only the files each stage needs, adapt router/head/env usage,
and promote `web-next/` to the repository root only after every route passes the same
browser checks. The Vite app is deleted in the final stage, not kept as a catch-all bridge.

- Next port: 3000 (already allowed by backend CORS).
- Package manager: npm, separate lockfile.
- Shared UI: existing Tailwind 3 configuration and `src/styles/*.css` are copied into `web-next`.
- Server Components: layouts, static copy, metadata, 404, dynamic page shell.
- Client Components: all hooks, filters, forms, calendars, booking, admin, language switching.

## Route mapping

| Current | Next.js file | Boundary |
|---|---|---|
| `/` | `app/(public)/page.tsx` | server shell + client sections |
| `/tours` | `app/(public)/tours/page.tsx` | server shell + client list |
| `/tours/:id` | `app/(public)/tours/[id]/page.tsx` | server shell + client detail |
| `/destinations` | `app/(public)/destinations/page.tsx` | server shell + client list |
| `/destinations/:id` | `app/(public)/destinations/[id]/page.tsx` | client detail |
| `/book/:tourId` | `app/(public)/book/[tourId]/page.tsx` | client |
| `/contact` | `app/(public)/contact/page.tsx` | server shell + client form |
| `/gallery` | `app/(public)/gallery/page.tsx` | client |
| `/unsubscribe` | `app/(public)/unsubscribe/page.tsx` | client |
| `/email-confirmation` | `app/(public)/email-confirmation/page.tsx` | client |
| `/:slug` | `app/(public)/[slug]/page.tsx` | server shell + client renderer |
| `/auth` | `app/(auth)/auth/page.tsx` | client |
| `/profile` | `app/(account)/profile/page.tsx` | client guard |
| `/my-reservations` | `app/(account)/my-reservations/page.tsx` | client guard |
| `/booking-success` | `app/(checkout)/booking-success/page.tsx` | client |
| `/booking-cancel` | `app/(checkout)/booking-cancel/page.tsx` | client |
| `/admin` | `app/admin/page.tsx` | client |
| `/admin/tours/create` | `app/admin/tours/create/page.tsx` | client |
| `/admin/tours/edit/:id` | `app/admin/tours/edit/[id]/page.tsx` | client |
| `/admin/destinations/create` | `app/admin/destinations/create/page.tsx` | client |
| `/admin/destinations/edit/:id` | `app/admin/destinations/edit/[id]/page.tsx` | client |
| `/admin/pages/edit/:id` | `app/admin/pages/edit/[id]/page.tsx` | client |
| `*` | `app/not-found.tsx` | server |

Static segments take precedence over `[slug]`, so reserved routes cannot be shadowed.
Unknown slugs call `notFound()`.

## Stage plan

1. Boot + vertical slice: `web-next/` scaffold, providers, fonts, tokens, public layout,
   `/` and `/tours`. Verify build and browser parity with the Vite app.
2. Public routes: tours detail, destinations, gallery, contact, `[slug]`, unsubscribe,
   email confirmation. Remove `window.scrollTo` calls; add `generateMetadata`.
3. Auth, profile, reservations, booking outcome pages, client route guards.
4. Booking flow and complete admin section with dynamic imports.
5. Editorial design pass: Newsreader + Source Sans 3, paper/ink/stone/oxide tokens,
   hero/nav/footer composition, reduced motion, AA contrast.
6. Demo/connected data layer, demo content, honest submission notices, documentation.
7. Promote `web-next/` to root, remove Vite and dead files, update Docker, final checks.

## Verification per stage

- `npx tsc --noEmit` inside `web-next/`
- `npm run build` inside `web-next/`
- `npm run lint` on changed files
- Playwright route smoke tests against the Next dev server
- Production check with `next start` before promotion

## Known risks

- Hydration mismatch from theme/language storage: language starts as `en`, all storage
  reads happen in effects, `<html suppressHydrationWarning>`.
- `[slug]` collisions: covered by static segment precedence plus a route smoke test.
- Admin bundle on public pages: admin code remains under `app/admin`, heavy editors are
  dynamically imported.
- CSS order: a single `globals.css` with tokens imported last.
- `next/font` requires network at build time; fallback to local stacks if unavailable.
