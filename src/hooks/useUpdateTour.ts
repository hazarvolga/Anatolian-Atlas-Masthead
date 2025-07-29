
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { CreateTourData } from "./useCreateTour";

export const useUpdateTour = () => {
  const queryClient = useQueryClient();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  return useMutation({
    mutationFn: async ({ tourId, tourData }: { tourId: string; tourData: Partial<CreateTourData> }) => {
      console.log('Updating tour:', tourId, tourData);
      try {
        const response = await axios.put(`${API_BASE_URL}/api/admin/tours/${tourId}`, tourData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error updating tour:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to update tour');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast({
        title: "Tur Güncellendi",
        description: "Tur başarıyla güncellendi.",
      });
    },
    onError: (error: any) => {
      console.error('Tour update failed:', error);
      toast({
        title: "Güncelleme Başarısız",
        description: error.message || "Tur güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};
