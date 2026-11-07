import { useCreateCheckoutSession, useCreatePayment } from "@/hooks/usePayments";
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
  const checkoutSession = useCreateCheckoutSession();

  const handlePayment = async (
    values: FormData,
    checkInDate: Date,
    adults: number,
    children: number,
    _rooms: any[] = [],
    _addOns: string[] = [],
    _pricingTotal?: number,
    action?: string
  ) => {
    const session = await checkoutSession.mutateAsync({
      tourId: values.tourId,
      bookingDate: format(checkInDate, 'yyyy-MM-dd'),
      adults,
      children,
      paymentType: action === 'deposit' ? 'deposit' : 'full',
    });

    if (!session?.url) {
      throw new Error('Failed to create checkout session');
    }

    return session;
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
