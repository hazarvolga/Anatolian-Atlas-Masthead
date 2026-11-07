# Third-Party Licenses & Marketplace Redistribution Notice

This document records the licensing status, redistribution rights, and commercial attribution requirements for all third-party libraries, fonts, icon sets, and motion primitives used in the **NextStopTurkey — Anatolian Atlas** Next.js 16 luxury travel theme.

---

## 1. Motion & Animation Engine

### 1.1 GSAP (`gsap` ^3.15.x & `@gsap/react` ^2.1.x)
- **Author:** GreenSock, Inc. (Webflow)
- **Integration Method:** Declared as a standard npm dependency in `web-next/package.json`. No GSAP source files are vendored or modified inside the repository.
- **License:** **Standard "No Charge" GreenSock License** (with Webflow's updated GSAP terms).
- **Official License Text & Terms:**
  - Standard License: https://gsap.com/community/standard-license/
  - Licensing FAQ & Commercial / Marketplace Terms: https://gsap.com/licensing/
- **Marketplace / Commercial Redistribution Note (ThemeForest / TemplateMonster):**
  - Under the Standard "No Charge" GreenSock License, GSAP is free to use in end-user websites and applications where multiple end-users are not charged a fee solely for access to the product.
  - **For Theme/Template Sellers & Buyer Notice:** If this template is sold as a paid commercial product to multiple buyers on a marketplace (e.g., ThemeForest, TemplateMonster) or bundled into a SaaS builder where end-users pay for access, verify current commercial OEM / redistribution requirements at https://gsap.com/licensing/.
  - Note that this theme uses **only core `gsap` and `ScrollTrigger`**; all word-splitting (`SplitTextHeading`) and layout transitions are implemented via **clean-room first-party TypeScript components** (`src/components/motion/`) so buyers do not require a separate Club GSAP token to build or run the project.

### 1.2 Lenis (`lenis` ^1.3.x)
- **Author:** Darkroom Engineering / Studio Freight
- **Repository:** https://github.com/darkroomengineering/lenis
- **License:** **MIT License** (Permits commercial use, modification, and marketplace redistribution).
- **Runtime Policy in Theme:**
  - Synchronized with `gsap.ticker` and `ScrollTrigger.update` inside `src/lib/motion/SmoothScrollProvider.tsx`.
  - Automatically disabled on touch devices (`(hover: none), (pointer: coarse)`) to preserve native OS momentum scrolling.
  - Automatically disabled on `/book/*`, `/auth/*`, and `/admin/*` routes, and whenever `prefers-reduced-motion: reduce` or `motionIntensity: "off"` is active.

### 1.3 Clean-Room Motion Micro-Components (`src/components/motion/*`)
- **Components:** `SplitTextHeading`, `CountUpStat`, `MagneticCTA`, `SpotlightTourCard`, `TiltRegionCard`
- **Origin:** **100% First-Party Clean-Room Implementation** written specifically for NextStopTurkey using `gsap` (`gsap.context`, `gsap.quickTo`, `ScrollTrigger`) and semantic CSS custom properties.
- **Third-Party Code Copied:** **None (0%)**. No external React Bits source code is copied into the codebase.
- **License:** Covered under the main NextStopTurkey theme license.

---

## 2. Typography (SIL Open Font License 1.1)

All three concept presets load exclusively **SIL Open Font License 1.1 (OFL-1.1)** typefaces via `next/font/google` (self-hosted automatically at build time with zero runtime requests to Google servers). OFL-1.1 explicitly permits bundling, embedding, commercial use, and redistribution inside paid website templates.

| Theme Preset | Role | Font Family | Designer / Foundry | License | URL |
|---|---|---|---|---|---|
| `atlas-editorial` | Display Serif | **Newsreader** | Production Type | SIL OFL 1.1 | https://fonts.google.com/specimen/Newsreader |
| `atlas-editorial` | UI & Body Sans | **Source Sans 3** | Paul D. Hunt (Adobe) | SIL OFL 1.1 | https://fonts.google.com/specimen/Source+Sans+3 |
| `aegean-linen` | Display Serif | **Fraunces** | Undercase Type | SIL OFL 1.1 | https://fonts.google.com/specimen/Fraunces |
| `aegean-linen` | UI & Body Sans | **Instrument Sans** | Instrument / Rodrigo Fuenzalida | SIL OFL 1.1 | https://fonts.google.com/specimen/Instrument+Sans |
| `ottoman-noir` | Display Serif | **Bodoni Moda** | Owen Earl (indestructible type*) | SIL OFL 1.1 | https://fonts.google.com/specimen/Bodoni+Moda |
| `ottoman-noir` | UI & Body Sans | **Albert Sans** | Andreas Rasmussen | SIL OFL 1.1 | https://fonts.google.com/specimen/Albert+Sans |
| All Presets | Tabular / Coordinates | **IBM Plex Mono** | Mike Abbink (IBM) | SIL OFL 1.1 | https://fonts.google.com/specimen/IBM+Plex+Mono |

Full SIL OFL 1.1 text: https://openfontlicense.org/open-font-license-official-text/

---

## 3. Core Framework, UI Primitives & Security Libraries

| Package | License | Purpose |
|---|---|---|
| `next` (16.4.x), `react` (19.x), `react-dom` (19.x) | MIT | App Router SSR/ISR framework & UI runtime |
| `@radix-ui/react-*` | MIT | Accessible headless primitives (Dialog, Select, Tabs, Tooltip, Toast) |
| `lucide-react` | ISC | Consistent 1.5px stroke SVG iconography (no emoji icons) |
| `tailwindcss`, `class-variance-authority`, `tailwind-merge` | MIT | Token-bound utility styling & component variants |
| `sanitize-html` | MIT | AST-based (`htmlparser2`) server & client HTML sanitization against XSS |
| `zod` (`jitless: true`) | MIT | Strict schema validation compatible with `script-src` without `'unsafe-eval'` |
| `@tanstack/react-query` | MIT | Client-side cache & optimistic state synchronization |

---

## 4. Demo Photography Notice

- Demo preview URLs in `src/lib/data/demo-content.ts` reference curated photography of Türkiye (İstanbul, Cappadocia, Ephesus, Lycia, Pamukkale, and Mardin) hosted on Unsplash under the [Unsplash License](https://unsplash.com/license).
- For commercial marketplace archive `.zip` packaging, buyers may replace demo URLs with their own licensed agency photography or local `/public/images/` assets via `src/lib/data/demo-content.ts` or the `/admin` dashboard.
