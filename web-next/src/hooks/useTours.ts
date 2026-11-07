"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { isDemoMode } from "@/config/site";
import { DEMO_TOURS } from "@/lib/data/demo-content";

function mapBackendTour(tour: any) {
  return {
    ...tour,
    name: tour.title || tour.name,
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
    difficulty: tour.difficulty || "easy",
    location:
      tour.destination_name ||
      (tour.city ? `${tour.city}, ${tour.country || "Türkiye"}` : undefined) ||
      tour.location ||
      "Türkiye",
    price:
      typeof tour.price_adult === "number"
        ? tour.price_adult
        : parseFloat(tour.price_adult ?? tour.price) || 0,
    image_url:
      tour.image_url ||
      (Array.isArray(tour.images) && tour.images.length > 0
        ? tour.images[0]
        : undefined),
    destinations: tour.destination_id
      ? {
          id: tour.destination_id,
          name: tour.destination_name,
          city: tour.city,
          country: tour.country,
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

        return toursArray.map(mapBackendTour);
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
      if (isDemoMode() && demoMatch) {
        return demoMatch;
      }

      try {
        const response = await api.get(`/api/tours/${id}`);
        return response.data;
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
      } else if (!isDemoMode()) {
        try {
          const response = await api.get(`/api/tours/${tourId}/availability`);
          if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data;
          }
        } catch {
          // Fall back to deterministic availability schedule below
        }
      }

      // Deterministic availability schedule for next 45 days
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
