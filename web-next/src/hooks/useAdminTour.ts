"use client";

import { useQuery } from "@tanstack/react-query";
import { TourProps as Tour } from "@/types/tour";
import { api } from "@/lib/api/client";

const fetchTour = async (id: string): Promise<Tour> => {
  const { data } = await api.get(`/api/admin/tours/${id}`);
  return data;
};

export const useAdminTour = (id: string) => {
  return useQuery<Tour, Error>({
    queryKey: ["adminTour", id],
    queryFn: () => fetchTour(id),
    enabled: !!id,
  });
};
