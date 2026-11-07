"use client";


import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useRoomTypes = (tourId?: string) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

  return useQuery({
    queryKey: ['room-types', tourId],
    queryFn: async () => {
      if (!tourId) return [];
      
      console.log('Fetching room types for tour:', tourId);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tours/${tourId}/room-types`);
        console.log('Room types fetched:', response.data?.length);
        return response.data || [];
      } catch (err: any) {
        console.error('Error fetching room types:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch room types');
      }
    },
    enabled: !!tourId,
    staleTime: 5 * 60 * 1000,
  });
};
