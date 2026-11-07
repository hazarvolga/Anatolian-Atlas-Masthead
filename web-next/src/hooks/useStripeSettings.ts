"use client";


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export interface StripeSettings {
  id: string;
  user_id: string;
  stripe_secret_key?: string;
  stripe_publishable_key?: string;
  webhook_secret?: string;
  is_live_mode: boolean;
  created_at: string;
  updated_at: string;
}

export const useStripeSettings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['stripe-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/stripe-settings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data as StripeSettings | null;
      } catch (err: any) {
        // If no settings found, return null
        if (err.response?.status === 404) {
          return null;
        }
        console.error('Error fetching stripe settings:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch stripe settings');
      }
    },
    enabled: !!user,
  });
};

export const useUpdateStripeSettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (settings: {
      stripe_secret_key?: string;
      stripe_publishable_key?: string;
      webhook_secret?: string;
      is_live_mode?: boolean;
    }) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/admin/stripe-settings`, settings, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error updating stripe settings:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to update stripe settings');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripe-settings', user?.id] });
      toast.success("Stripe settings updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update stripe settings");
      console.error("Stripe settings update error:", error);
    },
  });
};
