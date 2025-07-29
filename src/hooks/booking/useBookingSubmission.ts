import { useCreatePayment } from "@/hooks/usePayments";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { FormData } from "./useBookingForm";

export const useBookingSubmission = () => {
  const { user } = useAuth();
  const createPayment = useCreatePayment();

  const onSubmit = async (
    values: FormData,
    checkInDate?: Date,
    checkOutDate?: Date,
    isMultiDayTour: boolean = false,
    rooms: any[] = [],
    addOns: string[] = [],
    pricing: { total: number } = { total: 0 },
    wantsAccount?: boolean | null,
    selectedTour?: any
  ) => {
    console.log('Form submission started with values:', values);
    console.log('Current form state for submission:', {
      checkInDate,
      checkOutDate,
      isMultiDayTour,
      rooms: rooms.length,
      pricingTotal: pricing.total,
      user: !!user
    });

    // Validation checks
    if (!checkInDate) {
      toast({
        title: "Missing Date",
        description: "Please select your travel date.",
        variant: "destructive",
      });
      return;
    }

    if (isMultiDayTour && !checkOutDate) {
      toast({
        title: "Missing Check-out Date",
        description: "Please select your check-out date for this multi-day tour.",
        variant: "destructive",
      });
      return;
    }

    if (isMultiDayTour && rooms.length === 0) {
      toast({
        title: "No Rooms Selected",
        description: "Please configure your room preferences for this multi-day tour.",
        variant: "destructive",
      });
      return;
    }

    if (pricing.total <= 0) {
      toast({
        title: "Pricing Error",
        description: "Unable to calculate pricing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Submitting payment request...');
      // NOT: addOns bilgisi booking insert'inde bookings tablosuna gönderilmeyecek!

      const paymentData = await createPayment.mutateAsync({
        tourId: values.tourId,
        bookingDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate?.toISOString().split('T')[0],
        adults: values.adults,
        children: values.children,
        rooms: rooms,
        total_price: pricing.total,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        specialRequests: values.specialRequests,
        userId: user?.id || null,
      });

      console.log('Payment response received:', paymentData);

      if (paymentData?.url) {
        console.log('Redirecting to payment URL:', paymentData.url);
        window.location.href = paymentData.url;
      } else {
        throw new Error('No payment URL received');
      }

      // Eğer kullanıcı üye olmak isterse ekstra API isteğiyle kullanıcı oluştur, sonra mail at:
      if (wantsAccount) {
        await fetch("/api/send-welcome-account-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.guestEmail,
            fullName: values.guestName,
            tour: selectedTour?.name,
            destination: selectedTour?.location,
          })
        });
      } else {
        await fetch("/api/send-booking-guest-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.guestEmail,
            fullName: values.guestName,
            tour: selectedTour?.name,
            destination: selectedTour?.location,
          })
        });
      }
    } catch (error) {
      console.error("Payment session creation error:", error);
      toast({
        title: "Booking Error",
        description: error instanceof Error ? error.message : "Unable to process your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    onSubmit,
    createPayment,
  };
};
