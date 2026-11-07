"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface CreateReviewData {
  tour_id: string;
  booking_id?: string;
  rating: number;
  title?: string;
  comment?: string;
}

interface UpdateReviewData {
  rating: number;
  title?: string;
  comment?: string;
}

export const useTourReviews = (tourId: string) => {
  return useQuery({
    queryKey: ["tour-reviews", tourId],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/tours/${tourId}/reviews`);
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch reviews"
        );
      }
    },
    enabled: !!tourId,
  });
};

export const useUserReviews = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-reviews", user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        const response = await api.get("/api/reviews/user");
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch user reviews"
        );
      }
    },
    enabled: !!user,
  });
};

export const useCreateReview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      if (!user) {
        throw new Error("User must be authenticated to create a review");
      }

      try {
        const response = await api.post("/api/reviews", reviewData);
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to create review"
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tour-reviews", data.tour_id],
      });
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });

      toast({
        title: "Review Submitted",
        description: "Your review has been submitted for verification.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Review Failed",
        description:
          error.message || "There was an error submitting your review.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      reviewData,
    }: {
      reviewId: string;
      reviewData: UpdateReviewData;
    }) => {
      try {
        const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to update review"
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tour-reviews", data.tour_id],
      });
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });

      toast({
        title: "Review Updated",
        description: "Your review has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description:
          error.message || "There was an error updating your review.",
        variant: "destructive",
      });
    },
  });
};
