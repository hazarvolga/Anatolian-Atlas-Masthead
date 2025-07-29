
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useTours, useTourAvailability } from "@/hooks/useTours";
import { useCreatePayment } from "@/hooks/usePayments";
import { useEnhancedBooking } from "@/hooks/useEnhancedBooking";
import { toast } from "@/components/ui/use-toast";
import { Customer, formSchema, EnhancedBookingFormData } from "@/types/booking";

export const useEnhancedBookingForm = (preselectedTourId?: string) => {
  const { user } = useAuth();
  const [selectedTourId, setSelectedTourId] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  console.log('useEnhancedBookingForm - preselectedTourId received:', preselectedTourId);
  
  const { data: tours = [], isLoading: toursLoading } = useTours();
  const { data: availability = [] } = useTourAvailability(selectedTourId);
  const createPayment = useCreatePayment();
  const { bookingData, updateBookingData } = useEnhancedBooking();
  
  const form = useForm<EnhancedBookingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tourId: "",
      adults: 1,
      children: 0,
      guestName: "",
      guestEmail: user?.email || "",
      guestPhone: "",
      specialRequests: "",
    },
  });
  
  // Handle preselected tour ID
  useEffect(() => {
    if (preselectedTourId && tours.length > 0) {
      console.log('useEffect - Processing preselectedTourId:', preselectedTourId);
      
      const tour = tours.find(t => t.id === preselectedTourId);
      
      if (tour) {
        console.log('useEffect - Setting tour:', preselectedTourId);
        form.setValue("tourId", preselectedTourId);
        setSelectedTourId(preselectedTourId);
        updateBookingData({ tourId: preselectedTourId });
        console.log('useEffect - Tour set successfully');
      } else {
        console.log('useEffect - Tour not found with ID:', preselectedTourId);
      }
    }
  }, [preselectedTourId, tours, form, updateBookingData]);
  
  const selectedTour = tours.find(tour => tour.id === selectedTourId);
  const selectedDate = form.watch("bookingDate");
  const adults = form.watch("adults");
  const children = form.watch("children");
  
  // Update form values when customers change
  useEffect(() => {
    const totalAdults = customers.filter(c => c.type === 'adult').reduce((sum, c) => sum + c.count, 0);
    const totalChildren = customers.filter(c => c.type === 'child').reduce((sum, c) => sum + c.count, 0);
    
    if (totalAdults > 0) {
      form.setValue("adults", totalAdults);
    }
    form.setValue("children", totalChildren);
  }, [customers, form]);
  
  // Calculate total price (simplified for now)
  const totalPrice = selectedTour 
    ? Number(selectedTour.price) * (adults + children * 0.5)
    : 0;
  
  // Check if selected date has availability
  const dateAvailability = availability.find(
    avail => avail.available_date === format(selectedDate || new Date(), "yyyy-MM-dd")
  );
  
  const hasAvailability = dateAvailability && 
    dateAvailability.available_spots >= (adults + children);

  const onSubmit = async (values: EnhancedBookingFormData) => {
    if (!hasAvailability) {
      toast({
        title: "No Availability",
        description: "This tour is not available for the selected date and group size.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const paymentData = await createPayment.mutateAsync({
        tourId: values.tourId,
        bookingDate: format(values.bookingDate, "yyyy-MM-dd"),
        adults: values.adults,
        children: values.children,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        specialRequests: values.specialRequests,
        userId: user?.id || null,
      });
      
      if (paymentData.url) {
        window.open(paymentData.url, '_blank');
      }
      
    } catch (error) {
      console.error("Payment session creation error:", error);
    }
  };

  return {
    form,
    selectedTourId,
    setSelectedTourId,
    tours,
    toursLoading,
    selectedTour,
    selectedDate,
    adults,
    children,
    customers,
    setCustomers,
    totalPrice,
    hasAvailability,
    dateAvailability,
    createPayment,
    onSubmit,
    user,
    pricingBreakdown: [],
    pricingLoading: false,
    hasPricingData: false,
    pricingError: null,
  };
};
