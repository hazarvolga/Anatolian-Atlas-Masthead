import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface CreatePaymentData {
  tourId: string;
  bookingDate: string;
  adults: number;
  children: number;
  total_price: number;
  guestName: string;
  guestEmail: string;
}

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async (paymentData: CreatePaymentData) => {
      const { data } = await axios.post(`${API_BASE_URL}/api/reservations`, paymentData, { headers: getAuthHeaders() });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.response?.data?.message || "There was an error creating the payment session. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await axios.post(`${API_BASE_URL}/api/payments/verify-session`, { sessionId }, { headers: getAuthHeaders() });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Payment Verification Failed",
        description: error.response?.data?.message || "Failed to verify payment.",
        variant: "destructive",
      });
    },
  });
};
