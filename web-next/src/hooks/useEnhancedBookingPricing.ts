"use client";


import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { usePricingData } from "./usePricingData";
import { calculatePricingBreakdown } from "@/utils/pricingCalculations";
import { UseEnhancedBookingPricingProps, PricingCustomer } from "@/types/pricing";

export const useEnhancedBookingPricing = ({
  tourId,
  selectedDate,
  customers
}: UseEnhancedBookingPricingProps) => {
  const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const customersKey = JSON.stringify(customers.map(c => ({ 
    type: c.type, 
    count: c.count, 
    accommodationType: c.accommodationType || 'none' 
  })));
  
  console.log('🔍 Enhanced Pricing Debug - Input:', { 
    tourId, 
    dateKey, 
    customers,
    customersLength: customers.length 
  });

  // Fetch all pricing data
  const { data: pricingData, isFetching, refetch, error } = usePricingData(tourId);

  // Show loading only when we need pricing data and user has made selections
  const hasUserSelections = !!tourId && customers.length > 0 && customers.some(c => c.count > 0);
  const loading = isFetching && hasUserSelections;

  // Log any query errors with detailed info
  if (error) {
    console.error('💥 Enhanced pricing query error:', {
      error: error.message,
      tourId,
      customersLength: customers.length,
      stack: error.stack
    });
  }

  const { 
    tourPricing = [], 
    seasonalPricing = [], 
    groupDiscounts = [],
    baseTourPrice = 0
  } = pricingData || {};

  console.log('📋 Current pricing state:', {
    tourPricing: tourPricing.length,
    seasonalPricing: seasonalPricing.length,
    groupDiscounts: groupDiscounts.length,
    baseTourPrice,
    loading,
    isFetching,
    hasUserSelections,
    error: error?.message
  });

  // Calculate pricing breakdown - always try to calculate if we have data
  const pricingBreakdown = useMemo(() => {
    // Need at least tour ID and customers with counts
    if (!tourId || customers.length === 0 || !customers.some(c => c.count > 0)) {
      console.log('⚠️ Missing required data for pricing calculation');
      return [];
    }

    // We can calculate pricing even without a selected date (for preview purposes)
    // Use current date as fallback for seasonal calculations
    const calculationDate = selectedDate || new Date();
    
    // We need either configured pricing OR base tour price as fallback
    if (tourPricing.length === 0 && baseTourPrice === 0) {
      console.log('⚠️ No pricing data available (neither configured nor base price)');
      return [];
    }

    console.log('🧮 Calculating pricing breakdown with:', {
      tourId,
      calculationDate,
      customers: customers.filter(c => c.count > 0),
      hasPricingData: pricingData !== null,
      tourPricingRecords: tourPricing.length,
      baseTourPrice
    });

    return calculatePricingBreakdown(tourId, calculationDate, customers, pricingData);
  }, [tourId, selectedDate, customers, pricingData, tourPricing.length, baseTourPrice]);

  const totalPrice = pricingBreakdown.reduce((sum, breakdown) => sum + breakdown.totalPrice, 0);
  const totalDiscount = pricingBreakdown.reduce((sum, breakdown) => sum + breakdown.groupDiscount, 0);
  const totalSeasonalAdjustment = pricingBreakdown.reduce((sum, breakdown) => sum + breakdown.seasonalAdjustment, 0);

  // Enhanced pricing availability detection
  const hasPricingData = (tourPricing.length > 0 || baseTourPrice > 0) && pricingBreakdown.length > 0;

  console.log('📊 Final pricing summary:', {
    pricingBreakdown: pricingBreakdown.length,
    totalPrice,
    totalDiscount,
    totalSeasonalAdjustment,
    hasPricingData,
    hasConfiguredPricing: tourPricing.length > 0,
    hasFallbackPricing: baseTourPrice > 0,
    loading,
    hasUserSelections,
    error: error?.message
  });

  return {
    pricingBreakdown,
    totalPrice,
    totalDiscount,
    totalSeasonalAdjustment,
    loading,
    hasPricingData,
    refetch,
    error,
  };
};
