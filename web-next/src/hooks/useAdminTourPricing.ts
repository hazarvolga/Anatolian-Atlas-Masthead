"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { TourPricing, TourTimeSlot, SeasonalPricing } from "@/types/tour";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface UseAdminTourPricingProps {
  tour?: any;
}

export const useAdminTourPricing = ({ tour }: UseAdminTourPricingProps) => {
  const [tourPricing, setTourPricing] = useState<TourPricing[]>([]);
  const [timeSlots, setTimeSlots] = useState<TourTimeSlot[]>([]);
  const [seasonalPricing, setSeasonalPricing] = useState<SeasonalPricing[]>([]);
  const [groupDiscounts, setGroupDiscounts] = useState<any[]>([]);

  useEffect(() => {
    if (tour?.id) {
      loadExistingPricingData(tour.id);
    }
  }, [tour?.id]);

  const loadExistingPricingData = async (tourId: string) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/tours/${tourId}/pricing-data`, { headers: getAuthHeaders() });
      
      // Map the response to our expected format
      setTourPricing(data.tourPricing || []);
      setTimeSlots(data.timeSlots || []);
      setSeasonalPricing(data.seasonalPricing || []);
      setGroupDiscounts(data.groupDiscounts || []);
    } catch (error) {
      console.error('Error loading pricing data:', error);
    }
  };

  const savePricingData = async (tourId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/tours/${tourId}/pricing-data`, {
        tourPricing,
        timeSlots,
        seasonalPricing,
        groupDiscounts,
      }, { headers: getAuthHeaders() });

      await loadExistingPricingData(tourId);
    } catch (error) {
      console.error('Error saving pricing data:', error);
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
