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

export const useReservations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["reservations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await api.get("/api/reservations");
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationData: CreateReservationData) => {
      const { data } = await api.post("/api/reservations", reservationData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast({
        title: "Reservation Created",
        description: "Your reservation has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Reservation Error",
        description:
          error.response?.data?.message ||
          "An error occurred while creating the reservation.",
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
      const { data } = await api.put(
        `/api/reservations/${reservationId}/status`,
        { status }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
};
