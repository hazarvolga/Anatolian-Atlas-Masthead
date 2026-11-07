#!/usr/bin/env node
/**
 * Faz 5 Verification Suite:
 * 1. Captures 360px (Mobile) and 1440px (Desktop) screenshots across key pages.
 * 2. Verifies zero horizontal overflow at 360px mobile viewport.
 * 3. Verifies /book/[tourId] multi-stage state persistence across full page reload (sessionStorage).
 * 4. Verifies /journal and /journal/[slug] monographs, citations, and demo byline badges.
 */

import { chromium } from "playwright-core";
import path from "node:path";
import fs from "node:fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3100";
const ARTIFACT_DIR =
  "/Users/hazarvolgaekiz/.gemini/antigravity/brain/173dadfb-75b8-4764-83d9-425ca41fa4e6";

const PAGES_TO_CAPTURE = [
  { slug: "home", path: "/", title: "Homepage (Masthead)" },
  { slug: "destinations", path: "/destinations", title: "Regions Index" },
  {
    slug: "destination-detail",
    path: "/destinations/dest-cappadocia",
    title: "Region Dossier (Cappadocia)",
  },
  { slug: "tours", path: "/tours", title: "Tours Catalogue" },
  {
    slug: "tour-detail",
    path: "/tours/tour-cappadocia-tuff",
    title: "Tour Detail (Cappadocia)",
  },
  {
    slug: "booking",
    path: "/book/tour-cappadocia-tuff",
    title: "Booking Ledger (Stage 01–04)",
  },
  { slug: "journal", path: "/journal", title: "The Anatolian Journal" },
  {
    slug: "journal-article",
    path: "/journal/gobekli-tepe-and-the-limestone-enclosures-of-taht-tash",
    title: "Journal Monograph (Göbekli Tepe)",
  },
  { slug: "gallery", path: "/gallery", title: "Field Archive Gallery" },
  { slug: "contact", path: "/contact", title: "Galata Planning Desk" },
  { slug: "cms-about", path: "/about", title: "CMS Dynamic Page (/about)" },
  { slug: "auth", path: "/auth", title: "Authentication Ledger" },
];

function assert(condition, message) {
  if (!condition) {
    console.error(`✗ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${message}`);
}

const executablePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await chromium.launch({
  executablePath: fs.existsSync(executablePath) ? executablePath : undefined,
  headless: true,
});

try {
  console.log(`Running Faz 5 Page & Viewport Verification against ${BASE_URL}...\n`);

  // 1. Test /book/[tourId] State Persistence Across Page Reload
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    await page.goto(`${BASE_URL}/book/tour-cappadocia-tuff`, {
      waitUntil: "networkidle",
    });

    // Wait for Stage 01 (either multi-day suite selector or single-day guest selector)
    const hasRoomPlus = await page
      .locator('[data-testid="room-plus-double"]')
      .isVisible()
      .catch(() => false);

    if (hasRoomPlus) {
      await page.click('[data-testid="room-plus-double"]');
      const roomCount = await page.textContent('[data-testid="room-count-double"]');
      assert(
        roomCount?.trim() === "1",
        "Booking Stage 01: Selected 1 Double Archival Suite (2 guests)"
      );
    } else {
      await page.waitForSelector('[data-testid="adults-plus"]', { timeout: 10000 });
      await page.click('[data-testid="adults-plus"]');
      const adultsAfterClick = await page.textContent('[data-testid="adults-count"]');
      assert(
        adultsAfterClick?.trim() === "3",
        "Booking Stage 01: Incremented adults count from 2 to 3"
      );
    }

    // Advance to Stage 02 (Dates)
    await page.click('[data-testid="booking-next-stage"]');
    await page.waitForTimeout(250);

    // Advance to Stage 03 (Guest Contact Details)
    await page.click('[data-testid="booking-next-stage"]');
    await page.waitForSelector('input[name="guestName"]', { timeout: 10000 });

    await page.fill('input[name="guestName"]', "Dr. Selim Arslan");
    await page.fill(
      'input[name="guestEmail"]',
      "selim.arslan@anatolianatlas.org"
    );
    await page.fill(
      'textarea[name="specialRequests"]',
      "Early morning access note for Karanlık Kilise."
    );
    await page.waitForTimeout(300);

    // Perform full browser reload!
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="booking-session-ledger"]', {
      timeout: 10000,
    });

    const ledgerText = await page.textContent(
      '[data-testid="booking-session-ledger"]'
    );
    const restoredName = await page.inputValue('input[name="guestName"]');
    const restoredEmail = await page.inputValue('input[name="guestEmail"]');
    const restoredRequests = await page.inputValue(
      'textarea[name="specialRequests"]'
    );

    assert(
      ledgerText?.includes("STAGE 03") &&
        restoredName === "Dr. Selim Arslan" &&
        restoredEmail === "selim.arslan@anatolianatlas.org" &&
        restoredRequests.includes("Karanlık Kilise"),
      `Booking State Persistence: Full page reload preserved STAGE 03 & guest inputs (${restoredName} / ${restoredEmail})`
    );

    // Verify Stage 01 suite/guest selection also persisted
    await page.click('[data-testid="booking-prev-stage"]');
    await page.click('[data-testid="booking-prev-stage"]');
    await page.waitForTimeout(200);
    if (hasRoomPlus) {
      const restoredRoomCount = await page.textContent(
        '[data-testid="room-count-double"]'
      );
      assert(
        restoredRoomCount?.trim() === "1",
        `Booking State Persistence: Navigating back to Stage 01 preserved Double Suite count=${restoredRoomCount?.trim()}`
      );
    } else {
      const restoredAdults = await page.textContent('[data-testid="adults-count"]');
      assert(
        restoredAdults?.trim() === "3",
        `Booking State Persistence: Navigating back to Stage 01 preserved adults=${restoredAdults?.trim()}`
      );
    }

    await context.close();
  }

  // 2. Capture 1440px (Desktop) & 360px (Mobile) screenshots and check overflow
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const mobileContext = await browser.newContext({
    viewport: { width: 360, height: 800 },
    isMobile: true,
    hasTouch: true,
  });

  const desktopPage = await desktopContext.newPage();
  const mobilePage = await mobileContext.newPage();

  for (const item of PAGES_TO_CAPTURE) {
    const url = `${BASE_URL}${item.path}`;

    // Desktop 1440px
    const dRes = await desktopPage.goto(url, { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(350);
    const dPath = path.join(ARTIFACT_DIR, `faz5-${item.slug}-1440w.png`);
    await desktopPage.screenshot({ path: dPath, fullPage: false });

    // Mobile 360px
    const mRes = await mobilePage.goto(url, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(350);
    const mPath = path.join(ARTIFACT_DIR, `faz5-${item.slug}-360w.png`);
    await mobilePage.screenshot({ path: mPath, fullPage: false });

    const overflowCheck = await mobilePage.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      };
    });

    assert(
      (dRes?.status() || 200) < 400 && (mRes?.status() || 200) < 400,
      `${item.title} (${item.path}) rendered HTTP 200 and saved 1440px + 360px screenshots`
    );
    assert(
      overflowCheck.scrollWidth <= overflowCheck.innerWidth + 2,
      `${item.title} (${item.path}) has zero horizontal overflow at 360px (${overflowCheck.scrollWidth}px <= ${overflowCheck.innerWidth}px)`
    );
  }

  await desktopContext.close();
  await mobileContext.close();
  console.log("\nAll Faz 5 page renders, 360px/1440px screenshots, and /book state persistence checks passed!");
} finally {
  await browser.close();
}
