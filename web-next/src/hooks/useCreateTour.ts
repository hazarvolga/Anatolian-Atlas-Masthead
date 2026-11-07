"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/client";

export interface CreateTourData {
  name?: string;
  title?: string;
  description: string;
  price?: number;
  duration?: number;
  max_group_size?: number;
  destination_id: string;
  difficulty?: "easy" | "moderate" | "challenging";
  tour_type?: "multiple_day" | "one_day" | "date_range";
  start_date?: string;
  end_date?: string;
  highlights?: string[];
  image_url?: string;
  is_active?: boolean;
  deposit?: number;
  departure_location?: string;
  departure_time?: string;
  return_time?: string;
  included?: string[];
  excluded?: string[];
  benefits?: string[];
  itinerary?: Array<{ day: number; title: string; description: string }>;
  location?: string;
  price_adult?: number;
  duration_hours?: number;
  max_participants?: number;
  difficulty_level?: string;
  status?: string;
  includes?: string[];
  excludes?: string[];
  images?: string[];
}

export const useCreateTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tourData: CreateTourData) => {
      try {
        const response = await api.post("/api/admin/tours", tourData);
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to create tour"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast({
        title: "Tur Oluşturuldu",
        description: "Tur başarıyla oluşturuldu.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Oluşturma Başarısız",
        description: error.message || "Tur oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};
