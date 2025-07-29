import { useState, useCallback } from "react";
import { useCreateReservation } from "./useReservations";
import { useReservationSubmission } from "./booking/useReservationSubmission";
import { Customer, SelectedRoom, SelectedAddOn } from "@/types/booking";
import axios from "axios";

interface EnhancedReservationData {
  tourId: string;
  selectedDate?: Date;
  checkInDate?: Date;
  checkOutDate?: Date;
  customers: Customer[];
  rooms: SelectedRoom[];
  addOns: SelectedAddOn[];
  promotionalCode?: string;
  discountAmount: number;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  userId?: string | null;
}

export const useEnhancedReservation = () => {
  const [reservationData, setReservationData] = useState<Partial<EnhancedReservationData>>({
    customers: [],
    rooms: [],
    addOns: [],
    discountAmount: 0,
  });

  const createReservationMutation = useCreateReservation();
  const { onSubmit: processPayment } = useReservationSubmission();

  const updateReservationData = useCallback((updates: Partial<EnhancedReservationData>) => {
    setReservationData(prev => ({ ...prev, ...updates }));
  }, []);

  const calculateTotals = useCallback(() => {
    const { rooms = [], addOns = [], discountAmount = 0 } = reservationData;
    const roomsTotal = rooms.reduce((total, room) => total + room.roomPrice + room.extraBedPrice, 0);
    const addOnsTotal = addOns.reduce((total, addOn) => total + addOn.totalPrice, 0);
    const subtotal = roomsTotal + addOnsTotal;
    const taxRate = 0.18; // 18% KDV
    const taxAmount = subtotal * taxRate;
    const finalTotal = subtotal + taxAmount - discountAmount;
    return {
      roomsTotal,
      addOnsTotal,
      subtotal,
      taxAmount,
      discountAmount,
      finalTotal: Math.max(0, finalTotal)
    };
  }, [reservationData]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  // RESERVATION ONLY - Sadece rezervasyon kaydı
  const submitReservation = useCallback(async () => {
    if (!reservationData.tourId || !reservationData.selectedDate || !reservationData.guestInfo) {
      throw new Error('Missing required reservation information');
    }

    const totals = calculateTotals();
    const totalAdults = reservationData.customers?.reduce((sum, c) => c.type === 'adult' ? sum + c.count : sum, 0) || 0;
    const totalChildren = reservationData.customers?.reduce((sum, c) => c.type === 'child' ? sum + c.count : sum, 0) || 0;

    // reservations tablosuna insert
    const response = await axios.post(`${API_BASE_URL}/api/reservations`, {
      tour_id: reservationData.tourId,
      booking_date: reservationData.selectedDate,
      adults: totalAdults,
      children: totalChildren,
      total_price: totals.finalTotal,
      status: 'pending',
      user_id: reservationData.userId || null,
      guest_details: JSON.stringify({
        name: reservationData.guestInfo.name,
        email: reservationData.guestInfo.email,
        phone: reservationData.guestInfo.phone,
        specialRequests: reservationData.guestInfo.specialRequests,
      }),
      contact_email: reservationData.guestInfo.email,
      contact_phone: reservationData.guestInfo.phone,
      special_requests: reservationData.guestInfo.specialRequests,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });

    return response.data;
  }, [reservationData, calculateTotals]);

  // PAYMENT - Stripe ile ödeme akışı
  const submitPayment = useCallback(async () => {
    if (!reservationData.tourId || !reservationData.selectedDate || !reservationData.guestInfo) {
      throw new Error('Missing required reservation information');
    }

    const totals = calculateTotals();
    const totalAdults = reservationData.customers?.reduce((sum, c) => 
      c.type === 'adult' ? sum + c.count : sum, 0) || 0;
    const totalChildren = reservationData.customers?.reduce((sum, c) => 
      c.type === 'child' ? sum + c.count : sum, 0) || 0;

    // Format data for Stripe payment
    const formValues = {
      tourId: reservationData.tourId,
      adults: totalAdults,
      children: totalChildren,
      guestName: reservationData.guestInfo.name,
      guestEmail: reservationData.guestInfo.email,
      guestPhone: reservationData.guestInfo.phone,
      specialRequests: reservationData.guestInfo.specialRequests,
    };

    const pricingObj = { total: totals.finalTotal };
    const roomsArray = reservationData.rooms || [];
    const addOnsArray: string[] = [];

    // Use the Stripe payment gateway
    return await processPayment(
      formValues,
      reservationData.selectedDate, // checkInDate
      reservationData.checkOutDate, // checkOutDate
      !!reservationData.checkOutDate, // isMultiDayTour
      roomsArray,
      addOnsArray,
      pricingObj
    );
  }, [reservationData, calculateTotals, processPayment]);

  return {
    reservationData,
    setReservationData: updateReservationData,
    createReservationMutation,
    submitReservation,
    submitPayment,
    calculateTotals,
  };
};
