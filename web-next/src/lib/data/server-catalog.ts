import { revalidatePath, revalidateTag, unstable_cache } from "next/cache.js";
import { getInternalApiBaseUrl, isDemoMode } from "../../config/site.config.ts";
import {
  DEMO_DESTINATIONS,
  DEMO_TOURS,
  type DemoTour,
} from "./demo-content.ts";
import type { Destination } from "../../hooks/useDestinations.ts";

const CATALOG_REVALIDATE_SECONDS = 120;

export class CatalogUpstreamError extends Error {
  public readonly status: number;
  public readonly reason: "http_error" | "empty_payload" | "network_error";

  constructor(
    message: string,
    reason: "http_error" | "empty_payload" | "network_error",
    status = 503
  ) {
    super(message);
    this.name = "CatalogUpstreamError";
    this.reason = reason;
    this.status = status;
  }
}

export interface ServerCatalogResult<T> {
  data: T;
  upstreamError: boolean;
  status: 200 | 404 | 503;
  source: "live" | "demo" | "error";
  errorMessage?: string;
}

interface CacheEntry<T> {
  value: T;
  tags: string[];
  expiresAt: number;
}

const validatedMemoryCache = new Map<string, CacheEntry<unknown>>();
let cacheStats = {
  hits: 0,
  writes: 0,
  poisonAttemptsBlocked: 0,
  tagRevalidations: 0,
  lastRevalidatedTags: [] as string[],
};

export function getCatalogCacheDiagnostics() {
  return {
    ...cacheStats,
    cachedKeys: Array.from(validatedMemoryCache.keys()),
  };
}

export function resetCatalogCacheForTests() {
  validatedMemoryCache.clear();
  cacheStats = {
    hits: 0,
    writes: 0,
    poisonAttemptsBlocked: 0,
    tagRevalidations: 0,
    lastRevalidatedTags: [],
  };
}

/**
 * Purges both Next.js 16 ISR Data Cache (`revalidateTag(tag, { expire: 0 })`)
 * and the in-process validated cache for all entries matching any of `tags`.
 */
export function invalidateCatalogCacheByTags(
  tags: string[],
  paths: string[] = ["/", "/tours", "/destinations"]
) {
  const tagSet = new Set(tags);

  for (const [key, entry] of validatedMemoryCache.entries()) {
    if (entry.tags.some((t) => tagSet.has(t))) {
      validatedMemoryCache.delete(key);
    }
  }

  for (const tag of tagSet) {
    try {
      // Next.js 16 2-argument signature: immediate expiration on admin write
      revalidateTag(tag, { expire: 0 });
    } catch {
      // Outside Next.js request context (e.g., standalone Node test script)
    }
  }

  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      // Outside Next.js request context
    }
  }

  cacheStats.tagRevalidations += 1;
  cacheStats.lastRevalidatedTags = Array.from(tagSet);

  return {
    revalidated: true,
    tags: Array.from(tagSet),
    paths,
    tagRevalidations: cacheStats.tagRevalidations,
  };
}

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
        tags,
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
    const nextCachedFn = unstable_cache(runValidatedLoader, [cacheKey], {
      revalidate: ttlSeconds,
      tags,
    });
    return await nextCachedFn();
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("incrementalCache missing")
    ) {
      return await runValidatedLoader();
    }
    throw err;
  }
}

