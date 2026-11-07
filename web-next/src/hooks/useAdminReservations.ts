"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import { toast } from "sonner";

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useAdminReservations = () => {
  return useQuery({
    queryKey: ['admin-reservations'],
    queryFn: async () => {
      console.log('🔍 Fetching all reservations for admin...');
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/reservations`, { headers: getAuthHeaders() });
        let data = response.data;
        
        console.log('🔍 Reservations query result:', { data });
        console.log('🔍 Number of reservations found:', data?.length || 0);
        
        // guest_details JSON ise parse et
        if (Array.isArray(data)) {
          data = data.map((r: any) => ({
            ...r,
            guest_details: typeof r.guest_details === 'string' ? JSON.parse(r.guest_details) : r.guest_details,
          }));
        }
        
        return data;
      } catch (err: any) {
        console.error('❌ Error fetching reservations:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch reservations');
      }
    },
  });
};

export const useAdminUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reservationId, status }: { reservationId: string; status: 'pending' | 'confirmed' | 'cancelled' | 'completed' }) => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const { data } = await axios.put(
        `${API_BASE_URL}/api/admin/reservations/${reservationId}/status`, 
        { status }, 
        { headers: getAuthHeaders() }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success(`Reservation status updated to ${data.status}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update reservation status.");
    },
  });
};
