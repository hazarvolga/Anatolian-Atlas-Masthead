"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

export const useNavigationItems = () => {
  return useQuery({
    queryKey: ["navigation-items"],
    queryFn: async () => {
      try {
        const response = await api.get("/api/admin/navigation-items");
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch navigation items"
        );
      }
    },
  });
};

export const useCreateNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: any) => {
      try {
        const response = await api.post("/api/admin/navigation-items", item);
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to create navigation item"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast.success("Navigation item created successfully");
    },
    onError: () => {
      toast.error("Failed to create navigation item");
    },
  });
};

export const useUpdateNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      try {
        const response = await api.put(
          `/api/admin/navigation-items/${id}`,
          updates
        );
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to update navigation item"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast.success("Navigation item updated successfully");
    },
    onError: () => {
      toast.error("Failed to update navigation item");
    },
  });
};

export const useDeleteNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await api.delete(`/api/admin/navigation-items/${id}`);
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to delete navigation item"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast.success("Navigation item deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete navigation item");
    },
  });
};
