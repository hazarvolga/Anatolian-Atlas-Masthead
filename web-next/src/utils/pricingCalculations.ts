import { format } from "date-fns";
import { PricingCustomer, PricingBreakdown, PricingData } from "@/types/pricing";

export const calculateCustomerPrice = (
  customer: PricingCustomer,
  tourPricing: any[],
  baseTourPrice: number
): number => {
  const accommodationType = customer.accommodationType || 'none';
  
  // Find exact pricing match first
  let basePricing = tourPricing.find(
    p => p.customer_type === customer.type && 
    p.accommodation_type === accommodationType
  );

  // If no exact match, try without accommodation constraint
  if (!basePricing) {
    basePricing = tourPricing.find(p => 
      p.customer_type === customer.type && 
      (p.accommodation_type === 'none' || !p.accommodation_type)
    );
  }

  // If still no match, get any pricing for this customer type
  if (!basePricing) {
    basePricing = tourPricing.find(p => p.customer_type === customer.type);
  }

  // Use configured pricing if available
  if (basePricing) {
    return basePricing.base_price;
  }

  // Fallback to base tour price with customer type and accommodation multipliers
  if (baseTourPrice > 0) {
    console.log(`📍 Using fallback pricing for ${customer.type} with ${accommodationType} accommodation based on base tour price:`, baseTourPrice);
    
    let basePrice = baseTourPrice;
    
    // Apply customer type multipliers
    switch (customer.type) {
      case 'adult':
        basePrice = baseTourPrice;
        break;
      case 'child':
        basePrice = baseTourPrice * 0.7; // 30% discount for children
        break;
      case 'baby':
        basePrice = 0; // Free for babies
        break;
      default:
        basePrice = baseTourPrice;
    }

    // Apply accommodation multipliers
    switch (accommodationType) {
      case 'single':
        basePrice = basePrice * 1.5; // 50% surcharge for single room
        break;
      case 'double':
        basePrice = basePrice * 1.2; // 20% surcharge for double room
        break;
      case 'shared':
        basePrice = basePrice * 1.1; // 10% surcharge for shared room
        break;
      case 'none':
      default:
        // No accommodation surcharge
        break;
    }

    console.log(`💰 Final calculated price for ${customer.type} with ${accommodationType}:`, basePrice);
    return basePrice;
  }

  return 0;
};

export const calculateSeasonalAdjustment = (
  customer: PricingCustomer,
  basePrice: number,
  seasonalPricing: any[],
  dateStr: string
): number => {
  const applicableSeasonalPricing = seasonalPricing.find(
    sp => sp.customer_type === customer.type &&
    sp.start_date <= dateStr &&
    sp.end_date >= dateStr
  );

  if (!applicableSeasonalPricing) return 0;

  if (applicableSeasonalPricing.adjustment_type === 'percentage') {
    return basePrice * (applicableSeasonalPricing.price_adjustment / 100);
  } else {
    return applicableSeasonalPricing.price_adjustment * customer.count;
  }
};

export const calculateGroupDiscount = (
  customer: PricingCustomer,
  basePrice: number,
  groupDiscounts: any[],
  totalCustomers: number
): { discount: number; reason: string } => {
  const applicableDiscount = groupDiscounts.find(
    gd => gd.customer_type === customer.type &&
    gd.min_group_size <= totalCustomers &&
    (!gd.max_group_size || gd.max_group_size >= totalCustomers)
  );

  if (!applicableDiscount) {
    return { discount: 0, reason: '' };
  }

  let groupDiscount = 0;
  if (applicableDiscount.discount_type === 'percentage') {
    groupDiscount = basePrice * (applicableDiscount.discount_percentage / 100);
  } else {
    groupDiscount = applicableDiscount.discount_amount * customer.count;
  }

  const discountReason = applicableDiscount.discount_reason || 'group_size';
  return { discount: groupDiscount, reason: discountReason };
};

export const calculatePricingBreakdown = (
  tourId: string,
  selectedDate: Date,
  customers: PricingCustomer[],
  pricingData: PricingData
): PricingBreakdown[] => {
  if (!tourId || !selectedDate || customers.length === 0) {
    console.log('⚠️ Missing data for pricing calculation:', { 
      tourId: !!tourId, 
      selectedDate: !!selectedDate, 
      customersLength: customers.length
    });
    return [];
  }

  const { tourPricing, seasonalPricing, groupDiscounts, baseTourPrice } = pricingData;
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const totalCustomers = customers.reduce((sum, c) => sum + c.count, 0);

  console.log('🧮 Calculating pricing breakdown:', { 
    dateStr, 
    totalCustomers, 
    customers, 
    tourPricingRecords: tourPricing.length,
    baseTourPrice
  });

  // If no configured pricing but we have base price, create fallback pricing breakdown
  if (tourPricing.length === 0 && baseTourPrice > 0) {
    console.log('💡 Using fallback pricing calculation with base tour price:', baseTourPrice);
  }

  return customers.filter(customer => customer.count > 0).map((customer): PricingBreakdown => {
    const accommodationType = customer.accommodationType || 'none';
    
    const customerPrice = calculateCustomerPrice(customer, tourPricing, baseTourPrice);
    
    console.log(`💰 Pricing for ${customer.count}x ${customer.type} (${accommodationType}):`, {
      customerPrice,
      usingFallback: tourPricing.length === 0 && baseTourPrice > 0
    });

    const basePrice = customerPrice * customer.count;

    // Calculate seasonal adjustment
    const seasonalAdjustment = calculateSeasonalAdjustment(
      customer, 
      basePrice, 
      seasonalPricing, 
      dateStr
    );

    if (seasonalAdjustment !== 0) {
      console.log(`🌟 Seasonal adjustment for ${customer.type}:`, seasonalAdjustment);
    }

    // Calculate group discount
    const { discount: groupDiscount, reason: discountReason } = calculateGroupDiscount(
      customer,
      basePrice,
      groupDiscounts,
      totalCustomers
    );

    if (groupDiscount > 0) {
      console.log(`🎯 Group discount for ${customer.type}:`, groupDiscount);
    }

    const totalCustomerPrice = Math.max(0, basePrice + seasonalAdjustment - groupDiscount);

    console.log(`✅ Final calculation for ${customer.type} with ${accommodationType}:`, {
      basePrice,
      seasonalAdjustment,
      groupDiscount,
      totalCustomerPrice
    });

    return {
      customer,
      basePrice,
      accommodationPrice: 0, // Already included in base price
      seasonalAdjustment,
      groupDiscount,
      totalPrice: totalCustomerPrice,
      discountReason: groupDiscount > 0 ? discountReason : undefined
    };
  });
};
