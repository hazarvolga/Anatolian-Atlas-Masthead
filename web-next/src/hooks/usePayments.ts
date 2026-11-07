"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/client";

interface CreatePaymentData {
  tourId: string;
  bookingDate: string;
  adults: number;
  children: number;
  total_price?: number;
  guestName: string;
  guestEmail: string;
}

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async (paymentData: CreatePaymentData) => {
      const { data } = await api.post("/api/reservations", paymentData);
      return data;
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Payment Failed",
        description:
          error.response?.data?.message ||
          "There was an error creating the payment session. Please try again.",
        variant: "destructive",
      });
    },
  });
};

interface CheckoutSessionData {
  tourId: string;
  bookingDate: string;
  adults: number;
  children: number;
  paymentType?: "full" | "deposit";
}

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async (checkoutData: CheckoutSessionData) => {
      const { data } = await api.post(
        "/api/payments/create-checkout-session",
        checkoutData
      );
      return data as { url: string; sessionId: string; reservationId: string };
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Payment Failed",
        description:
          error.response?.data?.message ||
          "There was an error starting the payment. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await api.post("/api/payments/verify-session", {
        sessionId,
      });
      return data;
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Payment Verification Failed",
        description:
          error.response?.data?.message || "Failed to verify payment.",
        variant: "destructive",
      });
    },
  });
};
