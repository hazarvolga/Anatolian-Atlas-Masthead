"use client";


import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching user role...');
      try {
        const response = await api.get("/api/users/role", {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data.role || 'user';
      } catch (err: any) {
        console.error('Error fetching user role:', err.response?.data || err.message);
        return 'user';
      }
    },
    enabled: !!user,
  });
};

export const useIsAdmin = () => {
  const { data: role } = useUserRole();
  return role === 'admin' || role === 'super_admin';
};

export const useIsSuperAdmin = () => {
  const { data: role } = useUserRole();
  return role === 'super_admin';
};
