"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        const response = await api.get("/api/users/role");
        return response.data.role || "user";
      } catch {
        return "user";
      }
    },
    enabled: !!user,
  });
};

export const useIsAdmin = () => {
  const { data: role } = useUserRole();
  return role === "admin" || role === "super_admin";
};

export const useIsSuperAdmin = () => {
  const { data: role } = useUserRole();
  return role === "super_admin";
};
