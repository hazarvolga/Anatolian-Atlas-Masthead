"use client";


import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export const usePromotionalCode = (code?: string, tourId?: string) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

  return useQuery({
    queryKey: ['promotional-code', code, tourId],
    queryFn: async () => {
      if (!code) return null;
      
      console.log('Validating promotional code:', code);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/promotional-codes/validate`, {
          params: { code: code.toUpperCase(), tourId },
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        
        console.log('Valid promotional code found:', response.data);
        return response.data;
      } catch (err: any) {
        console.error('Error validating promotional code:', err.response?.data || err.message);
        return null;
      }
    },
    enabled: !!code && code.length > 0,
    retry: 1,
  });
};
