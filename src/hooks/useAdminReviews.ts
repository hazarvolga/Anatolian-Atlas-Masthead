
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all reviews for admin
export const useAdminReviews = () => {
  return useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/reviews`, { headers: getAuthHeaders() });
      return data;
    },
  });
};

// Update review status (approve/reject)
export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, is_verified }: { reviewId: string, is_verified: boolean }) => {
      const { data } = await axios.put(`${API_BASE_URL}/api/admin/reviews/${reviewId}/status`, { is_verified }, { headers: getAuthHeaders() });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success("Review status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update review status");
    },
  });
};

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewId: string) => {
      await axios.delete(`${API_BASE_URL}/api/admin/reviews/${reviewId}`, { headers: getAuthHeaders() });
      return reviewId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success("Review deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete review");
    },
  });
};

// Bulk update reviews
export const useBulkUpdateReviews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewIds, is_verified }: { reviewIds: string[], is_verified: boolean }) => {
      const { data } = await axios.put(`${API_BASE_URL}/api/admin/reviews/bulk-update`, { reviewIds, is_verified }, { headers: getAuthHeaders() });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success(`${data.count} reviews updated successfully`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update reviews");
    },
  });
};
