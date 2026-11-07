"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

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
    queryKey: ["stripe-settings", user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        const response = await api.get("/api/admin/stripe-settings");
        return response.data as StripeSettings | null;
      } catch (err: any) {
        if (err.response?.status === 404) {
          return null;
        }
        throw new Error(
          err.response?.data?.message || "Failed to fetch stripe settings"
        );
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
        const response = await api.put("/api/admin/stripe-settings", settings);
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to update stripe settings"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stripe-settings", user?.id],
      });
      toast.success("Stripe settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update stripe settings");
    },
  });
};
