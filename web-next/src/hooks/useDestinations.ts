"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";
import { isDemoMode } from "@/config/site";
import { DEMO_DESTINATIONS } from "@/lib/data/demo-content";
import {
  DEFAULT_DEMO_HERO_IMAGE,
  resolveDemoImageUrl,
} from "@/lib/data/demo-images";

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

function normalizeDestination(item: any): Destination {
  const extraObj =
    item.extra_info && typeof item.extra_info === "object"
      ? item.extra_info
      : {};
  const gallery = Array.isArray(item.gallery_images) ? item.gallery_images : [];
  const activitiesArr = Array.isArray(item.activities) ? item.activities : [];

  return {
    ...item,
    id: item.slug || item.id,
    name: item.name,
    description: item.description,
    image_url: resolveDemoImageUrl(
      item.image_url || extraObj.image_url || gallery[0],
      DEFAULT_DEMO_HERO_IMAGE
    ),
    city: item.city || item.name,
    country: item.country || "Türkiye",
    coords: item.coords,
    best_time: item.best_time,
    activities:
      typeof item.activities === "string"
        ? item.activities
        : activitiesArr.join(", "),
    gallery_images: gallery,
    extra_info:
      typeof item.extra_info === "string"
        ? item.extra_info
        : extraObj.note || undefined,
    _count: {
      tours: item._count?.tours ?? item.tour_count ?? 1,
    },
  };
}

export const useDestinations = () => {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      if (isDemoMode()) {
        return DEMO_DESTINATIONS;
      }

      const { data } = await api.get("/api/destinations");
      const rawList = Array.isArray(data) ? data : [];
      return rawList.map(normalizeDestination);
    },
  });
};

export const useAdminDestinations = () => {
  return useQuery({
    queryKey: ["admin-destinations"],
    queryFn: async () => {
      const { data } = await api.get("/api/admin/destinations");
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
        destinationData
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
        destinationData
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
      await api.delete(`/api/admin/destinations/${destinationId}`);
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
