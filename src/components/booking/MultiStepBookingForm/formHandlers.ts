import { toast } from "@/components/ui/use-toast";
import { useCreatePayment } from "@/hooks/usePayments";
import { format } from "date-fns";
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

export const useBookingMutations = (_user: any) => {
  const reservation = useCreatePayment();

  const handlePayment = async (
    _values: FormData,
    _checkInDate: Date,
    _adults: number,
    _children: number,
    _rooms: any[] = [],
    _addOns: string[] = [],
    _pricingTotal?: number,
    _action?: string
  ) => {
    toast({
      title: "Online ödeme henüz aktif değil",
      description: "Lütfen 'Sadece Rezervasyon' seçeneğiyle devam edin.",
      variant: "destructive",
    });
    throw new Error('Online payment is not configured');
  };

  const handleReserve = async (
    values: FormData,
    checkInDate: Date,
    adults: number,
    children: number,
    _rooms: any[] = [],
    _addOns: string[] = [],
    pricingTotal = 0
  ) => {
    const payload: BookingPayload = {
      tourId: values.tourId,
      bookingDate: format(checkInDate, 'yyyy-MM-dd'),
      adults,
      children,
      total_price: pricingTotal,
      guestName: values.guestName,
      guestEmail: values.guestEmail,
    };

    const createdReservation = await reservation.mutateAsync(payload);

    if (!createdReservation?.id) {
      throw new Error('Failed to create reservation');
    }

    window.location.href = `/booking-success?booking_id=${createdReservation.id}`;
    return createdReservation;
  };

  return {
    handlePayment,
    handleReserve,
  };
};
