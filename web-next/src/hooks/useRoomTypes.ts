"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export const useRoomTypes = (tourId?: string) => {
  return useQuery({
    queryKey: ["room-types", tourId],
    queryFn: async () => {
      if (!tourId) return [];

      try {
        const response = await api.get(`/api/tours/${tourId}/room-types`);
        return response.data || [];
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch room types"
        );
      }
    },
    enabled: !!tourId,
    staleTime: 5 * 60 * 1000,
  });
};
