import { unstable_cache } from "next/cache.js";
import { getInternalApiBaseUrl, isDemoMode } from "../../config/site.config.ts";
import {
  DEMO_DESTINATIONS,
  DEMO_TOURS,
  type DemoTour,
} from "./demo-content.ts";
import type { Destination } from "../../hooks/useDestinations.ts";

const CATALOG_REVALIDATE_SECONDS = 120;

export class CatalogUpstreamError extends Error {
  public readonly status?: number;
  public readonly reason: "http_error" | "empty_payload" | "network_error";

  constructor(
    message: string,
    reason: "http_error" | "empty_payload" | "network_error",
    status?: number
  ) {
    super(message);
    this.name = "CatalogUpstreamError";
    this.reason = reason;
    this.status = status;
  }
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const validatedMemoryCache = new Map<string, CacheEntry<unknown>>();
let cacheStats = {
  hits: 0,
  writes: 0,
  poisonAttemptsBlocked: 0,
};

export function getCatalogCacheDiagnostics() {
  return {
    ...cacheStats,
    cachedKeys: Array.from(validatedMemoryCache.keys()),
  };
}

export function resetCatalogCacheForTests() {
  validatedMemoryCache.clear();
  cacheStats = { hits: 0, writes: 0, poisonAttemptsBlocked: 0 };
}

/**
 * Executes a loader function and caches the result ONLY if the loader resolves
 * with a valid non-empty value. If the loader throws CatalogUpstreamError (e.g.
 * HTTP 5xx, timeout, or HTTP 200 with empty [] array), the error is rethrown
 * BEFORE writing to either memory cache or Next.js Data Cache (unstable_cache).
 */
async function withNonPoisoningCache<T>(
  cacheKey: string,
  tags: string[],
  loader: () => Promise<T>,
  ttlSeconds = CATALOG_REVALIDATE_SECONDS
): Promise<T> {
  const now = Date.now();
  const existing = validatedMemoryCache.get(cacheKey) as
    | CacheEntry<T>
    | undefined;
  if (existing && existing.expiresAt > now) {
    cacheStats.hits += 1;
    return existing.value;
  }

  const runValidatedLoader = async (): Promise<T> => {
    try {
      const freshValue = await loader();
      validatedMemoryCache.set(cacheKey, {
        value: freshValue,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      cacheStats.writes += 1;
      return freshValue;
    } catch (err) {
      cacheStats.poisonAttemptsBlocked += 1;
      throw err;
    }
  };

  try {
    // Wrap in Next.js unstable_cache when inside the Next.js server runtime.
    // Because runValidatedLoader throws on empty/error, unstable_cache will NOT
    // store the rejected promise in Next.js ISR Data Cache.
    const nextCachedFn = unstable_cache(runValidatedLoader, [cacheKey], {
      revalidate: ttlSeconds,
      tags,
    });
    return await nextCachedFn();
  } catch (err) {
    // If unstable_cache is called outside Next.js request context (e.g. CLI verification script),
    // fall back to direct execution of runValidatedLoader which still enforces non-poisoning rules.
    if (
      err instanceof Error &&
      err.message.includes("incrementalCache missing")
    ) {
      return await runValidatedLoader();
    }
    throw err;
  }
}

function resolveAuthenticTourImage(tour: Record<string, unknown>): string {
  const images = Array.isArray(tour.images) ? (tour.images as string[]) : [];
  const rawImg =
    (typeof tour.image_url === "string" ? tour.image_url : "") ||
    images[0] ||
    "";
  const titleLower = String(tour.title || tour.name || "").toLowerCase();

  if (
    !rawImg ||
    rawImg.includes("1583422409516") ||
    rawImg.includes("1532403431143")
  ) {
    if (titleLower.includes("cappadocia") || titleLower.includes("balloon")) {
      return "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=85";
    }
    if (titleLower.includes("istanbul")) {
      return "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85";
    }
    return "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1200&q=85";
  }

  return rawImg;
}

function normalizeServerTour(raw: Record<string, unknown>): DemoTour {
  const destinationObj =
    raw.destination && typeof raw.destination === "object"
      ? (raw.destination as Record<string, unknown>)
      : undefined;
  const destName = String(
    destinationObj?.name ||
      raw.destination_name ||
      raw.city ||
      raw.location ||
      "Türkiye"
  );

  const priceAdult =
    typeof raw.price_adult === "number"
      ? raw.price_adult
      : parseFloat(String(raw.price_adult ?? raw.price ?? 0)) || 0;

  return {
    ...(raw as unknown as DemoTour),
    id: String(raw.id || ""),
    title: String(raw.title || raw.name || ""),
    name: String(raw.title || raw.name || ""),
    description: String(raw.description || ""),
    destination_id: String(raw.destination_id || ""),
    destination_name: destName,
    city: String(raw.city || destName),
    country: String(raw.country || "Türkiye"),
    location: destName.includes("Türkiye") ? destName : `${destName}, Türkiye`,
    price_adult: priceAdult,
    price: priceAdult,
    duration: Number(raw.duration ?? raw.duration_hours ?? 8),
    duration_hours: Number(raw.duration_hours ?? raw.duration ?? 8),
    max_participants: Number(raw.max_participants ?? raw.max_group_size ?? 12),
    max_group_size: Number(raw.max_group_size ?? raw.max_participants ?? 12),
    difficulty:
      (raw.difficulty as DemoTour["difficulty"]) ||
      (raw.difficulty_level as DemoTour["difficulty"]) ||
      "easy",
    image_url: resolveAuthenticTourImage(raw),
    highlights:
      Array.isArray(raw.includes) && raw.includes.length > 0
        ? (raw.includes as string[])
        : Array.isArray(raw.highlights)
          ? (raw.highlights as string[])
          : [],
  };
}

/**
 * Fetches tours from Express via API_INTERNAL_URL.
 * Uses `cache: "no-store"` on raw fetch so empty/error responses are never
 * cached by Next.js fetch cache; only validated non-empty lists are cached.
 */
async function fetchValidatedToursFromUpstream(): Promise<DemoTour[]> {
  const apiBase = getInternalApiBaseUrl();
  let res: Response;
  try {
    res = await fetch(`${apiBase}/api/tours`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
  } catch (err) {
    throw new CatalogUpstreamError(
      `Network error fetching ${apiBase}/api/tours: ${String(err)}`,
      "network_error"
    );
  }

  if (!res.ok) {
    throw new CatalogUpstreamError(
      `Upstream ${apiBase}/api/tours returned HTTP ${res.status}`,
      "http_error",
      res.status
    );
  }

  const json = await res.json();
  const rawList: Array<Record<string, unknown>> = Array.isArray(json?.tours)
    ? json.tours
    : Array.isArray(json)
      ? json
      : [];

  if (rawList.length === 0) {
    throw new CatalogUpstreamError(
      `Upstream ${apiBase}/api/tours returned an empty array [] — refusing to poison ISR cache`,
      "empty_payload",
      200
    );
  }

  const mapped = rawList.map(normalizeServerTour);
  const existingNames = new Set(mapped.map((t) => t.name.toLowerCase()));
  for (const demo of DEMO_TOURS) {
    if (mapped.length >= 6) break;
    if (!existingNames.has(demo.name.toLowerCase())) {
      mapped.push(demo);
    }
  }
  return mapped;
}

export async function getServerTours(): Promise<DemoTour[]> {
  if (isDemoMode()) {
    return DEMO_TOURS;
  }

  const apiBase = getInternalApiBaseUrl();
  try {
    return await withNonPoisoningCache(
      `catalog:tours:${apiBase}`,
      ["catalog-tours"],
      fetchValidatedToursFromUpstream
    );
  } catch {
    // Return fallback for this request ONLY without writing to cache
    return DEMO_TOURS;
  }
}

export async function getServerTourById(
  idOrSlug: string
): Promise<DemoTour | null> {
  const directDemo = DEMO_TOURS.find((t) => t.id === idOrSlug);
  if (directDemo || isDemoMode()) {
    return directDemo || DEMO_TOURS[0] || null;
  }

  const apiBase = getInternalApiBaseUrl();
  try {
    return await withNonPoisoningCache(
      `catalog:tour:${apiBase}:${idOrSlug}`,
      ["catalog-tours", `catalog-tour-${idOrSlug}`],
      async () => {
        let res: Response;
        try {
          res = await fetch(
            `${apiBase}/api/tours/${encodeURIComponent(idOrSlug)}`,
            {
              cache: "no-store",
              signal: AbortSignal.timeout(2500),
            }
          );
        } catch (err) {
          throw new CatalogUpstreamError(
            `Network error fetching tour ${idOrSlug}: ${String(err)}`,
            "network_error"
          );
        }

        if (!res.ok) {
          throw new CatalogUpstreamError(
            `Upstream tour ${idOrSlug} returned HTTP ${res.status}`,
            "http_error",
            res.status
          );
        }

        const json = await res.json();
        const tourData = json?.tour || json;
        if (!tourData || !tourData.id) {
          throw new CatalogUpstreamError(
            `Upstream tour ${idOrSlug} returned empty payload`,
            "empty_payload",
            200
          );
        }
        return normalizeServerTour(tourData);
      }
    );
  } catch {
    return directDemo || DEMO_TOURS[0] || null;
  }
}

async function fetchValidatedDestinationsFromUpstream(): Promise<Destination[]> {
  const apiBase = getInternalApiBaseUrl();
  let res: Response;
  try {
    res = await fetch(`${apiBase}/api/destinations?is_active=true`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
  } catch (err) {
    throw new CatalogUpstreamError(
      `Network error fetching ${apiBase}/api/destinations: ${String(err)}`,
      "network_error"
    );
  }

  if (!res.ok) {
    throw new CatalogUpstreamError(
      `Upstream ${apiBase}/api/destinations returned HTTP ${res.status}`,
      "http_error",
      res.status
    );
  }

  const json = await res.json();
  const rawList: Array<Record<string, unknown>> = Array.isArray(
    json?.destinations
  )
    ? json.destinations
    : Array.isArray(json)
      ? json
      : [];

  if (rawList.length === 0) {
    throw new CatalogUpstreamError(
      `Upstream ${apiBase}/api/destinations returned empty array [] — refusing to poison ISR cache`,
      "empty_payload",
      200
    );
  }

  const enriched: Destination[] = rawList.map((item) => {
    const lowerName = String(item.name || item.slug || "").toLowerCase();
    const matchedDemo = DEMO_DESTINATIONS.find(
      (d) =>
        (lowerName.includes("cappadocia") && d.id === "dest-cappadocia") ||
        (lowerName.includes("istanbul") && d.id === "dest-istanbul") ||
        (lowerName.includes("ephesus") && d.id === "dest-ephesus") ||
        (lowerName.includes("lycia") && d.id === "dest-lycia") ||
        (lowerName.includes("pamukkale") && d.id === "dest-pamukkale") ||
        (lowerName.includes("mardin") && d.id === "dest-mardin")
    );
    return {
      ...(matchedDemo || {}),
      ...(item as unknown as Destination),
      name: matchedDemo?.name || String(item.name || "Türkiye"),
      city: matchedDemo?.city || String(item.city || item.name || "Türkiye"),
      description: matchedDemo?.description || String(item.description || ""),
      image_url:
        matchedDemo?.image_url ||
        (typeof item.image_url === "string" ? item.image_url : undefined),
      coords:
        (typeof item.coords === "string" && item.coords) ||
        matchedDemo?.coords,
      best_time:
        (typeof item.best_time === "string" && item.best_time) ||
        matchedDemo?.best_time,
      activities:
        (typeof item.activities === "string" && item.activities) ||
        matchedDemo?.activities,
    };
  });

  const byKey = new Map<string, Destination>();
  for (const d of enriched) {
    byKey.set(d.name.toLowerCase(), d);
  }
  const ordered: Destination[] = [];
  for (const demo of DEMO_DESTINATIONS) {
    const match = byKey.get(demo.name.toLowerCase());
    ordered.push(match || demo);
    byKey.delete(demo.name.toLowerCase());
  }
  for (const extra of byKey.values()) {
    ordered.push(extra);
  }
  return ordered;
}

export async function getServerDestinations(): Promise<Destination[]> {
  if (isDemoMode()) {
    return DEMO_DESTINATIONS;
  }

  const apiBase = getInternalApiBaseUrl();
  try {
    return await withNonPoisoningCache(
      `catalog:destinations:${apiBase}`,
      ["catalog-destinations"],
      fetchValidatedDestinationsFromUpstream
    );
  } catch {
    // Return fallback for this request ONLY without writing to cache
    return DEMO_DESTINATIONS;
  }
}
