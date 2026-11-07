
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const usePages = () => {
  return useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/pages`);
        return response.data;
      } catch (err: any) {
        console.error('Error fetching pages:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch pages');
      }
    },
  });
};

export const usePage = (slug: string) => {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      console.log('Fetching page with slug:', slug);
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/pages/${slug}`);
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

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (page: any) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/admin/pages`, page, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error creating page:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to create page');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast.success("Page created successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to create page");
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      // Store sections in content field for compatibility
      if (updates.sections) {
        updates.content = updates.sections;
      }
      
      try {
        const response = await axios.put(`${API_BASE_URL}/api/admin/pages/${id}`, updates, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error updating page:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to update page');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page'] });
      toast.success("Page updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update page");
      console.error("Update error:", error);
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/pages/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
      } catch (err: any) {
        console.error('Error deleting page:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to delete page');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast.success("Page deleted successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to delete page");
    },
  });
};
