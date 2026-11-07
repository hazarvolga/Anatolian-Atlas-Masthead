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

function enrichAndMergeDestinations(rawList: any[]): Destination[] {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return DEMO_DESTINATIONS;
  }

  const enriched: Destination[] = rawList.map((item) => {
    const lowerName = (item.name || item.slug || "").toLowerCase();
    const matchedDemo = DEMO_DESTINATIONS.find(
      (d) =>
        (lowerName.includes("cappadocia") && d.id === "dest-cappadocia") ||
        (lowerName.includes("istanbul") && d.id === "dest-istanbul") ||
        (lowerName.includes("ephesus") && d.id === "dest-ephesus") ||
        (lowerName.includes("lycia") && d.id === "dest-lycia") ||
        (lowerName.includes("pamukkale") && d.id === "dest-pamukkale") ||
        (lowerName.includes("mardin") && d.id === "dest-mardin")
    );

    return {
      ...matchedDemo,
      ...item,
      name: matchedDemo?.name || item.name,
      description: matchedDemo?.description || item.description,
      image_url: matchedDemo?.image_url || item.image_url,
      city: matchedDemo?.city || item.city || item.name,
      country: item.country || matchedDemo?.country || "Türkiye",
      coords: item.coords || matchedDemo?.coords,
      best_time: item.best_time || matchedDemo?.best_time,
      activities:
        typeof item.activities === "string" && item.activities.length > 0
          ? item.activities
          : matchedDemo?.activities,
      gallery_images:
        Array.isArray(item.gallery_images) && item.gallery_images.length > 0
          ? item.gallery_images
          : matchedDemo?.gallery_images || [],
      extra_info:
        typeof item.extra_info === "string" && item.extra_info.length > 0
          ? item.extra_info
          : matchedDemo?.extra_info,
    };
  });

  // Deduplicate by canonical region name and append remaining Anatolian Atlas regions
  const seenNames = new Set<string>();
  const uniqueEnriched: Destination[] = [];
  for (const d of enriched) {
    const key = d.name.toLowerCase();
    if (!seenNames.has(key)) {
      seenNames.add(key);
      uniqueEnriched.push(d);
    }
  }

  for (const demoDest of DEMO_DESTINATIONS) {
    const key = demoDest.name.toLowerCase();
    if (!seenNames.has(key)) {
      seenNames.add(key);
      uniqueEnriched.push(demoDest);
    }
  }

  return uniqueEnriched;
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
        return enrichAndMergeDestinations(Array.isArray(data) ? data : []);
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
