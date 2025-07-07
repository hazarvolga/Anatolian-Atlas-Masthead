import { useQuery } from "@tanstack/react-query";

export const useAdminReservations = () => {
  return useQuery({
    queryKey: ['admin-reservations'],
    queryFn: async () => {
      console.log('🔍 Fetching all reservations for admin...');
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/reservations`);
        let data = response.data;
        
        console.log('🔍 Reservations query result:', { data });
        console.log('🔍 Number of reservations found:', data?.length || 0);
        
        // guest_details JSON ise parse et
        if (Array.isArray(data)) {
          data = data.map((r: any) => ({
            ...r,
            guest_details: typeof r.guest_details === 'string' ? JSON.parse(r.guest_details || '{}') : r.guest_details
          }));
        }
        
        console.log('✅ Processed reservations:', data);
        return data || [];
      } catch (err: any) {
        console.error('❌ Exception in useAdminReservations:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch reservations');
      }
    },
  });
};
