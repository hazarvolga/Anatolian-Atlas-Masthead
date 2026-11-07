"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
      const { data } = await axios.get(`${API_BASE_URL}/api/reservations`, { headers: getAuthHeaders() });
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateReservation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reservationData: CreateReservationData) => {
      const { data } = await axios.post(`${API_BASE_URL}/api/reservations`, reservationData, { headers: getAuthHeaders() });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Reservation Created",
        description: "Your reservation has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Reservation Error",
        description: error.response?.data?.message || "An error occurred while creating the reservation.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reservationId, status }: { reservationId: string; status: string }) => {
      const { data } = await axios.put(`${API_BASE_URL}/api/reservations/${reservationId}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};
