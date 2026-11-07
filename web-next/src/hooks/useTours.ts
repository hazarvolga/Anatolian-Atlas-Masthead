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
      return "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=85";
    }
    if (titleLower.includes("istanbul")) {
      return "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85";
    }
    return "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1200&q=85";
  }

  return rawImg;
}

function mapBackendTour(tour: any) {
  const metadataObj =
    tour.metadata && typeof tour.metadata === "object" ? tour.metadata : {};
  const destName =
    tour.destination?.name ||
    tour.destination_name ||
    metadataObj.city ||
    tour.city ||
    tour.location;
  const durationHours = tour.duration ?? tour.duration_hours ?? 8;

  return {
    ...tour,
    id: tour.slug || tour.id,
    name: tour.title || tour.name,
    duration: durationHours,
    duration_hours: durationHours,
    tour_type:
      metadataObj.tour_type ||
      tour.tour_type ||
      (durationHours >= 24 ? "multiple_day" : "one_day"),
    max_group_size: tour.max_participants || tour.max_group_size || 12,
    highlights:
      Array.isArray(tour.includes) && tour.includes.length > 0
        ? tour.includes
        : Array.isArray(tour.highlights)
          ? tour.highlights
          : [],
    included: Array.isArray(tour.includes) ? tour.includes : [],
    excluded: Array.isArray(tour.excludes) ? tour.excludes : [],
    itinerary: Array.isArray(metadataObj.itinerary)
      ? metadataObj.itinerary
      : Array.isArray(tour.itinerary)
        ? tour.itinerary
        : [],
    departure_location:
      metadataObj.departure_location || tour.departure_location || destName,
    departure_time: metadataObj.departure_time || tour.departure_time || "08:00",
    return_time: metadataObj.return_time || tour.return_time || "18:00",
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
          id: tour.destination?.slug || tour.destination_id,
          name: destName || "Türkiye",
          city: metadataObj.city || tour.city || destName || "Türkiye",
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

      const response = await api.get("/api/tours");
      const toursArray = Array.isArray(response.data?.tours)
        ? response.data.tours
        : Array.isArray(response.data)
          ? response.data
          : [];

      return toursArray.map(mapBackendTour);
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

      if (isDemoMode()) {
        return DEMO_TOURS.find((t) => t.id === id) || DEMO_TOURS[0] || null;
      }

      const response = await api.get(`/api/tours/${id}`);
      const data = response.data;
      return mapBackendTour(data);
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
