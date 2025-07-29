
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useTours, useTourAvailability } from "@/hooks/useTours";
import { useCreatePayment } from "@/hooks/usePayments";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  tourId: z.string().min(1, "Please select a tour"),
  bookingDate: z.date({
    required_error: "Please select a date",
  }),
  adults: z.number().min(1, "At least 1 adult is required"),
  children: z.number().min(0, "Children cannot be negative"),
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Please enter a valid email"),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

export type BookingFormData = z.infer<typeof formSchema>;

export const useBookingForm = (preselectedTourId?: string) => {
  const { user } = useAuth();
  const [selectedTourId, setSelectedTourId] = useState<string>("");
  
  console.log('useBookingForm - preselectedTourId received:', preselectedTourId);
  
  const { data: tours = [], isLoading: toursLoading } = useTours();
  const { data: availability = [] } = useTourAvailability(selectedTourId);
  const createPayment = useCreatePayment();
  
  // Function to convert numeric ID to actual tour UUID
  const convertToActualTourId = (id: string): string => {
    if (!id || tours.length === 0) return id;
    
    // If it's already a UUID, return as is
    if (!/^\d+$/.test(id)) return id;
    
    // If it's numeric, try to find the corresponding tour
    const numericIndex = parseInt(id) - 1; // Assuming 1-based indexing
    if (numericIndex >= 0 && numericIndex < tours.length) {
      const actualId = tours[numericIndex].id;
      console.log('useBookingForm - Converting numeric ID to UUID:', id, '->', actualId);
      return actualId;
    }
    
    return id;
  };
  
  const form = useForm<BookingFormData>({
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
  
  // Handle preselected tour ID conversion and setting
  useEffect(() => {
    if (preselectedTourId && tours.length > 0) {
      console.log('useEffect - Processing preselectedTourId:', preselectedTourId);
      console.log('useEffect - Available tours:', tours.map(t => ({ id: t.id, name: t.name })));
      
      const actualTourId = convertToActualTourId(preselectedTourId);
      
      // Verify the tour exists
      const tour = tours.find(t => t.id === actualTourId);
      
      if (tour) {
        console.log('useEffect - Setting tour:', actualTourId);
        form.setValue("tourId", actualTourId);
        setSelectedTourId(actualTourId);
        console.log('useEffect - Tour set successfully');
      } else {
        console.log('useEffect - Tour not found with ID:', actualTourId);
      }
    }
  }, [preselectedTourId, tours, form]);
  
  const selectedTour = tours.find(tour => tour.id === selectedTourId);
  const selectedDate = form.watch("bookingDate");
  const adults = form.watch("adults");
  const children = form.watch("children");
  
  // Calculate total price
  const totalPrice = selectedTour 
    ? Number(selectedTour.price) * (adults + children * 0.5)
    : 0;
  
  // Check if selected date has availability
  const dateAvailability = availability.find(
    avail => avail.available_date === format(selectedDate || new Date(), "yyyy-MM-dd")
  );
  
  const hasAvailability = dateAvailability && 
    dateAvailability.available_spots >= (adults + children);

  const onSubmit = async (values: BookingFormData) => {
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
        // Guest checkout - no user ID required
        userId: user?.id || null,
      });
      
      // Redirect to Stripe checkout
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
    totalPrice,
    hasAvailability,
    dateAvailability,
    createPayment,
    onSubmit,
    user,
  };
};
