"use client";


import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PricingData } from "@/types/pricing";

export const usePricingData = (tourId?: string) => {
  return useQuery({
    queryKey: ["tour-pricing-data", tourId],
    enabled: !!tourId,
    retry: 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
    queryFn: async (): Promise<PricingData | null> => {
      if (!tourId) {
        console.warn('❌ No tourId provided for pricing query');
        return null;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

      console.log('🔍 Fetching pricing data for tour:', tourId);
      
      try {
        // Fetch all pricing data for the tour from a single backend endpoint
        const response = await axios.get(`${API_BASE_URL}/api/tours/${tourId}/pricing-data`);
        const data = response.data;

        const result: PricingData = {
          tourPricing: data.tourPricing || [],
          seasonalPricing: (data.seasonalPricing || []).map((item: any) => ({
            ...item,
            adjustment_type: item.adjustment_type as 'percentage' | 'fixed'
          })),
          groupDiscounts: (data.groupDiscounts || []).map((item: any) => ({
            ...item,
            discount_type: item.discount_type as 'percentage' | 'fixed'
          })),
          baseTourPrice: data.baseTourPrice || 0
        };

        console.log('✅ Final fetched pricing data:', {
          ...result,
          hasTourPricing: result.tourPricing.length > 0,
          hasSeasonalPricing: result.seasonalPricing.length > 0,
          hasGroupDiscounts: result.groupDiscounts.length > 0
        });
        
        return result;
      } catch (error: any) {
        console.error('💥 Error in pricing query function:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch pricing data');
      }
    }
  });
};
