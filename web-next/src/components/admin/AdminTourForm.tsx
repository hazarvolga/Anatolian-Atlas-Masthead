"use client";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminTourForm } from "@/hooks/useAdminTourForm";
import TourFormTabs from "./tour-form/TourFormTabs";
import TourFormActions from "./tour-form/TourFormActions";

interface AdminTourFormProps {
  tour?: any;
  onSuccess?: () => void;
}

export default function AdminTourForm({ tour, onSuccess }: AdminTourFormProps) {
  const {
    form,
    highlights,
    included,
    excluded,
    benefits,
    itinerary,
    activeTab,
    tourPricing,
    timeSlots,
    seasonalPricing,
    groupDiscounts,
    basePrice,
    setHighlights,
    setIncluded,
    setExcluded,
    setBenefits,
    setItinerary,
    setActiveTab,
    setTourPricing,
    setTimeSlots,
    setSeasonalPricing,
    setGroupDiscounts,
    onSubmit,
  } = useAdminTourForm({ tour, onSuccess });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tour ? "Edit Tour" : "Create New Tour"}</CardTitle>
        <CardDescription>
          {tour ? "Update tour information and pricing" : "Fill in the details to create a new tour with advanced pricing options"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TourFormTabs
          form={form}
          tour={tour}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          highlights={highlights}
          included={included}
          excluded={excluded}
          benefits={benefits}
          itinerary={itinerary}
          onHighlightsChange={setHighlights}
          onIncludedChange={setIncluded}
          onExcludedChange={setExcluded}
          onBenefitsChange={setBenefits}
          onItineraryChange={setItinerary}
          onSubmit={onSubmit}
          tourPricing={tourPricing}
          timeSlots={timeSlots}
          seasonalPricing={seasonalPricing}
          groupDiscounts={groupDiscounts}
          onTourPricingChange={setTourPricing}
          onTimeSlotsChange={setTimeSlots}
          onSeasonalPricingChange={setSeasonalPricing}
          onGroupDiscountsChange={setGroupDiscounts}
          basePrice={basePrice}
        />

        <TourFormActions
          form={form}
          tour={tour}
          onSubmit={onSubmit}
        />
      </CardContent>
    </Card>
  );
}
