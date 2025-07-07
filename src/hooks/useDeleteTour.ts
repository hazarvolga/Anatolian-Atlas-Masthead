
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export const useDeleteTour = () => {
  const queryClient = useQueryClient();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  return useMutation({
    mutationFn: async (tourId: string) => {
      console.log('Deleting tour:', tourId);
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/tours/${tourId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return tourId;
      } catch (err: any) {
        console.error('Error deleting tour:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to delete tour');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast({
        title: "Tur Silindi",
        description: "Tur başarıyla silindi.",
      });
    },
    onError: (error: any) => {
      console.error('Tour deletion failed:', error);
      toast({
        title: "Silme Başarısız",
        description: error.message || "Tur silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};
