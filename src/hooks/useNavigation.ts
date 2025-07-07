
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const useNavigationItems = () => {
  return useQuery({
    queryKey: ['navigation-items'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/navigation-items`);
        return response.data;
      } catch (err: any) {
        console.error('Error fetching navigation items:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch navigation items');
      }
    },
  });
};

export const useCreateNavigationItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: any) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/admin/navigation-items`, item, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error creating navigation item:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to create navigation item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-items'] });
      toast.success("Navigation item created successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to create navigation item");
    },
  });
};

export const useUpdateNavigationItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/admin/navigation-items/${id}`, updates, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error updating navigation item:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to update navigation item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-items'] });
      toast.success("Navigation item updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update navigation item");
    },
  });
};

export const useDeleteNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/navigation-items/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
      } catch (err: any) {
        console.error('Error deleting navigation item:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to delete navigation item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-items'] });
      toast.success("Navigation item deleted successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to delete navigation item");
    },
  });
};