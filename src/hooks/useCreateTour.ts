
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface CreateTourData {
  name: string;
  description: string;
  price: number;
  duration: number;
  max_group_size: number;
  location: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  tour_type?: 'multiple_day' | 'one_day' | 'date_range';
  start_date?: string;
  end_date?: string;
  highlights: string[];
  image_url?: string;
  is_active?: boolean;
  destination_id?: string;
}

export const useCreateTour = () => {
  const queryClient = useQueryClient();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  return useMutation({
    mutationFn: async (tourData: CreateTourData) => {
      console.log('Creating tour:', tourData);
      try {
        const response = await axios.post(`${API_BASE_URL}/api/admin/tours`, tourData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error creating tour:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to create tour');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast({
        title: "Tur Oluşturuldu",
        description: "Tur başarıyla oluşturuldu.",
      });
    },
    onError: (error: any) => {
      console.error('Tour creation failed:', error);
      toast({
        title: "Oluşturma Başarısız",
        description: error.message || "Tur oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};
