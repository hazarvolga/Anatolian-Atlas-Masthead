"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";
import { isDemoMode } from "@/config/site";
import { DEMO_DESTINATIONS } from "@/lib/data/demo-content";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Destination {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  country?: string;
  city?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  coords?: string;
  best_time?: string;
  activities?: string;
  google_maps_url?: string;
  gallery_images?: string[];
  extra_info?: string;
  _count?: {
    tours: number;
  };
}

export interface CreateDestinationData {
  name: string;
  description?: string;
  image_url?: string;
  country?: string;
  city?: string;
  is_active?: boolean;
  coords?: string;
  best_time?: string;
  activities?: string;
  google_maps_url?: string;
  gallery_images?: string[];
  extra_info?: string;
}

export const useDestinations = () => {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      if (isDemoMode()) {
        return DEMO_DESTINATIONS;
      }

      try {
        const { data } = await api.get("/api/destinations");
        const list = Array.isArray(data) ? data : [];
        return list.length > 0 ? list : DEMO_DESTINATIONS;
      } catch {
        return DEMO_DESTINATIONS;
      }
    },
  });
};

export const useAdminDestinations = () => {
  return useQuery({
    queryKey: ["admin-destinations"],
    queryFn: async () => {
      const { data } = await api.get("/api/admin/destinations", {
        headers: getAuthHeaders(),
      });
      return data;
    },
  });
};

export const useCreateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (destinationData: CreateDestinationData) => {
      const { data } = await api.post(
        "/api/admin/destinations",
        destinationData,
        { headers: getAuthHeaders() }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      toast({
        title: "Destination Created",
        description: "Destination created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description:
          error.response?.data?.message ||
          "An error occurred while creating the destination.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      destinationId,
      destinationData,
    }: {
      destinationId: string;
      destinationData: Partial<CreateDestinationData>;
    }) => {
      const { data } = await api.put(
        `/api/admin/destinations/${destinationId}`,
        destinationData,
        { headers: getAuthHeaders() }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      toast({
        title: "Destination Updated",
        description: "Destination updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message ||
          "An error occurred while updating the destination.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (destinationId: string) => {
      await api.delete(`/api/admin/destinations/${destinationId}`, {
        headers: getAuthHeaders(),
      });
      return destinationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      toast({
        title: "Destination Deleted",
        description: "Destination deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description:
          error.response?.data?.message ||
          "An error occurred while deleting the destination.",
        variant: "destructive",
      });
    },
  });
};
