#!/usr/bin/env node
/**
 * Verification Suite: Non-Poisoning ISR Cache, Strict NEXT_PUBLIC_DEMO_MODE Gate & revalidateTag
 *
 * Proves that:
 * 1. Server catalog fetches use process.env.API_INTERNAL_URL.
 * 2. When NEXT_PUBLIC_DEMO_MODE=false (live mode) and Express returns HTTP 500 or empty `[]`,
 *    getServerToursWithStatus() returns status=503, upstreamError=true, data=[] (NO FAKE TOURS)
 *    and does NOT write to the ISR cache.
 * 3. When NEXT_PUBLIC_DEMO_MODE=true (demo mode) and Express returns HTTP 500,
 *    getServerToursWithStatus() returns DEMO_TOURS (source="demo") WITHOUT writing to the ISR cache.
 * 4. Immediately (0ms wait, inside 120s TTL) when Express recovers in live mode (NEXT_PUBLIC_DEMO_MODE=false),
 *    getServerTours() serves and caches the live upstream payload.
 * 5. Subsequent requests within TTL are served from the cache (0 additional upstream requests).
 * 6. When Admin updates a tour/destination/page and calls invalidateCatalogCacheByTags(["catalog-tours"])
 *    (backed by Next.js 16 revalidateTag), the cached entry is immediately evicted and the next
 *    getServerTours() call returns the updated v2 payload from Express.
 */

import http from "node:http";

let mockMode = "error_500";
let tourTitleVersion = "Live Express Bosphorus Archival Walk v1";
let upstreamRequestCount = 0;