function normalizeServerTour(raw: Record<string, unknown>): DemoTour {
  const destinationObj =
    raw.destination && typeof raw.destination === "object"
      ? (raw.destination as Record<string, unknown>)
      : undefined;
  const metadataObj =
    raw.metadata && typeof raw.metadata === "object"
      ? (raw.metadata as Record<string, unknown>)
      : {};

  const destName = String(
    destinationObj?.name ||
      raw.destination_name ||
      metadataObj.city ||
      raw.city ||
      raw.location ||
      "Türkiye"
  );

  const city = String(
    metadataObj.city || raw.city || destinationObj?.name || "Türkiye"
  );

  const priceAdult =
    typeof raw.price_adult === "number"
      ? raw.price_adult
      : parseFloat(String(raw.price_adult ?? raw.price ?? 0)) || 0;

  const images = Array.isArray(raw.images) ? (raw.images as string[]) : [];
  const imageUrl =
    (typeof raw.image_url === "string" && raw.image_url) ||
    images[0] ||
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85";

  const durationHours = Number(raw.duration_hours ?? raw.duration ?? 8);
  const tourType =
    (metadataObj.tour_type as DemoTour["tour_type"]) ||
    (raw.tour_type as DemoTour["tour_type"]) ||
    (durationHours >= 24 ? "multiple_day" : "one_day");

  const itinerary = Array.isArray(metadataObj.itinerary)
    ? (metadataObj.itinerary as DemoTour["itinerary"])
    : Array.isArray(raw.itinerary)
      ? (raw.itinerary as DemoTour["itinerary"])
      : [];

  return {
    ...(raw as unknown as DemoTour),
    id: String(raw.slug || raw.id || ""),
    title: String(raw.title || raw.name || ""),
    name: String(raw.title || raw.name || ""),
    description: String(raw.description || ""),
    destination_id: String(
      destinationObj?.slug || raw.destination_id || ""
    ),
    destination_name: destName,
    city,
    country: String(raw.country || "Türkiye"),
    location: city.includes("Türkiye") ? city : `${city}, Türkiye`,
    price_adult: priceAdult,
    price: priceAdult,
    duration: durationHours,
    duration_hours: durationHours,
    tour_type: tourType,
    max_participants: Number(raw.max_participants ?? raw.max_group_size ?? 12),
    max_group_size: Number(raw.max_group_size ?? raw.max_participants ?? 12),
    difficulty:
      (raw.difficulty as DemoTour["difficulty"]) ||
      (raw.difficulty_level === 2
        ? "moderate"
        : raw.difficulty_level === 3
          ? "challenging"
          : "easy"),
    image_url: imageUrl,
    images: images.length > 0 ? images : [imageUrl],
    departure_location: String(
      metadataObj.departure_location || raw.departure_location || city
    ),
    departure_time: String(
      metadataObj.departure_time || raw.departure_time || "08:00"
    ),
    return_time: String(metadataObj.return_time || raw.return_time || "18:00"),
    itinerary,
    highlights:
      Array.isArray(raw.includes) && raw.includes.length > 0
        ? (raw.includes as string[])
        : Array.isArray(raw.highlights)
          ? (raw.highlights as string[])
          : [],
    included: Array.isArray(raw.includes) ? (raw.includes as string[]) : [],
    excluded: Array.isArray(raw.excludes) ? (raw.excludes as string[]) : [],
  };
}

function normalizeServerDestination(raw: Record<string, unknown>): Destination {
  const extraObj =
    raw.extra_info && typeof raw.extra_info === "object"
      ? (raw.extra_info as Record<string, unknown>)
      : {};
  const gallery = Array.isArray(raw.gallery_images)
    ? (raw.gallery_images as string[])
    : [];
  const activitiesArr = Array.isArray(raw.activities)
    ? (raw.activities as string[])
    : [];

  return {
    ...(raw as unknown as Destination),
    id: String(raw.slug || raw.id || ""),
    name: String(raw.name || "Türkiye"),
    city: String(raw.city || raw.name || "Türkiye"),
    country: String(raw.country || "Türkiye"),
    description: String(raw.description || ""),
    image_url:
      (typeof raw.image_url === "string" && raw.image_url) ||
      (typeof extraObj.image_url === "string" && extraObj.image_url) ||
      gallery[0] ||
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
    coords: typeof raw.coords === "string" ? raw.coords : undefined,
    best_time: typeof raw.best_time === "string" ? raw.best_time : undefined,
    activities:
      typeof raw.activities === "string"
        ? raw.activities
        : activitiesArr.join(", "),
    gallery_images: gallery,
    extra_info:
      typeof raw.extra_info === "string"
        ? raw.extra_info
        : typeof extraObj.note === "string"
          ? extraObj.note
          : undefined,
    is_active: raw.is_active !== false,
    created_at: String(raw.created_at || new Date().toISOString()),
    updated_at: String(raw.updated_at || new Date().toISOString()),
    _count: {
      tours: Number(
        (raw._count as Record<string, unknown>)?.tours ?? raw.tour_count ?? 1
      ),
    },
  };
}

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
      "network_error",
      503
    );
  }

  if (!res.ok) {
    throw new CatalogUpstreamError(
      `Upstream ${apiBase}/api/tours returned HTTP ${res.status}`,
      "http_error",
      res.status >= 500 ? 503 : res.status
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
      503
    );
  }

  // Strictly return ONLY real database tours — never append DEMO_TOURS in live mode
  return rawList.map(normalizeServerTour);
}

