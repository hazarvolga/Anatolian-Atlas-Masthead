"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/client";

interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await api.get("/api/users/profile");
      return data;
    },
    enabled: !!user,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfileData) => {
      const { data } = await api.put("/api/users/profile", profileData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message ||
          "There was an error updating your profile.",
        variant: "destructive",
      });
    },
  });
};
