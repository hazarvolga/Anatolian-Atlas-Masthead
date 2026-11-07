"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export const usePromotionalCode = (code?: string, tourId?: string) => {
  return useQuery({
    queryKey: ["promotional-code", code, tourId],
    queryFn: async () => {
      if (!code) return null;

      try {
        const response = await api.get("/api/promotional-codes/validate", {
          params: { code: code.toUpperCase(), tourId },
        });
        return response.data;
      } catch {
        return null;
      }
    },
    enabled: !!code && code.length > 0,
    retry: 1,
  });
};
