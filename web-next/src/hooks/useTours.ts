"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { isDemoMode } from "@/config/site";
import { DEMO_TOURS } from "@/lib/data/demo-content";

function resolveAuthenticTourImage(tour: any): string {
  const rawImg =
    tour.image_url ||
    (Array.isArray(tour.images) && tour.images.length > 0
      ? tour.images[0]
      : "");
  const titleLower = (tour.title || tour.name || "").toLowerCase();

  // Replace non-Türkiye or broken stock IDs from legacy seed
  if (
    !rawImg ||
    rawImg.includes("1583422409516") ||
    rawImg.includes("1532403431143")
  ) {
    if (titleLower.includes("cappadocia") || titleLower.includes("balloon")) {
      return "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1200&q=85";
    }
    if (titleLower.includes("istanbul")) {
      return "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85";
    }
    return "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1200&q=85";
  }

  return rawImg;
}

function mapBackendTour(tour: any) {
  const destName =
    tour.destination?.name ||
    tour.destination_name ||
    tour.city ||
    tour.location;

  return {
    ...tour,
    name: tour.title || tour.name,
    duration: tour.duration ?? tour.duration_hours ?? 8,
    max_group_size: tour.max_participants || tour.max_group_size || 12,
    highlights:
      Array.isArray(tour.includes) && tour.includes.length > 0
        ? tour.includes
        : Array.isArray(tour.highlights)
          ? tour.highlights
          : [],
    rating:
      typeof tour.rating === "number" && tour.rating > 0
        ? tour.rating
        : undefined,
    difficulty: tour.difficulty || tour.difficulty_level || "easy",
    location: destName ? `${destName}, Türkiye` : "Türkiye",
    price:
      typeof tour.price_adult === "number"
        ? tour.price_adult
        : parseFloat(tour.price_adult ?? tour.price) || 0,
    image_url: resolveAuthenticTourImage(tour),
    destinations: tour.destination_id
      ? {
          id: tour.destination_id,
          name: destName || "Türkiye",
          city: tour.city || destName || "Türkiye",
          country: tour.country || "Türkiye",
        }
      : tour.destinations,
  };
}

export const useTours = () => {
  return useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      if (isDemoMode()) {
        return DEMO_TOURS;
      }

      try {
        const response = await api.get("/api/tours");
        const toursArray = Array.isArray(response.data?.tours)
          ? response.data.tours
          : Array.isArray(response.data)
            ? response.data
            : [];

        if (toursArray.length === 0) {
          return DEMO_TOURS;
        }

        const mapped = toursArray.map(mapBackendTour);
        // Append curated Anatolian Atlas regional tours so all 6 regions are represented
        const combined = [...mapped];
        for (const demoTour of DEMO_TOURS) {
          if (!combined.some((t) => t.id === demoTour.id)) {
            combined.push(demoTour);
          }
        }
        return combined;
      } catch {
        return DEMO_TOURS;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => (Array.isArray(data) ? data : []),
  });
};

export const useTour = (id: string) => {
  return useQuery({
    queryKey: ["tour", id],
    queryFn: async () => {
      if (!id) return null;

      const demoMatch = DEMO_TOURS.find((t) => t.id === id);
      if (demoMatch) {
        return demoMatch;
      }

      try {
        const response = await api.get(`/api/tours/${id}`);
        const data = response.data;
        return {
          ...data,
          image_url: resolveAuthenticTourImage(data),
          images: [resolveAuthenticTourImage(data)],
        };
      } catch (error: any) {
        if (demoMatch) {
          return demoMatch;
        }
        throw new Error(
          error.response?.data?.message || "Failed to fetch tour"
        );
      }
    },
    enabled: !!id,
  });
};

export const useTourAvailability = (tourId?: string) => {
  return useQuery({
    queryKey: ["tour-availability", tourId],
    queryFn: async () => {
      if (!tourId) return [];

      const demoMatch = DEMO_TOURS.find((t) => t.id === tourId);
      if (!isDemoMode() && !demoMatch) {
        try {
          const response = await api.get(`/api/tours/${tourId}/availability`);
          if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data;
          }
        } catch {
          // Fall back to deterministic availability schedule below
        }
      }

      const maxSpots = demoMatch?.max_participants ?? 12;
      const today = new Date();
      return Array.from({ length: 45 }, (_, idx) => {
        const d = new Date(today);
        d.setDate(today.getDate() + idx + 1);
        const dateStr = d.toISOString().split("T")[0];
        return {
          id: `${tourId}-${dateStr}`,
          tour_id: tourId,
          available_date: dateStr,
          available_spots: maxSpots,
          is_available: true,
        };
      });
    },
    enabled: !!tourId,
    select: (data) => (Array.isArray(data) ? data : []),
  });
};
