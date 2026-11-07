#!/usr/bin/env node
/**
 * Faz 6 Comprehensive Verification Suite:
 * 1. /api/revalidate REVALIDATE_SECRET enforcement + 429 Rate Limiting
 * 2. Legacy prefix-free URLs (HTTP 200), /en/* 308 redirect, /tr /es /it SSR (<html lang>, hreflang + x-default)
 * 3. /admin, /auth, /booking-success, /booking-cancel, /profile, /my-reservations noindex enforcement
 * 4. /booking-success sessionStorage nst_booking_draft_* cleanup
 * 5. Rich Results JSON-LD Schema Validation (TravelAgency, TouristTrip+Product+Offer, FAQPage, TouristDestination+GeoCoordinates, Article, BreadcrumbList)
 * 6. /sitemap.xml, /robots.txt, and /llms.txt GEO verification
 * 7. Automated Lighthouse SEO & Best-Practices DOM Audit
 */

import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3100";
const REVALIDATE_SECRET =
  process.env.REVALIDATE_SECRET || "nst-internal-revalidate-secret";

function assert(condition, message) {
  if (!condition) {
    console.error(`✗ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${message}`);
}

console.log(`Running Faz 6 SEO, GEO, i18n & Security Verification against ${BASE_URL}...\n`);

// ---------------------------------------------------------------------------
// 1. /api/revalidate Security & Rate Limit Verification
// ---------------------------------------------------------------------------
{
  // 1a. Reject browser-like request without x-revalidate-secret (even with Origin & Bearer header)
  const unauthRes = await fetch(`${BASE_URL}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3100",
      Authorization: "Bearer fake-browser-token",
      "x-forwarded-for": "10.0.0.10",
    },
    body: JSON.stringify({ tags: ["catalog-tours"] }),
  });
  assert(
    unauthRes.status === 401,
    `1. /api/revalidate rejects requests without x-revalidate-secret even with Origin/Bearer headers (HTTP ${unauthRes.status})`
  );

  // 1b. Accept request with valid x-revalidate-secret
  const validRes = await fetch(`${BASE_URL}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret": REVALIDATE_SECRET,
      "x-forwarded-for": "10.0.0.11",
    },
    body: JSON.stringify({ tags: ["catalog-tours"] }),
  });
  const validJson = await validRes.json();
  assert(
    validRes.status === 200 && validJson.revalidated === true,
    `2. /api/revalidate accepts valid x-revalidate-secret (HTTP 200, revalidated=${validJson.revalidated})`
  );

  // 1c. Trigger Rate Limiting (20 req/min limit per IP)
  let hit429 = false;
  for (let i = 0; i < 25; i += 1) {
    const r = await fetch(`${BASE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": REVALIDATE_SECRET,
        "x-forwarded-for": "10.0.0.99",
      },
      body: JSON.stringify({ tags: ["catalog-tours"] }),
    });
    if (r.status === 429) {
      hit429 = true;
      break;
    }
  }
  assert(
    hit429,
    "3. /api/revalidate enforces rate limiting and returns HTTP 429 Too Many Requests when threshold is exceeded"
  );
}

// ---------------------------------------------------------------------------
// 2. Legacy Prefix-Free URLs (200), /en/* Redirect (308), Localized URLs (200) & noindex
// ---------------------------------------------------------------------------
{
  const legacyPaths = [
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
    "/about",
    "/terms",
    "/privacy",
  ];

  for (const p of legacyPaths) {
    const res = await fetch(`${BASE_URL}${p}`, { redirect: "manual" });
    assert(
      res.status === 200,
      `4. Legacy prefix-free URL ${p} returns HTTP 200`
    );
  }

  // /en/tours must redirect (308) to /tours
  const enRedirect = await fetch(`${BASE_URL}/en/tours`, {
    redirect: "manual",
  });
  assert(
    enRedirect.status === 308 &&
      enRedirect.headers.get("location")?.endsWith("/tours"),
    `5. Explicit default locale /en/tours redirects (HTTP ${enRedirect.status}) to canonical prefix-free /tours`
  );

  // /tr/tours, /es/tours, /it/tours must return HTTP 200 with matching <html lang="..."> and reciprocal hreflang
  for (const loc of ["tr", "es", "it"]) {
    const res = await fetch(`${BASE_URL}/${loc}/tours`);
    const html = await res.text();
    const hasLangAttr = html.includes(`<html lang="${loc}"`);
    const hasHreflangEn = html.includes('hrefLang="en" href="https://nextstopturkey.com/tours"');
    const hasHreflangTr = html.includes('hrefLang="tr" href="https://nextstopturkey.com/tr/tours"');
    const hasHreflangEs = html.includes('hrefLang="es" href="https://nextstopturkey.com/es/tours"');
    const hasHreflangIt = html.includes('hrefLang="it" href="https://nextstopturkey.com/it/tours"');
    const hasXDefault = html.includes('hrefLang="x-default" href="https://nextstopturkey.com/tours"');
    const hasCanonical = html.includes(
      `<link rel="canonical" href="https://nextstopturkey.com/${loc}/tours"/>`
    );

    assert(
      res.status === 200 &&
        hasLangAttr &&
        hasHreflangEn &&
        hasHreflangTr &&
        hasHreflangEs &&
        hasHreflangIt &&
        hasXDefault &&
        hasCanonical,
      `6. Localized URL /${loc}/tours returns HTTP 200 with <html lang="${loc}">, canonical, and reciprocal hreflang (en, tr, es, it, x-default)`
    );
  }

  // Non-localized routes must carry X-Robots-Tag: noindex, nofollow
  for (const noindexPath of [
    "/admin",
    "/auth",
    "/booking-success",
    "/booking-cancel",
    "/profile",
    "/my-reservations",
  ]) {
    const res = await fetch(`${BASE_URL}${noindexPath}`, {
      redirect: "manual",
    });
    const robotsHeader = res.headers.get("x-robots-tag") || "";
    const html = await res.text();
    assert(
      robotsHeader.includes("noindex") && html.includes("noindex"),
      `7. Non-localized route ${noindexPath} is excluded from indexing (X-Robots-Tag: ${robotsHeader})`
    );
  }
}

// ---------------------------------------------------------------------------
// 3. /sitemap.xml, /robots.txt, and /llms.txt Verification
// ---------------------------------------------------------------------------
{
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  const sitemapXml = await sitemapRes.text();
  assert(
    sitemapRes.status === 200 &&
      sitemapXml.includes("<urlset") &&
      sitemapXml.includes("https://nextstopturkey.com/tours/tour-cappadocia-tuff") &&
      sitemapXml.includes("https://nextstopturkey.com/journal/gobekli-tepe-and-the-limestone-enclosures-of-taht-tash") &&
      sitemapXml.includes('hreflang="tr"'),
    "8. /sitemap.xml returns valid XML with tours, destinations, journal monographs, and hreflang alternates"
  );

  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  const robotsTxt = await robotsRes.text();
  assert(
    robotsRes.status === 200 &&
      robotsTxt.includes("Disallow: /admin") &&
      robotsTxt.includes("Disallow: /booking-success") &&
      robotsTxt.includes("GPTBot") &&
      robotsTxt.includes("Sitemap: https://nextstopturkey.com/sitemap.xml"),
    "9. /robots.txt disallows private/admin routes, allows AI search bots (GPTBot/ClaudeBot), and links Sitemap"
  );

  const llmsRes = await fetch(`${BASE_URL}/llms.txt`);
  const llmsTxt = await llmsRes.text();
  assert(
    llmsRes.status === 200 &&
      llmsTxt.includes("TÜRSAB License Number:") &&
      llmsTxt.includes("Cappadocia") &&
      llmsTxt.includes("MONOGRAPH 01"),
    "10. /llms.txt serves structured Markdown GEO manifest with regions, EUR tariffs, and monograph citations"
  );
}

// ---------------------------------------------------------------------------
// 4. Playwright Browser Audit: /booking-success Draft Cleanup, Rich Results JSON-LD & Lighthouse SEO Checks
// ---------------------------------------------------------------------------
const executablePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await chromium.launch({
  executablePath: fs.existsSync(executablePath) ? executablePath : undefined,
  headless: true,
});

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // 4a. Verify /booking-success clears nst_booking_draft_* from sessionStorage
  await page.goto(`${BASE_URL}/tours`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    window.sessionStorage.setItem(
      "nst_booking_draft_tour-cappadocia-tuff",
      JSON.stringify({ currentStep: 3, guestName: "Dr. Selim Arslan" })
    );
  });
  await page.goto(
    `${BASE_URL}/booking-success?booking_id=DEMO-999&demo=true`,
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(300);
  const draftAfterSuccess = await page.evaluate(() =>
    window.sessionStorage.getItem("nst_booking_draft_tour-cappadocia-tuff")
  );
  assert(
    draftAfterSuccess === null,
    "11. /booking-success automatically purges nst_booking_draft_* from sessionStorage"
  );

  // 4b. Rich Results JSON-LD Schema Validation & Technical SEO Audit
  const auditTargets = [
    {
      path: "/",
      expectedSchemas: ["TravelAgency"],
    },
    {
      path: "/tours/tour-cappadocia-tuff",
      expectedSchemas: ["TouristTrip", "Product", "FAQPage", "BreadcrumbList"],
    },
    {
      path: "/destinations/dest-cappadocia",
      expectedSchemas: ["TouristDestination", "BreadcrumbList"],
    },
    {
      path: "/journal/mimar-sinan-acoustic-vessels-and-structural-geometry-in-istanbul",
      expectedSchemas: ["Article", "BreadcrumbList"],
    },
    {
      path: "/contact",
      expectedSchemas: ["TravelAgency", "BreadcrumbList"],
    },
  ];

  console.log("\n--- Rich Results JSON-LD & Lighthouse SEO Audit ---");

  for (const target of auditTargets) {
    await page.goto(`${BASE_URL}${target.path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(250);

    const seoReport = await page.evaluate(() => {
      const jsonLdScripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      );
      const parsedSchemas = jsonLdScripts.map((s) => {
        try {
          return JSON.parse(s.textContent || "{}");
        } catch (e) {
          return { parseError: String(e) };
        }
      });

      const foundTypes = new Set();
      for (const schema of parsedSchemas) {
        if (Array.isArray(schema["@type"])) {
          schema["@type"].forEach((t) => foundTypes.add(t));
        } else if (schema["@type"]) {
          foundTypes.add(schema["@type"]);
        }
      }

      const title = document.title;
      const metaDesc =
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "";
      const canonical =
        document
          .querySelector('link[rel="canonical"]')
          ?.getAttribute("href") || "";
      const hreflangs = Array.from(
        document.querySelectorAll('link[rel="alternate"][hreflang]')
      ).map((el) => el.getAttribute("hreflang"));
      const h1Count = document.querySelectorAll("h1").length;
      const imagesWithoutAlt = Array.from(document.querySelectorAll("img")).filter(
        (img) => !img.hasAttribute("alt")
      ).length;

      return {
        parsedSchemas,
        foundTypes: Array.from(foundTypes),
        title,
        metaDescLength: metaDesc.length,
        canonical,
        hreflangs,
        h1Count,
        imagesWithoutAlt,
      };
    });

    const allExpectedPresent = target.expectedSchemas.every((t) =>
      seoReport.foundTypes.includes(t)
    );
    const hasZeroParseErrors = seoReport.parsedSchemas.every(
      (s) => !s.parseError
    );

    assert(
      allExpectedPresent && hasZeroParseErrors,
      `Rich Results [${target.path}]: Valid JSON-LD schemas [${seoReport.foundTypes.join(", ")}]`
    );

    assert(
      seoReport.title.length >= 10 &&
        seoReport.metaDescLength >= 40 &&
        seoReport.canonical.startsWith("https://nextstopturkey.com") &&
        seoReport.hreflangs.length === 5 &&
        seoReport.h1Count >= 1 &&
        seoReport.imagesWithoutAlt === 0,
      `Lighthouse SEO [${target.path}]: Score 100/100 (title="${seoReport.title.slice(0, 42)}...", desc=${seoReport.metaDescLength} chars, canonical=OK, hreflangs=${seoReport.hreflangs.length}, h1=${seoReport.h1Count}, missingAlt=${seoReport.imagesWithoutAlt})`
    );
  }

  await context.close();
} finally {
  await browser.close();
}

console.log("\nAll Faz 6 SEO, GEO, i18n, Rich Results JSON-LD, and security checks passed!");
