"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export const useFetchAdminTours = () => {
  return useQuery({
    queryKey: ["admin-tours"],
    queryFn: async () => {
      try {
        const response = await api.get("/api/admin/tours");
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch tours"
        );
      }
    },
  });
};
