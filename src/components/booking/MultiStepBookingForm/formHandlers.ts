import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useCreatePayment } from "@/hooks/usePayments";
import type { FormData } from "./formConfig";

export interface BookingPayload {
  tourId: string;
  bookingDate: string;
  adults: number;
  children: number;
  total_price: number;
  guestName: string;
  guestEmail: string;
}

export const useBookingMutations = (user: any) => {
  const payment = useCreatePayment();

  const handlePayment = async (
    values: FormData,
    checkInDate: Date,
    adults: number,
    children: number,
    pricingTotal: number
  ) => {
    try {
      const payload: BookingPayload = {
        tourId: values.tourId,
        bookingDate: checkInDate.toISOString().split('T')[0],
        adults,
        children,
        total_price: pricingTotal,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
      };

      const paymentSession = await payment.mutateAsync(payload);

      if (!paymentSession) {
        throw new Error('Failed to create payment session');
      }

      return paymentSession;
    } catch (error: any) {
      toast({
        title: "Ödeme Başarısız!",
        description: error.message || "Bir hata oluştu, lütfen tekrar deneyin.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    handlePayment,
  };
};
