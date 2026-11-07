"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export const useTourAddOns = (tourId?: string) => {
  return useQuery({
    queryKey: ["tour-add-ons", tourId],
    queryFn: async () => {
      if (!tourId) return [];

      try {
        const response = await api.get(`/api/tours/${tourId}/add-ons`);
        return response.data || [];
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch tour add-ons"
        );
      }
    },
    enabled: !!tourId,
    staleTime: 5 * 60 * 1000,
  });
};
