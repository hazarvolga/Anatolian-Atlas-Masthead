# Third-Party Licenses & Marketplace Redistribution Notice

This document records the licensing status, verbatim license clauses, redistribution rights, and commercial attribution requirements for all third-party libraries, fonts, icon sets, and motion primitives used in the **NextStopTurkey — Anatolian Atlas** Next.js 16 luxury travel theme.

---

## 1. Motion & Animation Engine

### 1.1 GSAP (`gsap` ^3.15.x & `@gsap/react` ^2.1.x)
- **Author:** GreenSock, Inc. / Webflow, Inc.
- **Integration Method:** Declared as a standard npm dependency in `web-next/package.json`. No GSAP source files are vendored or redistributed inside the repository archive.
- **License:** **Standard "No Charge" GreenSock License** (Effective Date: April 30, 2025; Last Modified: May 30, 2025 — following Webflow's acquisition of GSAP and retirement of the paid Business Green tier).
- **Official License Text & Terms:**
  - Standard License: https://gsap.com/community/standard-license/
  - Licensing FAQ & Terms: https://gsap.com/licensing/

#### Verbatim Quotes from the Official GSAP Standard License (`https://gsap.com/community/standard-license/`)

1. **Section I — Definitions ("Permitted Uses" & "Prohibited Uses"):**
   > **E. "Permitted Uses"** means the implementation and/or use of GSAP Products on any website, web application, or digital interface by any person or entity, provided that such implementation and/or use does not constitute a Prohibited Use.
   >
   > **F. "Prohibited Uses"** means any implementation and/or use of GSAP Products in tools that allow users to build visual animations without code that encourages, induces, or materially assists in creating a solution that competes with Webflow’s visual animation building capabilities.

2. **Section II — Free Use and Distribution License:**
   > **A. License Grant.** Subject to the terms and conditions of this Agreement, GreenSock hereby grants Licensee a non-exclusive, non-transferable, non-sublicensable, revocable, worldwide, royalty-free, and limited license to use and distribute the GSAP Products solely for Permitted Uses ("License").
   >
   > **B. Distribution.** Licensee may distribute the GSAP Products only as incorporated into Licensee’s website, web application, or digital interface and solely for Permitted Uses. Licensee shall not sell, license, rent, lease, lend, or otherwise distribute the GSAP Products on a standalone basis or as part of any software development kit, library, component library, or visual animation builder that constitutes a Prohibited Use.

3. **Official Licensing FAQ (`https://gsap.com/licensing/`):**
   > *"Can I really use GSAP in commercial projects without paying anything? — Yes, really! Commercial usage is covered under the standard license. The only restricted usage is integrating GSAP into a tool that allows users to build visual animations without code that competes with Webflow."*

#### Marketplace / ThemeForest Redistribution Assessment & MIT/Native Alternatives Matrix

- **Does ThemeForest Redistribution Require an OEM License?**
  - Under the May 30, 2025 Standard License revision, the legacy "multiple end-users charged a fee" restriction was retired (and removed from the active license text). Selling a coded Next.js website template (which is not a no-code visual animation builder competing with Webflow) is classified as a Permitted Use, **especially when `gsap` is declared in `package.json` (fetched via `npm install` by the buyer) rather than redistributed as vendored binaries in the `.zip` archive**.
  - However, because the GSAP Standard License is a **custom proprietary license** (with a non-sublicensable clause and a Webflow non-compete restriction) rather than an OSI-approved **MIT License**, some strict enterprise/marketplace compliance teams prefer a 100% MIT/W3C-native dependency graph.
  - Because all motion hooks in this project are encapsulated behind `src/lib/motion/hooks.ts` and the 5 micro-components in `src/components/motion/`, swapping GSAP for an MIT or W3C-native alternative requires touching **only 7 files** (`SmoothScrollProvider.tsx`, `hooks.ts`, and the 5 files in `src/components/motion/`).

| Engine / Approach | License | Marketplace `.zip` Redistribution | Bundle Size (min+gzip) | Cost / Effort to Swap in NextStopTurkey | Visual & Functional Impact |
|---|---|---|---|---|---|
| **GSAP 3 + ScrollTrigger** *(Current)* | Custom Standard License (Webflow) | Free for commercial templates (non-Webflow-competing); declare in `package.json` | ~36 KB | **0 hrs** (Already implemented) | **100% Baseline:** Pin-scrub horizontal track on `/destinations`, scrubbed image parallax, spring magnetic CTA, stagger split-text. |
| **Motion (`motion` / Framer Motion v12)** | **MIT License** (100% OSI Permissive) | Unrestricted commercial & `.zip` redistribution | ~18 KB (`useAnimate` + `useScroll`) | **~3.5 hrs** (Replace `hooks.ts` & 5 micro-components with `useScroll`, `useTransform`, `useSpring`) | **98% Parity:** Identical `SplitTextHeading`, `MagneticCTA`, `CountUpStat`, and vertical scroll reveals; horizontal pin on `/destinations` uses sticky container + `useTransform(scrollYProgress)`. |
| **Anime.js v4 (`animejs`)** | **MIT License** (100% OSI Permissive) | Unrestricted commercial & `.zip` redistribution | ~14 KB (modular ESM + ScrollObserver) | **~4 hrs** (Swap `gsap.to` / `ScrollTrigger` for `animate()` + `onScroll()`) | **95% Parity:** Crisp spring/cubic-bezier timelines and scroll observers; horizontal pin requires CSS `position: sticky` wrapper. |
| **CSS Scroll-Driven Animations + Web Animations API (WAAPI)** | **W3C Native** (Zero 3rd-party license) | Unrestricted (0 dependencies) | **0 KB** | **~5 hrs** (Use `animation-timeline: view()` + `element.animate()` + `IntersectionObserver`) | **90% Parity:** Zero JS main-thread overhead; Firefox requires graceful fallback to `IntersectionObserver` for scroll-scrubbed parallax. |

---

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
