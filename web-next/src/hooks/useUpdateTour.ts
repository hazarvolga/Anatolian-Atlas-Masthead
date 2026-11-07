"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/client";
import { CreateTourData } from "./useCreateTour";

export const useUpdateTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tourId,
      tourData,
    }: {
      tourId: string;
      tourData: Partial<CreateTourData>;
    }) => {
      try {
        const response = await api.put(`/api/admin/tours/${tourId}`, tourData);
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to update tour"
        );
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      queryClient.invalidateQueries({
        queryKey: ["adminTour", variables.tourId],
      });

      toast({
        title: "Tur Güncellendi",
        description: "Tur başarıyla güncellendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Güncelleme Başarısız",
        description: error.message || "Tur güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};
