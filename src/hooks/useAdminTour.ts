import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TourProps as Tour } from "@/types/tour";

const fetchTour = async (id: string): Promise<Tour> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  const { data } = await axios.get(`${API_BASE_URL}/api/admin/tours/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
  });
  return data;
};

export const useAdminTour = (id: string) => {
  return useQuery<Tour, Error>({
    queryKey: ["adminTour", id],
    queryFn: () => fetchTour(id),
    enabled: !!id,
  });
};
