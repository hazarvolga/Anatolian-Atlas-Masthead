"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

export const useAdminReviews = () => {
  return useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data } = await api.get("/api/admin/reviews");
      return data;
    },
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      is_verified,
    }: {
      reviewId: string;
      is_verified: boolean;
    }) => {
      const { data } = await api.put(`/api/admin/reviews/${reviewId}/verify`, {
        is_verified,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update review status"
      );
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      await api.delete(`/api/admin/reviews/${reviewId}`);
      return reviewId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete review");
    },
  });
};

export const useBulkUpdateReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewIds,
      is_verified,
    }: {
      reviewIds: string[];
      is_verified: boolean;
    }) => {
      const { data } = await api.put("/api/admin/reviews/bulk-update", {
        reviewIds,
        is_verified,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success(`${data.count} reviews updated successfully`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update reviews");
    },
  });
};
