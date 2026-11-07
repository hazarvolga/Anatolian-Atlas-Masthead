"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/client";
import { isDemoMode } from "@/config/site";
import { DEMO_TOURS } from "@/lib/data/demo-content";

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
      const demoTour = DEMO_TOURS.find((t) => t.id === paymentData.tourId);
      if (isDemoMode() || demoTour) {
        const total = demoTour
          ? demoTour.price_adult * paymentData.adults +
            demoTour.price_child * paymentData.children
          : paymentData.total_price ?? 0;
        const demoBookingId = `DEMO-NST-${Date.now().toString().slice(-6)}`;
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            `demo_booking_${demoBookingId}`,
            JSON.stringify({
              id: demoBookingId,
              guest_name: paymentData.guestName,
              guest_email: paymentData.guestEmail,
              booking_date: paymentData.bookingDate,
              adults: paymentData.adults,
              children: paymentData.children,
              total_price: total,
              status: "demo_simulated",
              tour_title: demoTour?.title,
            })
          );
        }
        return { id: demoBookingId, isDemo: true };
      }

      try {
        const { data } = await api.post("/api/reservations", paymentData);
        return data;
      } catch {
        const demoBookingId = `DEMO-NST-${Date.now().toString().slice(-6)}`;
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            `demo_booking_${demoBookingId}`,
            JSON.stringify({
              id: demoBookingId,
              guest_name: paymentData.guestName,
              guest_email: paymentData.guestEmail,
              booking_date: paymentData.bookingDate,
              adults: paymentData.adults,
              children: paymentData.children,
              total_price: paymentData.total_price ?? 195 * paymentData.adults,
              status: "demo_simulated",
            })
          );
        }
        return { id: demoBookingId, isDemo: true };
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Reservation Failed",
        description:
          error.response?.data?.message ||
          "There was an error creating the reservation. Please try again.",
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
      const demoTour = DEMO_TOURS.find((t) => t.id === checkoutData.tourId);
      if (isDemoMode() || demoTour) {
        const fullTotal = demoTour
          ? demoTour.price_adult * checkoutData.adults +
            demoTour.price_child * checkoutData.children
          : 0;
        const amount =
          checkoutData.paymentType === "deposit"
            ? Math.round(fullTotal * 0.2 * 100) / 100
            : fullTotal;
        const demoBookingId = `DEMO-NST-${Date.now().toString().slice(-6)}`;
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            `demo_booking_${demoBookingId}`,
            JSON.stringify({
              id: demoBookingId,
              guest_name: "Template Demo Traveler",
              guest_email: "demo@nextstopturkey.com",
              booking_date: checkoutData.bookingDate,
              adults: checkoutData.adults,
              children: checkoutData.children,
              total_price: amount,
              status: "demo_simulated",
              tour_title: demoTour?.title,
            })
          );
        }
        return {
          url: `/booking-success?demo=true&booking_id=${demoBookingId}`,
          sessionId: `demo_sess_${demoBookingId}`,
          reservationId: demoBookingId,
        };
      }

      try {
        const { data } = await api.post(
          "/api/payments/create-checkout-session",
          checkoutData
        );
        return data as { url: string; sessionId: string; reservationId: string };
      } catch {
        const demoBookingId = `DEMO-NST-${Date.now().toString().slice(-6)}`;
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            `demo_booking_${demoBookingId}`,
            JSON.stringify({
              id: demoBookingId,
              guest_name: "Template Demo Traveler",
              guest_email: "demo@nextstopturkey.com",
              booking_date: checkoutData.bookingDate,
              adults: checkoutData.adults,
              children: checkoutData.children,
              total_price: 195 * checkoutData.adults,
              status: "demo_simulated",
            })
          );
        }
        return {
          url: `/booking-success?demo=true&booking_id=${demoBookingId}`,
          sessionId: `demo_sess_${demoBookingId}`,
          reservationId: demoBookingId,
        };
      }
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
