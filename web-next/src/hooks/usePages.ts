"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

// Public page lookup. Admin page CRUD lives with the admin section in a later
// stage so public routes never import admin code.
export const usePage = (slug: string) => {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      console.log('Fetching page with slug:', slug);

      try {
        const response = await api.get(`/api/pages/${slug}`);
        const data = response.data;

        // Parse sections from content if it's stored there
        if (data && data.content && Array.isArray(data.content)) {
          data.sections = data.content;
        } else if (data && !data.sections) {
          data.sections = [];
        }

        console.log('Fetched page data:', data);
        return data;
      } catch (err: any) {
        console.error('Error fetching page:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch page');
      }
    },
    enabled: !!slug,
    retry: false,
  });
};
