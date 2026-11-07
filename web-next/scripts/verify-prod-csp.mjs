#!/usr/bin/env node
/**
 * Production CSP & Console Error Verification + Variant Screenshot Runner
 */

import { chromium } from "playwright-core";
import path from "node:path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.BASE_URL || "http://localhost:3100";
const ARTIFACT_DIR =
  process.env.ARTIFACT_DIR ||
  "/Users/hazarvolgaekiz/.gemini/antigravity/brain/173dadfb-75b8-4764-83d9-425ca41fa4e6";

const ROUTES_TO_VERIFY = [
  { name: "Home (Masthead — Atlas Editorial)", path: "/?preset=atlas-editorial&mode=light&home=masthead", screenshot: "faz3-home-masthead-atlas.png" },
  { name: "Home (Split-Cinema — Ottoman Noir)", path: "/?preset=ottoman-noir&mode=dark&home=split-cinema&tourCard=landscape-row", screenshot: "faz3-home-split-cinema-noir.png" },
  { name: "Home (Split-Cinema — Aegean Linen)", path: "/?preset=aegean-linen&mode=light&home=split-cinema&destinationIndex=grid-mosaic", screenshot: "faz3-home-split-cinema-aegean.png" },
  { name: "Tour Detail (/tours/tour-cappadocia-tuff)", path: "/tours/tour-cappadocia-tuff" },
  { name: "Booking Flow (/book/tour-cappadocia-tuff)", path: "/book/tour-cappadocia-tuff" },
  { name: "Admin Entry (/admin)", path: "/admin" },
  { name: "Design System Studio (/design-system)", path: "/design-system", screenshot: "faz3-design-system-studio.png" },
];

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 920 },
  deviceScaleFactor: 2,
});

let totalPageErrors = 0;
let totalCspViolations = 0;

for (const route of ROUTES_TO_VERIFY) {
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const cspViolations = [];

  await page.addInitScript(() => {
    window.addEventListener("securitypolicyviolation", (e) => {
      // @ts-ignore
      window.__cspViolations = window.__cspViolations || [];
      // @ts-ignore
      window.__cspViolations.push({
        violatedDirective: e.violatedDirective,
        blockedURI: e.blockedURI,
      });
    });
  });

  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  const url = `${BASE_URL}${route.path}`;
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  // Wait for hydration + DesignSystemContext useEffect variant switch
  await page.waitForTimeout(500);
  // Wait for visible images to decode
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll("img")).filter(
      (img) => img.loading !== "lazy"
    );
    await Promise.all(
      imgs.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
          setTimeout(resolve, 3500);
        });
      })
    );
  });
  await page.waitForTimeout(300);

  const detectedCsp = await page.evaluate(() => {
    // @ts-ignore
    return window.__cspViolations || [];
  });
  cspViolations.push(...detectedCsp);

  const status = response?.status() ?? 0;
  const cspHeader = response?.headers()["content-security-policy"] || "";

  if (route.screenshot) {
    const outPath = path.join(ARTIFACT_DIR, route.screenshot);
    await page.screenshot({ path: outPath, fullPage: false });
  }

  totalPageErrors += pageErrors.length;
  totalCspViolations += cspViolations.length;

  console.log(
    `✓ [${status}] ${route.name}` +
      ` | CSP active: ${cspHeader.includes("default-src 'self'") ? "YES" : "NO"}` +
      ` | CSP violations: ${cspViolations.length}` +
      ` | Uncaught page errors: ${pageErrors.length}` +
      ` | Console errors: ${consoleErrors.length}`
  );
  if (cspViolations.length > 0) {
    console.error("  CSP Violations:", JSON.stringify(cspViolations));
  }
  if (pageErrors.length > 0) {
    console.error("  Page Errors:", pageErrors);
  }
  if (consoleErrors.length > 0) {
    console.error("  Console Errors:", consoleErrors);
  }

  await page.close();
}

await browser.close();

if (totalPageErrors > 0 || totalCspViolations > 0) {
  process.exit(1);
}
console.log("\nAll production routes verified under CSP with 0 CSP violations and 0 uncaught runtime errors.");
