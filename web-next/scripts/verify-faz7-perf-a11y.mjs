#!/usr/bin/env node
/**
 * Faz 7 Comprehensive Performance (Core Web Vitals), Accessibility (WCAG 2.2 AA),
 * and Multi-Viewport Responsive (360px - 1920px) Verification Suite.
 */

import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3100";

function assert(condition, message) {
  if (!condition) {
    console.error(`✗ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${message}`);
}

const VIEWPORTS = [
  { width: 360, height: 800, label: "360px (Compact Mobile)" },
  { width: 768, height: 1024, label: "768px (Tablet Portrait)" },
  { width: 1024, height: 768, label: "1024px (Laptop / Tablet Landscape)" },
  { width: 1440, height: 900, label: "1440px (Editorial Desktop)" },
  { width: 1920, height: 1080, label: "1920px (Ultra-Wide Cinema)" },
];

const TARGET_PAGES = [
  { path: "/", name: "Homepage Masthead" },
  { path: "/tours", name: "Expedition Catalogue" },
  { path: "/tours/tour-cappadocia-tuff", name: "Tour Detail Monograph" },
  { path: "/destinations", name: "Regional Gazetteer" },
  { path: "/destinations/dest-cappadocia", name: "Destination Dossier" },
  { path: "/journal", name: "The Anatolian Journal Index" },
  {
    path: "/journal/mimar-sinan-acoustic-vessels-and-structural-geometry-in-istanbul",
    name: "Journal Monograph Article",
  },
  { path: "/gallery", name: "Archival Gallery" },
  { path: "/contact", name: "Galata Planning Desk" },
  { path: "/book/tour-cappadocia-tuff", name: "Multi-Stage Booking Flow" },
];

const executablePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await chromium.launch({
  executablePath: fs.existsSync(executablePath) ? executablePath : undefined,
  headless: true,
});

try {
  console.log(
    `Running Faz 7 Performance, WCAG 2.2 AA Accessibility & Responsive Audit against ${BASE_URL}...\n`
  );

  // ---------------------------------------------------------------------------
  // 1. Multi-Viewport Zero Horizontal Overflow Audit (360px, 768px, 1024px, 1440px, 1920px)
  // ---------------------------------------------------------------------------
  console.log("--- 1. Multi-Viewport Responsive Overflow Audit (360px -> 1920px) ---");
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    for (const target of TARGET_PAGES) {
      await page.goto(`${BASE_URL}${target.path}`, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForTimeout(250);

      const overflowPx = await page.evaluate(() => {
        return Math.max(
          0,
          document.documentElement.scrollWidth - window.innerWidth
        );
      });

      assert(
        overflowPx <= 1,
        `[${vp.label}] ${target.path} (${target.name}): Zero horizontal overflow (overflow=${overflowPx}px)`
      );
    }

    await context.close();
  }

  // ---------------------------------------------------------------------------
  // 2. Core Web Vitals & Performance Budget Audit (LCP < 2500ms, CLS < 0.05)
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Core Web Vitals & Performance Budget Audit ---");
  const perfContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const perfTargets = [
    "/",
    "/tours",
    "/tours/tour-cappadocia-tuff",
    "/destinations",
    "/journal/mimar-sinan-acoustic-vessels-and-structural-geometry-in-istanbul",
  ];

  for (const path of perfTargets) {
    const page = await perfContext.newPage();

    await page.addInitScript(() => {
      window.__nstVitals = { lcp: 0, cls: 0, fcp: 0 };
      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            window.__nstVitals.lcp = Math.max(
              window.__nstVitals.lcp,
              entry.startTime
            );
          }
        }).observe({ type: "largest-contentful-paint", buffered: true });

        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__nstVitals.cls += entry.value;
            }
          }
        }).observe({ type: "layout-shift", buffered: true });

        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.name === "first-contentful-paint") {
              window.__nstVitals.fcp = entry.startTime;
            }
          }
        }).observe({ type: "paint", buffered: true });
      } catch {
        // Ignore observer errors
      }
    });

    await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const ttfb = nav ? Math.round(nav.responseStart - nav.requestStart) : 0;
      const heroImg = document.querySelector("img");
      return {
        ttfb,
        fcp: Math.round(window.__nstVitals?.fcp || 0),
        lcp: Math.round(window.__nstVitals?.lcp || 0),
        cls: Number((window.__nstVitals?.cls || 0).toFixed(4)),
        heroFetchPriority: heroImg?.getAttribute("fetchpriority") || "auto",
      };
    });

    assert(
      metrics.lcp < 2500 && metrics.cls < 0.05,
      `Web Vitals [${path}]: LCP=${metrics.lcp}ms (<2500ms), CLS=${metrics.cls} (<0.05), FCP=${metrics.fcp}ms, TTFB=${metrics.ttfb}ms, fetchpriority=${metrics.heroFetchPriority}`
    );

    await page.close();
  }
  await perfContext.close();

  // ---------------------------------------------------------------------------
  // 3. WCAG 2.2 AA Accessibility & Keyboard Interaction Audit
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. WCAG 2.2 AA Accessibility & Keyboard Interaction Audit ---");
  const a11yContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const a11yPage = await a11yContext.newPage();

  for (const target of TARGET_PAGES) {
    await a11yPage.goto(`${BASE_URL}${target.path}`, {
      waitUntil: "networkidle",
    });
    await a11yPage.waitForTimeout(200);

    const audit = await a11yPage.evaluate(() => {
      // 1. Landmarks: skip link + #main-content
      const skipLink = document.querySelector('a[href="#main-content"]');
      const mainLandmark =
        document.getElementById("main-content") ||
        document.querySelector("main");

      // 2. Images without alt attribute
      const imgsWithoutAlt = Array.from(document.querySelectorAll("img")).filter(
        (img) => !img.hasAttribute("alt")
      ).length;

      // 3. Buttons without accessible name
      const unlabeledButtons = Array.from(
        document.querySelectorAll("button")
      ).filter((btn) => {
        const text = (btn.textContent || "").trim();
        const ariaLabel = btn.getAttribute("aria-label") || "";
        const ariaLabelledBy = btn.getAttribute("aria-labelledby") || "";
        const title = btn.getAttribute("title") || "";
        return !text && !ariaLabel && !ariaLabelledBy && !title;
      });

      // 4. Form inputs/selects/textareas without label or aria-label
      const unlabeledInputs = Array.from(
        document.querySelectorAll("input, select, textarea")
      ).filter((el) => {
        if (el.getAttribute("type") === "hidden") return false;
        const id = el.getAttribute("id");
        const hasForLabel =
          id && document.querySelector(`label[for="${CSS.escape(id)}"]`);
        const hasParentLabel = Boolean(el.closest("label"));
        const ariaLabel = el.getAttribute("aria-label") || "";
        const ariaLabelledBy = el.getAttribute("aria-labelledby") || "";
        return (
          !hasForLabel && !hasParentLabel && !ariaLabel && !ariaLabelledBy
        );
      });

      // 5. Slider thumbs without accessible name
      const unlabeledSliders = Array.from(
        document.querySelectorAll('[role="slider"]')
      ).filter(
        (s) =>
          !s.getAttribute("aria-label") && !s.getAttribute("aria-labelledby")
      );

      return {
        hasSkipLink: Boolean(skipLink),
        hasMainLandmark: Boolean(mainLandmark),
        imgsWithoutAlt,
        unlabeledButtonsCount: unlabeledButtons.length,
        unlabeledInputsCount: unlabeledInputs.length,
        unlabeledSlidersCount: unlabeledSliders.length,
      };
    });

    assert(
      audit.hasSkipLink &&
        audit.hasMainLandmark &&
        audit.imgsWithoutAlt === 0 &&
        audit.unlabeledButtonsCount === 0 &&
        audit.unlabeledInputsCount === 0 &&
        audit.unlabeledSlidersCount === 0,
      `WCAG 2.2 AA DOM Audit [${target.path}]: skipLink=OK, mainLandmark=OK, missingAlt=0, unlabeledButtons=0, unlabeledInputs=0, unlabeledSliders=0`
    );
  }

  // 3b. Verify aria-live="polite" on /tours filter catalog
  await a11yPage.goto(`${BASE_URL}/tours`, { waitUntil: "networkidle" });
  const liveRegionText = await a11yPage
    .locator('[aria-live="polite"]')
    .first()
    .textContent();
  assert(
    Boolean(liveRegionText && liveRegionText.includes("DISPLAYING")),
    `WCAG 4.1.3 Status Messages [/tours]: Filter count announced via aria-live="polite" ("${liveRegionText?.trim()}")`
  );

  // 3c. Verify Escape key closes Gallery Lightbox
  await a11yPage.goto(`${BASE_URL}/gallery`, { waitUntil: "networkidle" });
  await a11yPage.locator('figure[role="button"]').first().click();
  await a11yPage.waitForTimeout(150);
  const dialogVisible = await a11yPage
    .locator('[role="dialog"][aria-modal="true"]')
    .isVisible();
  await a11yPage.keyboard.press("Escape");
  await a11yPage.waitForTimeout(150);
  const dialogAfterEscape = await a11yPage
    .locator('[role="dialog"][aria-modal="true"]')
    .isVisible();
  assert(
    dialogVisible === true && dialogAfterEscape === false,
    "WCAG 2.1.1 Keyboard Navigation [/gallery]: Lightbox opens via button role and closes cleanly on Escape key"
  );

  // 3d. Verify Mobile Drawer opens and closes on Escape at 360px
  await a11yPage.setViewportSize({ width: 360, height: 800 });
  await a11yPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  const menuBtn = a11yPage.locator(
    'button[aria-controls="mobile-navigation-drawer"]'
  );
  await menuBtn.click();
  await a11yPage.waitForTimeout(200);
  const expandedBefore = await menuBtn.getAttribute("aria-expanded");
  await a11yPage.keyboard.press("Escape");
  await a11yPage.waitForTimeout(200);
  const expandedAfter = await menuBtn.getAttribute("aria-expanded");
  assert(
    expandedBefore === "true" && expandedAfter === "false",
    "WCAG 2.1.1 Keyboard Navigation [360px Mobile Menu]: Drawer toggles aria-expanded and closes on Escape key"
  );

  await a11yContext.close();
} finally {
  await browser.close();
}

console.log(
  "\nAll Faz 7 Core Web Vitals, WCAG 2.2 AA Accessibility, and 360px–1920px Responsive checks passed!"
);
