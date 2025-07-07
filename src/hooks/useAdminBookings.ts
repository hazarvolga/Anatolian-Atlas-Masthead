import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAdminReservations = () => {
  return useQuery({
    queryKey: ['admin-reservations'],
    queryFn: async () => {
      console.log('Fetching all reservations for admin...');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/reservations`);
        return response.data;
      } catch (err: any) {
        console.error('Error fetching reservations:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch reservations');
      }
      return data;
    },
  });
};
