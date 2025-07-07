import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface CreateReservationData {
  tourId: string;
  bookingDate: string;
  adults: number;
  children?: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  userId?: string | null; // Optional for guest reservations
}

export const useReservations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['reservations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching user reservations...');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/reservations`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          params: { userId: user.id }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error fetching reservations:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch reservations');
      }
    },
    enabled: !!user,
  });
};

export const useCreateReservation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reservationData: CreateReservationData) => {
      console.log('Creating reservation:', reservationData);
      
      try {
        const response = await axios.post(`${API_BASE_URL}/api/reservations`, reservationData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error creating reservation:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to create reservation');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
      toast({
        title: "Reservation Created",
        description: "Your reservation has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Reservation Error",
        description: error.message || "An error occurred while creating the reservation.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reservationId, status }: { reservationId: string; status: string }) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/reservations/${reservationId}/status`, 
          { status }, 
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          }
        );
        return response.data;
      } catch (err: any) {
        console.error('Error updating reservation status:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to update reservation status');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
      toast({
        title: "Status Updated",
        description: "Reservation status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Error",
        description: error.message || "An error occurred while updating the reservation status.",
        variant: "destructive",
      });
    },
  });
};