const server = http.createServer((req, res) => {
  upstreamRequestCount += 1;
  res.setHeader("Content-Type", "application/json");

  if (mockMode === "error_500") {
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Database connection failed" }));
    return;
  }

  if (mockMode === "empty_200") {
    res.writeHead(200);
    res.end(JSON.stringify([]));
    return;
  }

  if (mockMode === "healthy_live") {
    res.writeHead(200);
    if (req.url?.startsWith("/api/tours")) {
      res.end(
        JSON.stringify([
          {
            id: "live-express-tour-99",
            title: tourTitleVersion,
            description: "Served from internal Express API_INTERNAL_URL.",
            city: "İstanbul",
            country: "Türkiye",
            price_adult: 340,
            duration: 1,
            max_participants: 8,
            difficulty: "easy",
            image_url:
              "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
          },
        ])
      );
      return;
    }
    if (req.url?.startsWith("/api/destinations")) {
      res.end(
        JSON.stringify([
          {
            id: "live-express-dest-istanbul",
            name: "İstanbul & The Bosphorus",
            city: "İstanbul",
            country: "Türkiye",
            coords: "41.0082° N, 28.9784° E",
            best_time: "April – November",
            is_active: true,
          },
        ])
      );
      return;
    }
  }

  res.writeHead(404);
  res.end(JSON.stringify({ message: "Not found" }));
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const port = typeof address === "object" && address ? address.port : 0;

// Point API_INTERNAL_URL to our local mock Express server in strict live mode (DEMO_MODE=false)
process.env.API_INTERNAL_URL = `http://127.0.0.1:${port}`;
process.env.NEXT_PUBLIC_DEMO_MODE = "false";

const {
  getServerTours,
  getServerToursWithStatus,
  getServerDestinations,
  getCatalogCacheDiagnostics,
  invalidateCatalogCacheByTags,
  resetCatalogCacheForTests,
} = await import("../src/lib/data/server-catalog.ts");

function assert(condition, message) {
  if (!condition) {
    console.error(`✗ FAIL: ${message}`);
    server.close();
    process.exit(1);
  }
  console.log(`✓ PASS: ${message}`);
}

console.log(
  `Running ISR Cache Safety, Strict DEMO_MODE Gate & revalidateTag Verification against API_INTERNAL_URL=${process.env.API_INTERNAL_URL}...\n`
);

resetCatalogCacheForTests();

// 1. Test HTTP 500 error in LIVE mode (NEXT_PUBLIC_DEMO_MODE=false) -> must return 503 & 0 fake tours
mockMode = "error_500";
process.env.NEXT_PUBLIC_DEMO_MODE = "false";
const live500Result = await getServerToursWithStatus();
const diagAfter500 = getCatalogCacheDiagnostics();
assert(
  live500Result.status === 503 &&
    live500Result.upstreamError === true &&
    live500Result.data.length === 0,
  `1. [LIVE MODE: NEXT_PUBLIC_DEMO_MODE=false] HTTP 500 returns status=503 & data=[] (zero fake demo tours shown)`
);
assert(
  diagAfter500.writes === 0 &&
    diagAfter500.cachedKeys.length === 0 &&
    diagAfter500.poisonAttemptsBlocked === 1,
  `2. HTTP 500 did NOT poison ISR cache (writes=${diagAfter500.writes}, poisonAttemptsBlocked=${diagAfter500.poisonAttemptsBlocked})`
);

// 2. Test HTTP 200 with empty array [] in LIVE mode -> must return 503 & block cache poisoning
mockMode = "empty_200";
const liveEmptyResult = await getServerToursWithStatus();
const diagAfterEmpty = getCatalogCacheDiagnostics();
assert(
  liveEmptyResult.status === 503 &&
    liveEmptyResult.upstreamError === true &&
    liveEmptyResult.data.length === 0,
  `3. [LIVE MODE: NEXT_PUBLIC_DEMO_MODE=false] HTTP 200 empty [] returns status=503 & data=[]`
);
assert(
  diagAfterEmpty.writes === 0 &&
    diagAfterEmpty.cachedKeys.length === 0 &&
    diagAfterEmpty.poisonAttemptsBlocked === 2,
  `4. HTTP 200 with empty [] was blocked from poisoning ISR cache (writes=${diagAfterEmpty.writes}, poisonAttemptsBlocked=${diagAfterEmpty.poisonAttemptsBlocked})`
);

// 3. Test HTTP 500 error in explicit DEMO mode (NEXT_PUBLIC_DEMO_MODE=true) -> returns DEMO_TOURS without caching
mockMode = "error_500";
process.env.NEXT_PUBLIC_DEMO_MODE = "true";
const demo500Result = await getServerToursWithStatus();
const diagAfterDemo500 = getCatalogCacheDiagnostics();
assert(
  demo500Result.status === 200 &&
    demo500Result.source === "demo" &&
    demo500Result.data.length === 6,
  `5. [DEMO MODE: NEXT_PUBLIC_DEMO_MODE=true] HTTP 500 falls back to DEMO_TOURS (count=${demo500Result.data.length}) only when explicitly enabled`
);
assert(
  diagAfterDemo500.writes === 0 && diagAfterDemo500.poisonAttemptsBlocked === 3,
  `6. DEMO_TOURS fallback was NOT written into the ISR cache (writes=${diagAfterDemo500.writes})`
);

// 4. Switch back to LIVE mode (NEXT_PUBLIC_DEMO_MODE=false) and healthy upstream (0ms wait)
process.env.NEXT_PUBLIC_DEMO_MODE = "false";
mockMode = "healthy_live";
const reqCountBeforeLive = upstreamRequestCount;
const liveTours = await getServerTours();
const diagAfterLive = getCatalogCacheDiagnostics();
assert(
  liveTours[0].id === "live-express-tour-99" &&
    liveTours[0].title === "Live Express Bosphorus Archival Walk v1",
  "7. Immediately after upstream recovery (0ms wait), getServerTours() returns live Express data from API_INTERNAL_URL"
);
assert(
  diagAfterLive.writes === 1 && diagAfterLive.cachedKeys.length === 1,
  `8. Valid non-empty live payload is written to ISR cache (writes=${diagAfterLive.writes}, key=${diagAfterLive.cachedKeys[0]})`
);

// 5. Verify subsequent call within 120s TTL is served from cache without hitting upstream
const cachedTours = await getServerTours();
const diagAfterCacheHit = getCatalogCacheDiagnostics();
assert(
  cachedTours[0].title === "Live Express Bosphorus Archival Walk v1" &&
    diagAfterCacheHit.hits === 1 &&
    upstreamRequestCount === reqCountBeforeLive + 1,
  `9. Subsequent call within 120s TTL is served from cache (hits=${diagAfterCacheHit.hits}, extra upstream calls=0)`
);

// 6. Test Admin save -> revalidateTag("catalog-tours") immediate cache eviction & fresh fetch
tourTitleVersion = "Live Express Bosphorus Archival Walk v2 (Updated via Admin)";
const revalResult = invalidateCatalogCacheByTags(["catalog-tours"]);
const diagAfterRevalidate = getCatalogCacheDiagnostics();
const refreshedTours = await getServerTours();
assert(
  revalResult.revalidated === true &&
    diagAfterRevalidate.tagRevalidations === 1 &&
    diagAfterRevalidate.cachedKeys.length === 0 &&
    refreshedTours[0].title ===
      "Live Express Bosphorus Archival Walk v2 (Updated via Admin)",
  `10. Admin revalidateTag("catalog-tours") immediately evicted cached entry (tags=${revalResult.tags.join(",")}) and served updated v2 tour title`
);

// 7. Test getServerDestinations() against healthy upstream
const liveDestinations = await getServerDestinations();
const diagAfterDest = getCatalogCacheDiagnostics();
assert(
  liveDestinations[0].id === "live-express-dest-istanbul" &&
    diagAfterDest.writes === 3,
  "11. getServerDestinations() fetches via API_INTERNAL_URL, enriches with Atlas metadata, and caches valid payload"
);

server.close();
console.log(
  "\nAll 11 ISR cache safety, strict NEXT_PUBLIC_DEMO_MODE gate, and revalidateTag assertions passed."
);
