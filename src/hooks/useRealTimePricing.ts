import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface PricingData {
  basePrice: number;
  finalPrice: number;
  discount?: number;
  taxes?: number;
  fees?: number;
}

export const useRealTimePricing = (tourId?: string, adults = 1, children = 0, selectedDate?: Date) => {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tourId) return;

    const fetchPricing = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_BASE_URL}/api/tours/${tourId}/pricing`, {
          params: {
            adults,
            children,
            date: selectedDate?.toISOString()
          }
        });

        setPricing(response.data);
      } catch (err: any) {
        console.error('Error fetching pricing:', err);
        setError(err.response?.data?.message || 'Failed to fetch pricing');
        
        // Fallback: try to get basic tour price
        try {
          const tourResponse = await axios.get(`${API_BASE_URL}/api/tours/${tourId}`);
          const basePrice = tourResponse.data.price || 0;
          setPricing({
            basePrice,
            finalPrice: basePrice * (adults + children * 0.5),
          });
        } catch (fallbackErr) {
          console.error('Fallback pricing also failed:', fallbackErr);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, [tourId, adults, children, selectedDate]);

  return {
    pricing,
    isLoading,
    error,
    refetch: () => {
      if (tourId) {
        // Re-trigger the effect
        setIsLoading(true);
      }
    },
    // Legacy compatibility
    pricingData: pricing ? {
      pricing: {
        finalPrice: pricing.finalPrice,
        basePrice: pricing.basePrice
      }
    } : null,
    finalPrice: pricing?.finalPrice || 0,
    basePrice: pricing?.basePrice || 0,
    savings: 0
  };
};

export default useRealTimePricing;
