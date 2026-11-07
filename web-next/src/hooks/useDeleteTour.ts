"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/client";

export const useDeleteTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tourId: string) => {
      try {
        await api.delete(`/api/admin/tours/${tourId}`);
        return tourId;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to delete tour"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast({
        title: "Tur Silindi",
        description: "Tur başarıyla silindi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Silme Başarısız",
        description: error.message || "Tur silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};
