"use client";


import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicTourInfo from "./BasicTourInfo";
import TourHighlights from "./TourHighlights";
import TourInclusions from "./TourInclusions";
import TourPricingManager from "../TourPricingManager";
import TourTimeSlotsManager from "../TourTimeSlotsManager";
import SeasonalPricingManager from "../SeasonalPricingManager";
import GroupSizeDiscountManager from "../GroupSizeDiscountManager";
import { UseFormReturn } from "react-hook-form";
import { TourFormData } from "@/hooks/useAdminTourForm";

interface TourFormTabsProps {
  form: UseFormReturn<TourFormData>;
  tour?: any;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  highlights: string[];
  included: string[];
  excluded: string[];
  benefits: string[];
  itinerary: Array<{ day: number; title: string; description: string; }>;
  onHighlightsChange: (highlights: string[]) => void;
  onIncludedChange: (included: string[]) => void;
  onExcludedChange: (excluded: string[]) => void;
  onBenefitsChange: (benefits: string[]) => void;
  onItineraryChange: (itinerary: Array<{ day: number; title: string; description: string; }>) => void;
  onSubmit: (data: TourFormData) => Promise<void>;
  tourPricing: any[];
  timeSlots: any[];
  seasonalPricing: any[];
  groupDiscounts: any[];
  onTourPricingChange: (pricing: any[]) => void;
  onTimeSlotsChange: (slots: any[]) => void;
  onSeasonalPricingChange: (pricing: any[]) => void;
  onGroupDiscountsChange: (discounts: any[]) => void;
  basePrice: number;
}

export default function TourFormTabs({
  form,
  tour,
  activeTab,
  onActiveTabChange,
  highlights,
  included,
  excluded,
  benefits,
  itinerary,
  onHighlightsChange,
  onIncludedChange,
  onExcludedChange,
  onBenefitsChange,
  onItineraryChange,
  onSubmit,
  tourPricing,
  timeSlots,
  seasonalPricing,
  groupDiscounts,
  onTourPricingChange,
  onTimeSlotsChange,
  onSeasonalPricingChange,
  onGroupDiscountsChange,
  basePrice,
}: TourFormTabsProps) {
  // Get the current tour type to determine if it's a multi-day tour
  const tourType = form.watch("tour_type");
  const isMultiDayTour = tourType === "multiple_day" || tourType === "date_range";
  
  // If tour type changes from multi-day to one-day and current tab is pricing,
  // automatically switch to basic tab
  useEffect(() => {
    if (!isMultiDayTour && activeTab === 'pricing') {
      onActiveTabChange('basic');
    }
  }, [isMultiDayTour, activeTab, onActiveTabChange]);

  return (
    <Tabs value={activeTab} onValueChange={onActiveTabChange} className="w-full">
      <TabsList className={`grid w-full ${isMultiDayTour ? 'grid-cols-5' : 'grid-cols-4'}`}>
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        {isMultiDayTour && <TabsTrigger value="pricing">Pricing</TabsTrigger>}
        <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
        <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
        <TabsTrigger value="discounts">Discounts</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicTourInfo
            register={form.register}
            setValue={form.setValue}
            watch={form.watch}
            errors={form.formState.errors}
            tour={tour}
            benefits={benefits}
            itinerary={itinerary}
            onBenefitsChange={onBenefitsChange}
            onItineraryChange={onItineraryChange}
          />

          <TourHighlights
            highlights={highlights}
            onHighlightsChange={onHighlightsChange}
          />

          <TourInclusions
            included={included}
            excluded={excluded}
            onIncludedChange={onIncludedChange}
            onExcludedChange={onExcludedChange}
          />
        </form>
      </TabsContent>

      {/* Only render the pricing tab content if it's a multi-day tour */}
      {isMultiDayTour && (
        <TabsContent value="pricing">
          <TourPricingManager
            tourId={tour?.id}
            onPricingChange={onTourPricingChange}
            initialPricing={tourPricing}
            basePriceFromForm={basePrice}
            tourType={tourType}
          />
        </TabsContent>
      )}

      <TabsContent value="timeslots">
        <TourTimeSlotsManager
          tourId={tour?.id}
          onTimeSlotsChange={onTimeSlotsChange}
          initialTimeSlots={timeSlots}
        />
      </TabsContent>

      <TabsContent value="seasonal">
        <SeasonalPricingManager
          tourId={tour?.id}
          onSeasonalPricingChange={onSeasonalPricingChange}
          initialSeasonalPricing={seasonalPricing}
        />
      </TabsContent>

      <TabsContent value="discounts">
        <GroupSizeDiscountManager
          tourId={tour?.id}
          onDiscountsChange={onGroupDiscountsChange}
          initialDiscounts={groupDiscounts}
        />
      </TabsContent>
    </Tabs>
  );
}
