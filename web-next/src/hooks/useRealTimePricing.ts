"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { isDemoMode } from "@/config/site";
import { DEMO_TOURS } from "@/lib/data/demo-content";

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

function buildPricingFromRates(
  adultPrice: number,
  childPrice: number,
  adults: number,
  children: number
): PricingData {
  const adultCount = Math.max(0, adults);
  const childCount = Math.max(0, children);
  const breakdown: PricingBreakdownItem[] = [
    {
      item: `${adultCount} Adult${adultCount === 1 ? "" : "s"}`,
      price: adultPrice * adultCount,
    },
  ];
  if (childCount > 0) {
    breakdown.push({
      item: `${childCount} Child${childCount === 1 ? "" : "ren"}`,
      price: childPrice * childCount,
    });
  }
  const total = breakdown.reduce((sum, item) => sum + item.price, 0);
  return {
    total,
    deposit: Math.round(total * 0.2 * 100) / 100,
    breakdown,
    roomPrices: {},
    basePrice: adultPrice,
    finalPrice: total,
  };
}

export const useRealTimePricing = (
  tourId?: string,
  checkInDate?: Date,
  checkOutDate?: Date,
  _rooms: unknown[] = [],
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
    const demoMatch = DEMO_TOURS.find((t) => t.id === tourId);

    const fetchPricing = async () => {
      setIsLoading(true);
      setError(null);

      if (isDemoMode() && demoMatch) {
        setPricing(
          buildPricingFromRates(
            demoMatch.price_adult,
            demoMatch.price_child,
            adults,
            children
          )
        );
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/api/tours/${tourId}`);
        if (cancelled) return;

        const adultPrice = Number(data.price_adult ?? data.price) || 0;
        const childPrice =
          data.price_child != null ? Number(data.price_child) : adultPrice;

        setPricing(
          buildPricingFromRates(adultPrice, childPrice, adults, children)
        );
      } catch (err: unknown) {
        if (cancelled) return;
        if (demoMatch) {
          setPricing(
            buildPricingFromRates(
              demoMatch.price_adult,
              demoMatch.price_child,
              adults,
              children
            )
          );
          return;
        }
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to fetch pricing";
        setError(message);
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
          Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  return {
    pricing,
    isLoading,
    error,
    refetch: () => setError(null),
    totalNights,
    totalGuests: adults + children,
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
