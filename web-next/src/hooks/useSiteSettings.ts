"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export type SiteSettings = {
  id: string;
  site_title: string;
  site_tagline?: string;
  site_logo_url?: string;
  favicon_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  social_media_links?: Record<string, string>;
  default_meta_description?: string;
  default_meta_keywords?: string;
  og_image_url?: string;
  primary_color?: string;
  secondary_color?: string;
  copyright_text?: string;
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  company_name?: string;
  website_url?: string;
  support_email?: string;
  email_footer_text?: string;
  email_header_text?: string;
  unsubscribe_text?: string;
};

export function useSiteSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error, refetch } = useQuery<SiteSettings | null>({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await api.get("/api/site-settings");
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<SiteSettings>) => {
      const { data } = await api.put("/api/admin/site-settings", updates, { headers: getAuthHeaders() });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["site-settings"], data);
      toast.success("Site settings updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update settings.");
    },
  });

  return {
    settings,
    isLoading,
    error,
    refetch,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

