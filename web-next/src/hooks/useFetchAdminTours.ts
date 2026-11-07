"use client";


import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchAdminTours = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

  return useQuery({
    queryKey: ['admin-tours'],
    queryFn: async () => {
      console.log('Fetching all tours for admin...');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/tours`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error fetching tours:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch tours');
      }
    },
  });
};
