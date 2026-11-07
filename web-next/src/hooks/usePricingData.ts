"use client";

import { useQuery } from "@tanstack/react-query";
import { PricingData } from "@/types/pricing";
import { api } from "@/lib/api/client";

export const usePricingData = (tourId?: string) => {
  return useQuery({
    queryKey: ["tour-pricing-data", tourId],
    enabled: !!tourId,
    retry: 2,
    staleTime: 1000 * 60 * 2,
    queryFn: async (): Promise<PricingData | null> => {
      if (!tourId) {
        return null;
      }

      try {
        const response = await api.get(`/api/tours/${tourId}/pricing-data`);
        const data = response.data;

        const result: PricingData = {
          tourPricing: data.tourPricing || [],
          seasonalPricing: (data.seasonalPricing || []).map((item: any) => ({
            ...item,
            adjustment_type: item.adjustment_type as "percentage" | "fixed",
          })),
          groupDiscounts: (data.groupDiscounts || []).map((item: any) => ({
            ...item,
            discount_type: item.discount_type as "percentage" | "fixed",
          })),
          baseTourPrice: data.baseTourPrice || 0,
        };

        return result;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch pricing data"
        );
      }
    },
  });
};
