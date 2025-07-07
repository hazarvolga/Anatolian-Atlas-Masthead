
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTourAddOns = (tourId?: string) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  return useQuery({
    queryKey: ['tour-add-ons', tourId],
    queryFn: async () => {
      if (!tourId) return [];
      
      console.log('Fetching add-ons for tour:', tourId);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tours/${tourId}/add-ons`);
        console.log('Tour add-ons fetched:', response.data?.length);
        return response.data || [];
      } catch (err: any) {
        console.error('Error fetching tour add-ons:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch tour add-ons');
      }
    },
    enabled: !!tourId,
    staleTime: 5 * 60 * 1000,
  });
};
