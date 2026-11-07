"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

export const usePages = () => {
  return useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const response = await api.get("/api/admin/pages");
      return response.data;
    },
  });
};

export const usePage = (slug: string) => {
  return useQuery({
    queryKey: ["page", slug],
    queryFn: async () => {
      const response = await api.get(`/api/pages/${slug}`);
      const data = response.data;

      if (data && data.content && Array.isArray(data.content)) {
        data.sections = data.content;
      } else if (data && !data.sections) {
        data.sections = [];
      }

      return data;
    },
    enabled: !!slug,
    retry: false,
  });
};

export const useAdminPage = (id: string) => {
  return useQuery({
    queryKey: ["page", "admin", id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/pages/${id}`);
      const data = response.data;

      if (data && Array.isArray(data.content)) {
        data.sections = data.content;
      } else if (data && !data.sections) {
        data.sections = [];
      }

      return data;
    },
    enabled: !!id,
    retry: false,
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: any) => {
      const response = await api.post("/api/admin/pages", page);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Page created successfully");
    },
    onError: () => {
      toast.error("Failed to create page");
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (updates.sections) {
        updates.content = updates.sections;
      }
      const response = await api.put(`/api/admin/pages/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["page"] });
      toast.success("Page updated successfully");
    },
    onError: () => {
      toast.error("Failed to update page");
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Page deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete page");
    },
  });
};
