import { useBookingState } from "./booking/useBookingState";
import { useBookingForm } from "./booking/useBookingForm";
import { useBookingPricing } from "./booking/useBookingPricing";
import { useBookingSubmission } from "./booking/useBookingSubmission";

export const useModernBookingForm = (preselectedTourId?: string) => {
  // State management
  const {
    selectedTourId,
    setSelectedTourId,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    adults,
    setAdults,
    children,
    setChildren,
    customers,
    setCustomers,
    rooms,
    setRooms,
    addOns,
    setAddOns,
  } = useBookingState(preselectedTourId);

  // Form management
  const { form, tours, toursLoading } = useBookingForm(
    selectedTourId,
    adults,
    children
  );

  // Pricing calculations
  const {
    pricing,
    pricingLoading,
    totalNights,
    totalGuests,
    effectiveAdults,
  } = useBookingPricing(
    selectedTourId,
    checkInDate,
    checkOutDate,
    rooms,
    addOns,
    adults,
    children
  );

  // Yeni: adults, children ve rooms state'inde değişiklik olduğunda logla
  // (Debug amaçlı)
  if (typeof window !== "undefined") {
    console.log("useModernBookingForm --- adults, children, rooms", {
      adults, children, rooms,
    });
  }

  // Submission handling
  const { onSubmit: handleSubmit, createPayment } = useBookingSubmission();

  const selectedTour = tours.find(tour => tour.id === selectedTourId);
  const isMultiDayTour =
    selectedTour?.tour_type === 'multiple_day' ||
    selectedTour?.duration > 1 ||
    selectedTour?.requires_accommodation;

  console.log('useModernBookingForm - Selected tour:', {
    selectedTour: selectedTour?.name,
    isMultiDayTour,
    customersCount: customers.length
  });

  // Burada onSubmit'i, ModernBookingForm.tsx tarafından beklenen tüm parametrelerle uyumlu hale getiriyoruz
  const onSubmit = (
    values: any,
    checkInDate?: Date,
    checkOutDate?: Date,
    isMultiDayTourParam: boolean = false,
    roomsParam: any[] = [],
    addOnsParam: string[] = [],
    pricingObj: { total: number } = { total: 0 },
    wantsAccount?: boolean | null,
    selectedTourParam?: any
  ) => {
    // isMultiDayTour tercihen parametreden veya üst değişkenden alınabilir
    return handleSubmit(
      values,
      checkInDate,
      checkOutDate,
      isMultiDayTourParam ?? isMultiDayTour,
      roomsParam.length ? roomsParam : rooms,
      addOnsParam.length ? addOnsParam : addOns,
      pricingObj,
      wantsAccount,
      selectedTourParam ?? selectedTour
    );
  };

  return {
    form,
    tours,
    toursLoading,
    selectedTourId,
    setSelectedTourId,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    adults: effectiveAdults,
    setAdults,
    children,
    setChildren,
    customers,
    setCustomers,
    rooms,
    setRooms,
    addOns,
    setAddOns,
    pricing,
    pricingLoading,
    totalNights,
    totalGuests,
    selectedTour,
    isMultiDayTour,
    createPayment,
    onSubmit,
  };
};
