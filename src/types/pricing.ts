
export interface PricingCustomer {
  type: 'adult' | 'child' | 'baby';
  count: number;
  accommodationType?: 'single' | 'double' | 'shared' | 'none';
}

export interface PricingBreakdown {
  basePrice: number;
  accommodationPrice: number;
  seasonalAdjustment: number;
  groupDiscount: number;
  totalPrice: number;
  discountReason?: string;
  customer: PricingCustomer;
}

export interface PricingData {
  tourPricing: any[];
  seasonalPricing: any[];
  groupDiscounts: any[];
  baseTourPrice: number;
}

export interface UseEnhancedBookingPricingProps {
  tourId?: string;
  selectedDate?: Date;
  customers: PricingCustomer[];
}
