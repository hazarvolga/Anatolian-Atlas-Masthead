
import { useRealTimePricing } from "@/hooks/useRealTimePricing";

export const useBookingPricing = (
  selectedTourId: string,
  checkInDate?: Date,
  checkOutDate?: Date,
  rooms: any[] = [],
  addOns: string[] = [],
  adults: number = 1,
  children: number = 0
) => {
  // Ensure we always have at least 1 adult
  const effectiveAdults = Math.max(1, adults);
  
  const { pricing, isLoading: pricingLoading, totalNights, totalGuests } = useRealTimePricing(
    selectedTourId,
    checkInDate,
    checkOutDate,
    rooms,
    addOns,
    effectiveAdults,
    children
  );

  console.log('useBookingPricing - Pricing calculation inputs:', {
    selectedTourId,
    checkInDate: !!checkInDate,
    effectiveAdults,
    children,
    totalGuests,
    pricing
  });

  return {
    pricing,
    pricingLoading,
    totalNights,
    totalGuests,
    effectiveAdults,
  };
};
