
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export const useUserRole = () => {
  const { user } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching user role...');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/role`, {
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
