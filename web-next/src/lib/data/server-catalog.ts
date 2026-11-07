import { isDemoMode } from "@/config/site.config";
import {
  DEMO_DESTINATIONS,
  DEMO_TOURS,
  type DemoTour,
} from "@/lib/data/demo-content";
import type { Destination } from "@/hooks/useDestinations";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

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

export async function getServerTours(): Promise<DemoTour[]> {
  if (isDemoMode()) {
    return DEMO_TOURS;
  }

  try {
    const res = await fetch(`${API_BASE}/api/tours`, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return DEMO_TOURS;
    const json = await res.json();
    const rawList: Array<Record<string, unknown>> = Array.isArray(json?.tours)
      ? json.tours
      : Array.isArray(json)
        ? json
        : [];
    if (rawList.length === 0) return DEMO_TOURS;

    const mapped = rawList.map(normalizeServerTour);
    const existingNames = new Set(mapped.map((t) => t.name.toLowerCase()));
    for (const demo of DEMO_TOURS) {
      if (mapped.length >= 6) break;
      if (!existingNames.has(demo.name.toLowerCase())) {
        mapped.push(demo);
      }
    }
    return mapped;
  } catch {
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

  try {
    const res = await fetch(`${API_BASE}/api/tours/${encodeURIComponent(idOrSlug)}`, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return directDemo || DEMO_TOURS[0] || null;
    const json = await res.json();
    const tourData = json?.tour || json;
    if (!tourData || !tourData.id) return directDemo || DEMO_TOURS[0] || null;
    return normalizeServerTour(tourData);
  } catch {
    return directDemo || DEMO_TOURS[0] || null;
  }
}

export async function getServerDestinations(): Promise<Destination[]> {
  if (isDemoMode()) {
    return DEMO_DESTINATIONS;
  }

  try {
    const res = await fetch(`${API_BASE}/api/destinations?is_active=true`, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return DEMO_DESTINATIONS;
    const json = await res.json();
    const rawList: Array<Record<string, unknown>> = Array.isArray(
      json?.destinations
    )
      ? json.destinations
      : Array.isArray(json)
        ? json
        : [];
    if (rawList.length === 0) return DEMO_DESTINATIONS;

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
        description:
          matchedDemo?.description || String(item.description || ""),
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
  } catch {
    return DEMO_DESTINATIONS;
  }
}
