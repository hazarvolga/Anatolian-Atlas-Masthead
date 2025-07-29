
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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

  const query = useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings | null> => {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/settings/site`, { headers: getAuthHeaders() });
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<SiteSettings>) => {
      const { data } = await axios.post(`${API_BASE_URL}/api/admin/settings/site`, updates, { headers: getAuthHeaders() });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateSettings: mutation.mutateAsync,
    updating: mutation.isPending,
    refetch: query.refetch,
  };
}

