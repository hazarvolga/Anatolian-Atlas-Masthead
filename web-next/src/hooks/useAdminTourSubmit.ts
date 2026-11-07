"use client";

import { toast } from "@/components/ui/use-toast";
import { TourFormData } from "./useAdminTourForm";
import { useTourFormMutations } from "./useTourFormMutations";

interface UseAdminTourSubmitProps {
  tour?: any;
  onSuccess?: () => void;
}

export const useAdminTourSubmit = ({ tour, onSuccess }: UseAdminTourSubmitProps) => {
  const { createTourMutation, updateTourMutation } = useTourFormMutations();

  const onSubmit = async (
    data: TourFormData,
    additionalData: {
      highlights: string[];
      included: string[];
      excluded: string[];
      benefits: string[];
      itinerary: Array<{ day: number; title: string; description: string; }>;
      shouldClose?: boolean;
    },
    savePricingData: (tourId: string) => Promise<void>
  ) => {
    try {
      // Ensure numeric and nullable values are handled
      // For multi-day tours, price is not relevant as it's calculated from room prices
      const isMultiDayTour = data.tour_type === "multiple_day" || data.tour_type === "date_range";
      
      const tourData = {
        title: data.name, // Frontend'de 'name' ama backend'de 'title' bekleniyor
        description: data.description,
        // For multi-day tours, set price to 0 as it's managed in pricing tab with room prices
        price_adult: isMultiDayTour ? 0 : Number(data.price) || 0,
        duration_hours: Number(data.duration) || 1,
        max_participants: Number(data.max_group_size) || 10,
        destination_id: data.destination_id && data.destination_id !== "" ? data.destination_id : null,
        difficulty: data.difficulty, // Frontend'den 'difficulty' olarak gönder, backend convert edecek
        tour_type: data.tour_type,
        image_url: data.image_url || "",
        start_date: data.start_date && data.start_date !== "" ? data.start_date : null,
        end_date: data.end_date && data.end_date !== "" ? data.end_date : null,
        highlights: Array.isArray(additionalData.highlights) ? additionalData.highlights : [],
        departure_location: data.departure_location,
        departure_time: data.departure_time && data.departure_time !== "" ? data.departure_time : null,
        return_time: data.return_time && data.return_time !== "" ? data.return_time : null,
        includes: Array.isArray(additionalData.included) ? additionalData.included : [],
        excludes: Array.isArray(additionalData.excluded) ? additionalData.excluded : [],
        benefits: Array.isArray(additionalData.benefits) ? additionalData.benefits : [],
        itinerary: Array.isArray(additionalData.itinerary) ? additionalData.itinerary : [],
        deposit: Number(data.deposit) || 0,
        location: data.destination_id && data.destination_id !== "" ? data.destination_id : "Unknown Location",
        status: typeof data.is_active === "boolean" && data.is_active ? "active" : "inactive"
      };

      let savedTour;
      if (tour) {
        savedTour = await updateTourMutation.mutateAsync({ 
          tourId: tour.id, 
          tourData 
        });
      } else {
        savedTour = await createTourMutation.mutateAsync(tourData);
        toast({
          title: "Tur Oluşturuldu",
          description: "Yeni tur başarıyla oluşturuldu.",
          variant: "default"
        });
      }
      
      // Save additional pricing data
      if (savedTour?.id) {
        await savePricingData(savedTour.id);
      }
      
      if (additionalData.shouldClose) {
        onSuccess?.();
      }
    } catch (error: any) {
      console.error("Error saving tour:", error);
      toast({
        title: "Kayıt Başarısız",
        description: error?.message || "Tur kaydedilirken hata oluştu.",
        variant: "destructive"
      });
    }
  };

  return { onSubmit };
};
