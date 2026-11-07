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

// Get reviews for a specific tour
export const useTourReviews = (tourId: string) => {
  return useQuery({
    queryKey: ['tour-reviews', tourId],
    queryFn: async () => {
      console.log('Fetching reviews for tour:', tourId);
      try {
        const response = await api.get(`/api/tours/${tourId}/reviews`);
        console.log('Reviews fetched:', response.data);
        return response.data;
      } catch (err: any) {
        console.error('Error fetching reviews:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch reviews');
      }
    },
    enabled: !!tourId,
  });
};

// Get user's reviews
export const useUserReviews = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-reviews', user?.id],
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching user reviews...');
      try {
        const response = await api.get("/api/reviews/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        console.log('User reviews fetched:', response.data);
        return response.data;
      } catch (err: any) {
        console.error('Error fetching user reviews:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch user reviews');
      }
    },
    enabled: !!user,
  });
};

// Create a new review
export const useCreateReview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      if (!user) {
        throw new Error('User must be authenticated to create a review');
      }

      console.log('Creating review:', reviewData);

      try {
        const response = await api.post("/api/reviews", reviewData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Review created:', response.data);
        return response.data;
      } catch (err: any) {
        console.error('Error creating review:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to create review');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tour-reviews', data.tour_id] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });

      toast({
        title: "Review Submitted",
        description: "Your review has been submitted for verification.",
      });
    },
    onError: (error: any) => {
      console.error('Review creation failed:', error);
      toast({
        title: "Review Failed",
        description: error.message || "There was an error submitting your review.",
        variant: "destructive",
      });
    },
  });
};

// Update an existing review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, reviewData }: { reviewId: string, reviewData: UpdateReviewData }) => {
      console.log('Updating review:', reviewId, reviewData);
      try {
        const response = await api.put(`/api/reviews/${reviewId}`, reviewData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        console.log('Review updated:', response.data);
        return response.data;
      } catch (err: any) {
        console.error('Error updating review:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to update review');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tour-reviews', data.tour_id] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });

      toast({
        title: "Review Updated",
        description: "Your review has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating your review.",
        variant: "destructive",
      });
    },
  });
};
