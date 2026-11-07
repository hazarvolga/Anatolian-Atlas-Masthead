#!/usr/bin/env node
/**
 * Faz 8.5 Verification Suite:
 * 1. Verifies DEMO_IMAGES Placeholder Mode (/placeholders/*.svg vs /demo/*.jpg)
 * 2. Captures 36 screenshots (3 concepts x 6 pages x 2 viewports [360w, 1440w])
 * 3. Verifies distinct section manifests & structural selectors per concept
 * 4. Runs @axe-core/playwright across all 3 concepts x 6 pages (18 scans)
 * 5. Generates side-by-side 100% Grayscale Comparison Matrices for /, /tours, and /tours/[id]
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";

const CHROME_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.BASE_URL || "http://localhost:3100";
const ARTIFACT_DIR =
  "/Users/hazarvolgaekiz/.gemini/antigravity/brain/173dadfb-75b8-4764-83d9-425ca41fa4e6";

const CONCEPTS = [
  {
    id: "atlas-editorial",
    label: "Atlas Editorial",
    expectedMode: "light",
    expectedToursSelector: '[data-tours-concept="atlas-editorial"]',
    expectedTourDetailSelector: '[data-tour-detail-variant="dossier"]',
    expectedHomeOrder: [
      "hero:masthead",
      "destination-index:map-index",
      "featured-tours:portrait-4x5",
      "manifesto:swiss-diptych",
      "testimonials:ledger-columns",
      "cta-band:ledger-split",
    ],
  },
  {
    id: "aegean-linen",
    label: "Aegean Linen",
    expectedMode: "light",
    expectedToursSelector: '[data-tours-concept="aegean-linen"]',
    expectedTourDetailSelector: '[data-tour-detail-variant="story-scroll"]',
    expectedHomeOrder: [
      "hero:split-cinema",
      "manifesto:asymmetric-essay",
      "destination-index:horizontal-scroll",
      "featured-tours:landscape-row",
      "testimonials:airy-quotes",
      "cta-band:coastal-invitation",
    ],
  },
  {
    id: "ottoman-noir",
    label: "Ottoman Noir",
    expectedMode: "dark",
    expectedToursSelector: '[data-tours-concept="ottoman-noir"]',
    expectedTourDetailSelector: '[data-tour-detail-variant="tabs"]',
    expectedHomeOrder: [
      "hero:fullscreen-reel",
      "featured-tours:full-bleed-minimal",
      "manifesto:centered-salon",
      "destination-index:grid-mosaic",
      "testimonials:symmetrical-triptych",
      "cta-band:ornate-frame",
    ],
  },
];

const PAGES = [
  { key: "home", path: "/" },
  { key: "tours", path: "/tours" },
  { key: "tour-detail", path: "/tours/tour-cappadocia-tuff" },
  { key: "destination-detail", path: "/destinations/dest-cappadocia" },
  {
    key: "journal-article",
    path: "/journal/mimar-sinan-acoustic-vessels-and-structural-geometry-in-istanbul",
  },
  { key: "booking", path: "/book/tour-cappadocia-tuff" },
];

const VIEWPORTS = [
  { key: "360w", width: 360, height: 800 },
  { key: "1440w", width: 1440, height: 900 },
];

async function verifyPlaceholderSvgAssets() {
  console.log("=== 1. Verifying Neutral SVG Placeholder Plates ===");
  const plates = [
    "/placeholders/plate-architecture.svg",
    "/placeholders/plate-landscape.svg",
    "/placeholders/plate-coastline.svg",
  ];
  for (const plate of plates) {
    const res = await fetch(`${BASE_URL}${plate}`);
    if (res.status !== 200) {
      throw new Error(`Expected 200 for ${plate}, got ${res.status}`);
    }
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("svg")) {
      throw new Error(`Expected image/svg+xml for ${plate}, got ${ct}`);
    }
    console.log(`  ✓ ${plate} -> HTTP 200 (${ct})`);
  }
}

async function run() {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  await verifyPlaceholderSvgAssets();

  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME_PATH,
  });
  const axeSummary = [];
  let totalScreenshots = 0;

  try {
    for (const concept of CONCEPTS) {
      console.log(
        `\n=== 2. Auditing & Capturing Concept: ${concept.label} (${concept.id}) ===`
      );

      for (const vp of VIEWPORTS) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          reducedMotion: "reduce",
        });
        const page = await context.newPage();

        for (const pg of PAGES) {
          const url = `${BASE_URL}${pg.path}?preset=${concept.id}`;
          await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
          await page.waitForFunction(
            (expectedId) =>
              document.documentElement.getAttribute("data-concept") ===
              expectedId,
            concept.id,
            { timeout: 10000 }
          );
          await page.waitForTimeout(350);

          if (vp.key === "1440w") {
            if (pg.key === "home") {
              const sections = await page.evaluate(() =>
                Array.from(
                  document.querySelectorAll(
                    '[data-testid="home-manifest-dispatcher"] > [data-manifest-section]'
                  )
                ).map(
                  (el) =>
                    `${el.getAttribute(
                      "data-manifest-section"
                    )}:${el.getAttribute("data-manifest-variant")}`
                )
              );
              const actualStr = sections.join(" -> ");
              const expectedStr = concept.expectedHomeOrder.join(" -> ");
              if (actualStr !== expectedStr) {
                throw new Error(
                  `[${concept.id}] Home manifest order mismatch!\n  Expected: ${expectedStr}\n  Actual:   ${actualStr}`
                );
              }
              console.log(
                `  ✓ [${concept.id}] Home section order verified: ${actualStr}`
              );
            }

            if (pg.key === "tours") {
              const exists = await page
                .locator(concept.expectedToursSelector)
                .count();
              if (exists === 0) {
                throw new Error(
                  `[${concept.id}] Missing expected /tours layout selector: ${concept.expectedToursSelector}`
                );
              }
              console.log(
                `  ✓ [${concept.id}] /tours layout verified: ${concept.expectedToursSelector}`
              );
            }

            if (pg.key === "tour-detail") {
              const exists = await page
                .locator(concept.expectedTourDetailSelector)
                .count();
              if (exists === 0) {
                throw new Error(
                  `[${concept.id}] Missing expected /tours/[id] layout selector: ${concept.expectedTourDetailSelector}`
                );
              }
              console.log(
                `  ✓ [${concept.id}] /tours/[id] layout verified: ${concept.expectedTourDetailSelector}`
              );
            }

            const axeResults = await new AxeBuilder({ page })
              .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
              .analyze();

            axeSummary.push({
              concept: concept.id,
              page: pg.key,
              path: pg.path,
              violations: axeResults.violations.length,
              passes: axeResults.passes.length,
            });

            if (axeResults.violations.length > 0) {
              console.error(
                `  ✗ [AXE VIOLATION] ${concept.id} ${pg.path}:`,
                JSON.stringify(axeResults.violations, null, 2)
              );
              throw new Error(
                `Axe violations found on ${concept.id} ${pg.path}`
              );
            }
          }

          const filename = `faz85-${concept.id}-${pg.key}-${vp.key}.png`;
          const outPath = path.join(ARTIFACT_DIR, filename);
          await page.screenshot({ path: outPath, fullPage: false });
          totalScreenshots++;
          console.log(`  📸 Saved ${filename}`);
        }

        await context.close();
      }
    }

    // Generate Grayscale Side-by-Side Comparison Matrices (Acceptance Test)
    console.log("\n=== 3. Generating Grayscale Acceptance Test Matrices ===");
    const comparisonPages = ["home", "tours", "tour-detail", "destination-detail"];
    const compContext = await browser.newContext({
      viewport: { width: 1680, height: 1080 },
    });
    const compPage = await compContext.newPage();

    for (const pageKey of comparisonPages) {
      const imgs = CONCEPTS.map((c) => {
        const p = path.join(ARTIFACT_DIR, `faz85-${c.id}-${pageKey}-1440w.png`);
        const b64 = fs.readFileSync(p).toString("base64");
        return {
          id: c.id,
          label: c.label,
          dataUri: `data:image/png;base64,${b64}`,
        };
      });

      const html = `<!DOCTYPE html>
      <html>
      <head>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: #111;
            color: #eee;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            padding: 28px;
          }
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #333;
            padding-bottom: 14px;
            margin-bottom: 20px;
            font-size: 12px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
          .col {
            border: 1px solid #333;
            background: #1a1a1a;
            padding: 12px;
          }
          .col-title {
            font-size: 11px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            margin-bottom: 10px;
            color: #ccc;
            display: flex;
            justify-content: space-between;
          }
          img {
            width: 100%;
            height: auto;
            display: block;
            filter: grayscale(100%);
            border: 1px solid #2b2b2b;
          }
        </style>
      </head>
      <body>
        <header>
          <span>FAZ 8.5 ACCEPTANCE TEST — 100% GRAYSCALE ARCHITECTURAL DIFFERENTIATION</span>
          <span>SURFACE: ${pageKey.toUpperCase()} (1440px)</span>
        </header>
        <div class="grid">
          ${imgs
            .map(
              (item, i) => `
            <div class="col">
              <div class="col-title">
                <span>0${i + 1} · ${item.label}</span>
                <span>GRAYSCALE(100%)</span>
              </div>
              <img src="${item.dataUri}" alt="${item.label}" />
            </div>`
            )
            .join("")}
        </div>
      </body>
      </html>`;

      await compPage.setContent(html, { waitUntil: "load" });
      const matrixName = `faz85-grayscale-matrix-${pageKey}.png`;
      await compPage.screenshot({
        path: path.join(ARTIFACT_DIR, matrixName),
        fullPage: true,
      });
      console.log(`  ✓ Generated Grayscale Comparison Matrix: ${matrixName}`);
    }

    await compContext.close();
  } finally {
    await browser.close();
  }

  console.log(`\n✓ Captured ${totalScreenshots}/36 concept screenshots.`);
  console.log(
    `✓ Passed ${axeSummary.length}/${axeSummary.length} @axe-core/playwright WCAG 2.2 AA scans with 0 violations.`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
