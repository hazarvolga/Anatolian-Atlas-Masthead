import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface PricingBreakdownItem {
  item: string;
  price: number;
}

interface PricingData {
  total: number;
  deposit: number;
  breakdown: PricingBreakdownItem[];
  roomPrices: Record<string, number>;
  basePrice: number;
  finalPrice: number;
}

export const useRealTimePricing = (
  tourId?: string,
  checkInDate?: Date,
  checkOutDate?: Date,
  _rooms: any[] = [],
  _addOns: string[] = [],
  adults = 1,
  children = 0
) => {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tourId) {
      setPricing(null);
      return;
    }

    let cancelled = false;

    const fetchPricing = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/tours/${tourId}`);
        if (cancelled) return;

        const adultCount = Math.max(0, adults);
        const childCount = Math.max(0, children);
        const adultPrice = Number(data.price_adult) || 0;
        const childPrice = data.price_child != null ? Number(data.price_child) : adultPrice;

        const breakdown: PricingBreakdownItem[] = [
          {
            item: `${adultCount} Adult${adultCount === 1 ? '' : 's'}`,
            price: adultPrice * adultCount,
          },
        ];
        if (childCount > 0) {
          breakdown.push({
            item: `${childCount} Child${childCount === 1 ? '' : 'ren'}`,
            price: childPrice * childCount,
          });
        }

        const total = breakdown.reduce((sum, item) => sum + item.price, 0);

        setPricing({
          total,
          deposit: total * 0.2,
          breakdown,
          roomPrices: {},
          basePrice: adultPrice,
          finalPrice: total,
        });
      } catch (err: any) {
        if (cancelled) return;
        console.error('Error fetching tour pricing:', err);
        setError(err.response?.data?.message || 'Failed to fetch pricing');
        setPricing(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchPricing();

    return () => {
      cancelled = true;
    };
  }, [tourId, adults, children]);

  const totalNights =
    checkInDate && checkOutDate
      ? Math.max(
          0,
          Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        )
      : 0;

  return {
    pricing,
    isLoading,
    error,
    refetch: () => setError(null),
    totalNights,
    totalGuests: adults + children,
    // Legacy compatibility
    pricingData: pricing
      ? {
          pricing: {
            finalPrice: pricing.finalPrice,
            basePrice: pricing.basePrice,
          },
        }
      : null,
    finalPrice: pricing?.finalPrice || 0,
    basePrice: pricing?.basePrice || 0,
    savings: 0,
  };
};

export default useRealTimePricing;
