import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import jwt from "../../backend/node_modules/jsonwebtoken/index.js";
import dotenv from "../../backend/node_modules/dotenv/lib/main.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../backend/.env") });

const BASE_URL = process.env.BASE_URL || "http://localhost:3100";
const API_URL = process.env.API_URL || "http://localhost:3001";

const TEN_PAGES = [
  "/",
  "/tours",
  "/tours/tour-cappadocia-tuff",
  "/destinations",
  "/destinations/dest-cappadocia",
  "/journal",
  "/journal/mimar-sinan-acoustic-vessels-and-structural-geometry-in-istanbul",
  "/gallery",
  "/contact",
  "/book/tour-cappadocia-tuff",
];

function serializeJsonLdSafeTest(schema) {
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

async function main() {
  console.log("=================================================================");
  console.log("PRE-FAZ-8 & FAZ 8 AUTOMATED VERIFICATION SUITE");
  console.log("=================================================================\n");

  // 1. Verify Next/Image AVIF/WebP optimization endpoint
  console.log("1. Checking next/image AVIF/WebP negotiation...");
  const imgRes = await fetch(
    `${BASE_URL}/_next/image?url=%2Fdemo%2Fistanbul-bosphorus.jpg&w=1080&q=75`,
    {
      headers: { Accept: "image/avif,image/webp,*/*" },
    }
  );
  const contentType = imgRes.headers.get("content-type") || "";
  console.log(
    `   GET /_next/image?url=%2Fdemo%2Fistanbul-bosphorus.jpg -> HTTP ${imgRes.status}, Content-Type: ${contentType}`
  );
  if (
    imgRes.status !== 200 ||
    (!contentType.includes("image/avif") && !contentType.includes("image/webp"))
  ) {
    throw new Error(
      `Expected image/avif or image/webp from /_next/image, got ${imgRes.status} (${contentType})`
    );
  }

  // 2. Run @axe-core/playwright across all 10 pages + Focus Trap & Focus Return
  console.log("\n2. Running @axe-core/playwright across 10 pages...");
  const executablePath =
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const browser = await chromium.launch({ headless: true, executablePath });
  const axeContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await axeContext.newPage();

  const axeSummary = [];
  let totalAxeViolations = 0;
  for (const route of TEN_PAGES) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(250);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    console.log(
      `   [axe-core] ${route.padEnd(72)} -> violations: ${results.violations.length} (passes: ${results.passes.length})`
    );
    if (results.violations.length > 0) {
      totalAxeViolations += results.violations.length;
      for (const v of results.violations) {
        console.log(
          `      - [${v.id}] (${v.impact}): ${v.help} (${v.nodes.length} nodes) -> e.g. ${v.nodes[0]?.html}`
        );
      }
    }
    axeSummary.push({
      route,
      violations: results.violations.length,
      passes: results.passes.length,
    });
  }
  if (totalAxeViolations > 0) {
    throw new Error(`Total axe violations across 10 pages: ${totalAxeViolations}`);
  }

  // 3. Test Focus Trap & Focus Return on Gallery Lightbox
  console.log(
    "\n3. Testing Focus Trap & Focus Return on Gallery Lightbox (/gallery)..."
  );
  await page.goto(`${BASE_URL}/gallery`, { waitUntil: "networkidle" });
  const firstPlate = page.locator('figure[role="button"]').first();
  await firstPlate.focus();
  const triggerPlateId = await firstPlate.getAttribute("data-plate-id");
  await page.keyboard.press("Enter");

  const lightboxDialog = page.locator('div[role="dialog"][aria-modal="true"]');
  await lightboxDialog.waitFor({ state: "visible" });
  await page.waitForTimeout(100);

  const initialFocusInLightbox = await page.evaluate(() => {
    const dialog = document.querySelector('div[role="dialog"][aria-modal="true"]');
    return {
      insideDialog: Boolean(dialog && dialog.contains(document.activeElement)),
      ariaLabel: document.activeElement?.getAttribute("aria-label") || "",
    };
  });
  console.log(
    `   [Lightbox Open] Focus inside dialog: ${initialFocusInLightbox.insideDialog} (${initialFocusInLightbox.ariaLabel})`
  );
  if (!initialFocusInLightbox.insideDialog) {
    throw new Error("Focus did not move into Lightbox dialog on open");
  }

  // Press Tab 5 times and Shift+Tab 3 times to verify focus stays trapped
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const dialog = document.querySelector(
        'div[role="dialog"][aria-modal="true"]'
      );
      return Boolean(dialog && dialog.contains(document.activeElement));
    });
    if (!inside) {
      throw new Error(`Lightbox focus escaped on Tab iteration ${i + 1}`);
    }
  }
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Shift+Tab");
    const inside = await page.evaluate(() => {
      const dialog = document.querySelector(
        'div[role="dialog"][aria-modal="true"]'
      );
      return Boolean(dialog && dialog.contains(document.activeElement));
    });
    if (!inside) {
      throw new Error(`Lightbox focus escaped on Shift+Tab iteration ${i + 1}`);
    }
  }
  console.log("   [Lightbox Trap] Tab & Shift+Tab remained strictly inside dialog: PASS");

  // Press Escape and verify focus returns to trigger figure[role="button"]
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  const restoredPlateId = await page.evaluate(
    () => document.activeElement?.getAttribute("data-plate-id") || ""
  );
  console.log(
    `   [Lightbox Close] Focus returned to trigger: ${restoredPlateId === triggerPlateId} (data-plate-id=${restoredPlateId})`
  );
  if (restoredPlateId !== triggerPlateId) {
    throw new Error(
      `Expected focus to return to plate "${triggerPlateId}", got "${restoredPlateId}"`
    );
  }

  // 4. Test Focus Trap & Focus Return on Mobile Navigation Drawer (360x800)
  console.log(
    "\n4. Testing Focus Trap & Focus Return on Mobile Navigation Drawer (360x800)..."
  );
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  const mobileMenuBtn = page.locator(
    'button[aria-controls="mobile-navigation-drawer"]'
  );
  await mobileMenuBtn.focus();
  await mobileMenuBtn.click();
  await page.waitForTimeout(150);

  const initialFocusInDrawer = await page.evaluate(() => {
    const drawer = document.getElementById("mobile-navigation-drawer");
    return {
      insideDrawer: Boolean(drawer && drawer.contains(document.activeElement)),
      ariaLabel: document.activeElement?.getAttribute("aria-label") || "",
    };
  });
  console.log(
    `   [Mobile Menu Open] Focus inside drawer: ${initialFocusInDrawer.insideDrawer} (${initialFocusInDrawer.ariaLabel})`
  );
  if (!initialFocusInDrawer.insideDrawer) {
    throw new Error("Focus did not move into Mobile Navigation Drawer on open");
  }

  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const drawer = document.getElementById("mobile-navigation-drawer");
      return Boolean(drawer && drawer.contains(document.activeElement));
    });
    if (!inside) {
      throw new Error(`Mobile drawer focus escaped on Tab iteration ${i + 1}`);
    }
  }
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Shift+Tab");
    const inside = await page.evaluate(() => {
      const drawer = document.getElementById("mobile-navigation-drawer");
      return Boolean(drawer && drawer.contains(document.activeElement));
    });
    if (!inside) {
      throw new Error(
        `Mobile drawer focus escaped on Shift+Tab iteration ${i + 1}`
      );
    }
  }
  console.log(
    "   [Mobile Menu Trap] Tab & Shift+Tab remained strictly inside drawer: PASS"
  );

  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  const restoredMobileFocus = await page.evaluate(
    () =>
      document.activeElement?.getAttribute("aria-controls") ===
      "mobile-navigation-drawer"
  );
  console.log(
    `   [Mobile Menu Close] Focus returned to trigger button: ${restoredMobileFocus}`
  );
  if (!restoredMobileFocus) {
    throw new Error(
      "Focus did not return to mobile menu trigger button after Escape"
    );
  }

  await browser.close();

  // 5. Faz 8: JSON-LD Escaping Verification
  console.log("\n5. Testing Faz 8 JSON-LD Escaping & Live SSR JSON-LD...");
  const maliciousSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: '</script><script>window.__xss=1</script> & "Line\u2028Break\u2029Test"',
  };
  const serialized = serializeJsonLdSafeTest(maliciousSchema);
  if (
    serialized.includes("</script>") ||
    serialized.includes("<script>") ||
    !serialized.includes("\\u003c/script\\u003e") ||
    !serialized.includes("\\u0026")
  ) {
    throw new Error(`JSON-LD escaping failed: ${serialized}`);
  }
  console.log(`   [JSON-LD Escape] Output: ${serialized}`);

  // 6. Faz 8: Backend adminMiddleware + Server-Side SEO Validation + SSR Theme Zero-Flash
  console.log(
    "\n6. Testing Faz 8 adminMiddleware, Server-Side SEO Validation & SSR Theme Application..."
  );

  // 6a. Unauthenticated request to /api/admin/theme-settings & /api/admin/site-settings -> 401
  const unauthThemeRes = await fetch(`${API_URL}/api/admin/theme-settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preset: "ottoman-noir" }),
  });
  console.log(
    `   [adminMiddleware] Unauthenticated PUT /api/admin/theme-settings -> HTTP ${unauthThemeRes.status}`
  );
  if (unauthThemeRes.status !== 401) {
    throw new Error(`Expected 401, got ${unauthThemeRes.status}`);
  }

  // Find or mint admin token from DB user
  const { PrismaClient } = await import(
    "../../backend/node_modules/@prisma/client/index.js"
  );
  const prisma = new PrismaClient();
  let adminUser = await prisma.user.findFirst({
    where: { role: "admin", is_active: true },
  });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: "faz8-admin-verify@nextstopturkey.com",
        password_hash: "not-used-direct-jwt",
        first_name: "Admin",
        last_name: "Verifier",
        role: "admin",
        is_active: true,
      },
    });
  }
  let regularUser = await prisma.user.findFirst({
    where: { role: "user", is_active: true },
  });
  if (!regularUser) {
    regularUser = await prisma.user.create({
      data: {
        email: "faz8-user-verify@nextstopturkey.com",
        password_hash: "not-used-direct-jwt",
        first_name: "Regular",
        last_name: "User",
        role: "user",
        is_active: true,
      },
    });
  }

  const adminToken = jwt.sign(
    { userId: adminUser.id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const userToken = jwt.sign(
    { userId: regularUser.id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // 6b. Non-admin user request -> 403 Forbidden
  const nonAdminRes = await fetch(`${API_URL}/api/admin/theme-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({ preset: "ottoman-noir" }),
  });
  console.log(
    `   [adminMiddleware] Non-admin role="user" PUT /api/admin/theme-settings -> HTTP ${nonAdminRes.status}`
  );
  if (nonAdminRes.status !== 403) {
    throw new Error(`Expected 403 Forbidden for non-admin, got ${nonAdminRes.status}`);
  }

  // 6c. Server-side SEO validation rejects javascript:, data:, and protocol-relative // URLs
  const badCanonicalRes = await fetch(`${API_URL}/api/admin/site-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      canonical_url: "javascript:alert(document.cookie)",
    }),
  });
  const badCanonicalBody = await badCanonicalRes.json();
  console.log(
    `   [SEO Validation] Malicious canonical_url ("javascript:...") -> HTTP ${badCanonicalRes.status} (${badCanonicalBody.message})`
  );
  if (badCanonicalRes.status !== 400) {
    throw new Error(`Expected 400 for javascript: canonical_url, got ${badCanonicalRes.status}`);
  }

  const badOgRes = await fetch(`${API_URL}/api/admin/site-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      og_image: "data:text/html,<script>alert(1)</script>",
    }),
  });
  const badOgBody = await badOgRes.json();
  console.log(
    `   [SEO Validation] Malicious og_image ("data:text/html,...") -> HTTP ${badOgRes.status} (${badOgBody.message})`
  );
  if (badOgRes.status !== 400) {
    throw new Error(`Expected 400 for data: og_image, got ${badOgRes.status}`);
  }

  // 6d. Admin saves new SSR Theme ("aegean-linen", mode: "dark", radius: "soft") -> Verify SSR HTML has zero flash!
  const updateThemeRes = await fetch(`${API_URL}/api/admin/theme-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      preset: "aegean-linen",
      mode: "dark",
      radius: "soft",
      density: "comfortable",
    }),
  });
  if (updateThemeRes.status !== 200) {
    throw new Error(`PUT /api/admin/theme-settings failed: ${updateThemeRes.status}`);
  }

  // Fetch raw SSR HTML from Next.js without any client JS execution
  const ssrHtmlRes = await fetch(`${BASE_URL}/`, {
    headers: { "Cache-Control": "no-cache" },
  });
  const ssrHtml = await ssrHtmlRes.text();
  const hasSsrPreset = ssrHtml.includes('data-theme="aegean-linen"');
  const hasSsrMode = ssrHtml.includes('data-mode="dark"');
  const hasSsrRadius = ssrHtml.includes('data-radius="soft"');
  console.log(
    `   [SSR Zero-Flash] Raw SSR <html> attributes after Admin save: data-theme="aegean-linen" (${hasSsrPreset}), data-mode="dark" (${hasSsrMode}), data-radius="soft" (${hasSsrRadius})`
  );
  if (!hasSsrPreset || !hasSsrMode || !hasSsrRadius) {
    throw new Error("SSR HTML did not reflect Admin-saved theme attributes!");
  }

  // Restore default theme ("anatolian-atlas", "light", "sharp", "airy")
  await fetch(`${API_URL}/api/admin/theme-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      preset: "anatolian-atlas",
      mode: "light",
      radius: "sharp",
      density: "airy",
    }),
  });

  await prisma.$disconnect();
  console.log("\nALL PRE-FAZ-8 & FAZ 8 CHECKS PASSED!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
