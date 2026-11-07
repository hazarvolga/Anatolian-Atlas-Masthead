"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

export const useAdminReservations = () => {
  return useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      try {
        const response = await api.get("/api/admin/reservations");
        let data = response.data;

        if (Array.isArray(data)) {
          data = data.map((r: any) => ({
            ...r,
            guest_details:
              typeof r.guest_details === "string"
                ? JSON.parse(r.guest_details)
                : r.guest_details,
          }));
        }

        return data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch reservations"
        );
      }
    },
  });
};

export const useAdminUpdateReservationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reservationId,
      status,
    }: {
      reservationId: string;
      status: "pending" | "confirmed" | "cancelled" | "completed";
    }) => {
      const { data } = await api.put(
        `/api/admin/reservations/${reservationId}/status`,
        { status }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      toast.success(`Reservation status updated to ${data.status}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update reservation status."
      );
    },
  });
};
