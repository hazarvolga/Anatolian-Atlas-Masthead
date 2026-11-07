
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const useTours = () => {
  return useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      console.log('Fetching all tours...');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tours`);
        // Backend returns { tours: [...], total: ..., limit: ..., offset: ... }
        const toursArray = Array.isArray(response.data.tours) ? response.data.tours : [];
        console.log('Tours fetched successfully, count:', toursArray.length);
        
        // Map backend fields to frontend expected fields
        const mappedTours = toursArray.map((tour: any) => ({
          ...tour,
          name: tour.title || tour.name, // Map title to name
          max_group_size: tour.max_participants || tour.max_group_size || 20,
          highlights: tour.includes || tour.highlights || [],
          rating: tour.rating || 4.5, // Default rating
          difficulty: tour.difficulty || 'easy',
          location: tour.destination_name || tour.location || 'Unknown',
          price: parseFloat(tour.price_adult) || 0,
          destinations: tour.destination_id ? {
            id: tour.destination_id,
            name: tour.destination_name,
            city: tour.city,
            country: tour.country
          } : undefined
        }));
        
        console.log('Mapped tours:', mappedTours);
        return mappedTours;
      } catch (error: any) {
        console.error('Tours fetch error:', error.response?.data || error.message);
        return []; // Return empty array on error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    // Ensure we always return an array
    select: (data) => Array.isArray(data) ? data : [],
  });
};

export const useTour = (id: string) => {
  return useQuery({
    queryKey: ['tour', id],
    queryFn: async () => {
      if (!id) return null;
      
      console.log('Fetching tour with id:', id);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tours/${id}`);
        console.log('Tour fetched successfully:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Error fetching tour:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch tour');
      }
    },
    enabled: !!id,
  });
};

export const useTourAvailability = (tourId?: string) => {
  return useQuery({
    queryKey: ['tour-availability', tourId],
    queryFn: async () => {
      if (!tourId) return [];
      
      console.log('Fetching availability for tour:', tourId);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tours/${tourId}/availability`);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error: any) {
        console.error('Tour availability fetch error:', error.response?.data || error.message);
        return [];
      }
    },
    enabled: !!tourId,
    // Ensure we always return an array
    select: (data) => Array.isArray(data) ? data : [],
  });
};