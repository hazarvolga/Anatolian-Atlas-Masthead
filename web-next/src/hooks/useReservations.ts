"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/client";

export interface CreateReservationData {
  tourId: string;
  bookingDate: string;
  adults: number;
  children?: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  userId?: string | null;
}

export interface ReservationItem {
  id: string;
  tourId?: string;
  tour_id?: string;
  reservationDate?: string | Date | null;
  booking_date?: string | Date | null;
  numAdults?: number;
  adults?: number;
  numChildren?: number;
  children?: number;
  totalPrice?: number | string;
  total_price?: number | string;
  status: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  special_requests?: string;
  created_at?: string | Date | null;
  tour?: {
    title?: string;
    location?: string;
  };
  tours?: {
    name?: string;
    location?: string;
  };
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

export const useReservations = () => {
  const { user } = useAuth();

  return useQuery<ReservationItem[]>({
    queryKey: ["reservations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get("/api/reservations", {
        params: { userId: user.id },
      });
      return response.data;
    },
    enabled: !!user,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationData: CreateReservationData) => {
      const response = await api.post("/api/reservations", reservationData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast({
        title: "Reservation Created",
        description: "Your reservation has been created successfully.",
      });
    },
    onError: (error: Error) => {
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
    mutationFn: async ({
      reservationId,
      status,
    }: {
      reservationId: string;
      status: string;
    }) => {
      const response = await api.put(`/api/reservations/${reservationId}/status`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast({
        title: "Status Updated",
        description: "Reservation status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Error",
        description:
          error.message || "An error occurred while updating the reservation status.",
        variant: "destructive",
      });
    },
  });
};
