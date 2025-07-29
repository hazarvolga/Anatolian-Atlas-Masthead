
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

export const useToggleTourStatus = () => {
  const queryClient = useQueryClient();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  return useMutation({
    mutationFn: async ({ tourId, isActive }: { tourId: string; isActive: boolean }) => {
      console.log('Toggling tour status:', tourId, isActive);
      try {
        const response = await axios.put(`${API_BASE_URL}/api/admin/tours/${tourId}/status`, { is_active: isActive }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error toggling tour status:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to toggle tour status');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast({
        title: "Tur Durumu Güncellendi",
        description: `Tur ${data.is_active ? 'aktif' : 'pasif'} hale getirildi.`,
      });
    },
    onError: (error: any) => {
      console.error('Tour status toggle failed:', error);
      toast({
        title: "Durum Güncelleme Başarısız",
        description: error.message || "Tur durumu güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};
