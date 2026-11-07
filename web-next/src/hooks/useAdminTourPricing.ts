"use client";

import { useState, useEffect, useCallback } from "react";
import { TourPricing, TourTimeSlot, SeasonalPricing } from "@/types/tour";
import { api } from "@/lib/api/client";

interface UseAdminTourPricingProps {
  tour?: any;
}

export const useAdminTourPricing = ({ tour }: UseAdminTourPricingProps) => {
  const [tourPricing, setTourPricing] = useState<TourPricing[]>([]);
  const [timeSlots, setTimeSlots] = useState<TourTimeSlot[]>([]);
  const [seasonalPricing, setSeasonalPricing] = useState<SeasonalPricing[]>([]);
  const [groupDiscounts, setGroupDiscounts] = useState<any[]>([]);

  const loadExistingPricingData = useCallback(async (tourId: string) => {
    try {
      const { data } = await api.get(
        `/api/admin/tours/${tourId}/pricing-data`
      );

      setTourPricing(data.tourPricing || []);
      setTimeSlots(data.timeSlots || []);
      setSeasonalPricing(data.seasonalPricing || []);
      setGroupDiscounts(data.groupDiscounts || []);
    } catch (error) {
      console.error("Error loading pricing data:", error);
    }
  }, []);

  useEffect(() => {
    if (tour?.id) {
      loadExistingPricingData(tour.id);
    }
  }, [tour?.id, loadExistingPricingData]);

  const savePricingData = async (tourId: string) => {
    try {
      await api.put(`/api/admin/tours/${tourId}/pricing-data`, {
        tourPricing,
        timeSlots,
        seasonalPricing,
        groupDiscounts,
      });

      await loadExistingPricingData(tourId);
    } catch (error) {
      console.error("Error saving pricing data:", error);
      throw error;
    }
  };

  return {
    tourPricing,
    timeSlots,
    seasonalPricing,
    groupDiscounts,
    setTourPricing,
    setTimeSlots,
    setSeasonalPricing,
    setGroupDiscounts,
    savePricingData,
  };
};