export async function getServerToursWithStatus(): Promise<
  ServerCatalogResult<DemoTour[]>
> {
  const apiBase = getInternalApiBaseUrl();
  try {
    const data = await withNonPoisoningCache(
      `catalog:tours:${apiBase}`,
      ["catalog-tours"],
      fetchValidatedToursFromUpstream
    );
    return {
      data,
      upstreamError: false,
      status: 200,
      source: "live",
    };
  } catch (err) {
    if (isDemoMode()) {
      return {
        data: DEMO_TOURS,
        upstreamError: false,
        status: 200,
        source: "demo",
      };
    }
    return {
      data: [],
      upstreamError: true,
      status: 503,
      source: "error",
      errorMessage:
        err instanceof Error
          ? err.message
          : "Catalogue upstream service unavailable (HTTP 503)",
    };
  }
}

/**
 * Returns tours array.
 * - When `NEXT_PUBLIC_DEMO_MODE === "true"`, returns DEMO_TOURS on upstream error.
 * - When in live mode (`NEXT_PUBLIC_DEMO_MODE !== "true"`), returns `[]` on error (NEVER fake demo tours).
 */
export async function getServerTours(): Promise<DemoTour[]> {
  const result = await getServerToursWithStatus();
  return result.data;
}

export async function getServerTourByIdWithStatus(
  idOrSlug: string
): Promise<ServerCatalogResult<DemoTour | null>> {
  const apiBase = getInternalApiBaseUrl();
  try {
    const data = await withNonPoisoningCache(
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
            "network_error",
            503
          );
        }

        if (res.status === 404) {
          throw new CatalogUpstreamError(
            `Tour ${idOrSlug} not found`,
            "http_error",
            404
          );
        }

        if (!res.ok) {
          throw new CatalogUpstreamError(
            `Upstream tour ${idOrSlug} returned HTTP ${res.status}`,
            "http_error",
            503
          );
        }

        const json = await res.json();
        const tourData = json?.tour || json;
        if (!tourData || (!tourData.id && !tourData.slug)) {
          throw new CatalogUpstreamError(
            `Upstream tour ${idOrSlug} returned empty payload`,
            "empty_payload",
            503
          );
        }
        return normalizeServerTour(tourData);
      }
    );
    return { data, upstreamError: false, status: 200, source: "live" };
  } catch (err) {
    if (isDemoMode()) {
      const match =
        DEMO_TOURS.find((t) => t.id === idOrSlug) || DEMO_TOURS[0] || null;
      return {
        data: match,
        upstreamError: false,
        status: match ? 200 : 404,
        source: "demo",
      };
    }
    const status =
      err instanceof CatalogUpstreamError && err.status === 404 ? 404 : 503;
    return {
      data: null,
      upstreamError: status === 503,
      status,
      source: "error",
      errorMessage:
        err instanceof Error
          ? err.message
          : "Upstream tour service unavailable (HTTP 503)",
    };
  }
}

export async function getServerTourById(
  idOrSlug: string
): Promise<DemoTour | null> {
  const res = await getServerTourByIdWithStatus(idOrSlug);
  return res.data;
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
      "network_error",
      503
    );
  }

  if (!res.ok) {
    throw new CatalogUpstreamError(
      `Upstream ${apiBase}/api/destinations returned HTTP ${res.status}`,
      "http_error",
      503
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
      503
    );
  }

  // Strictly return ONLY real database destinations in live mode
  return rawList.map(normalizeServerDestination);
}

export async function getServerDestinationsWithStatus(): Promise<
  ServerCatalogResult<Destination[]>
> {
  const apiBase = getInternalApiBaseUrl();
  try {
    const data = await withNonPoisoningCache(
      `catalog:destinations:${apiBase}`,
      ["catalog-destinations"],
      fetchValidatedDestinationsFromUpstream
    );
    return {
      data,
      upstreamError: false,
      status: 200,
      source: "live",
    };
  } catch (err) {
    if (isDemoMode()) {
      return {
        data: DEMO_DESTINATIONS,
        upstreamError: false,
        status: 200,
        source: "demo",
      };
    }
    return {
      data: [],
      upstreamError: true,
      status: 503,
      source: "error",
      errorMessage:
        err instanceof Error
          ? err.message
          : "Destinations upstream service unavailable (HTTP 503)",
    };
  }
}

export async function getServerDestinations(): Promise<Destination[]> {
  const res = await getServerDestinationsWithStatus();
  return res.data;
}
