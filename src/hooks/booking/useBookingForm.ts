
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useTours } from "@/hooks/useTours";

const formSchema = z.object({
  tourId: z.string().min(1, "Please select a tour"),
  adults: z.number().min(1, "At least 1 adult is required"),
  children: z.number().min(0, "Children cannot be negative"),
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Please enter a valid email"),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export const useBookingForm = (selectedTourId?: string, adults: number = 1, children: number = 0) => {
  const { user } = useAuth();
  const { data: tours = [], isLoading: toursLoading } = useTours();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tourId: selectedTourId || "",
      adults: 1,
      children: 0,
      guestName: user?.user_metadata?.full_name || "",
      guestEmail: user?.email || "",
      guestPhone: "",
      specialRequests: "",
    },
  });

  // Set preselected tour if provided
  useEffect(() => {
    if (selectedTourId && tours.length > 0) {
      console.log('Setting preselected tour:', selectedTourId);
      const tour = tours.find(t => t.id === selectedTourId);
      if (tour) {
        form.setValue("tourId", selectedTourId);
        console.log('Tour found and set:', tour.name);
      } else {
        console.log('Tour not found with ID:', selectedTourId);
      }
    }
  }, [selectedTourId, tours, form]);

  // Update user info when user changes
  useEffect(() => {
    if (user) {
      form.setValue("guestEmail", user.email || "");
      form.setValue("guestName", user.user_metadata?.full_name || "");
    }
  }, [user, form]);

  // Update form when guests change
  useEffect(() => {
    form.setValue("adults", adults);
    form.setValue("children", children);
  }, [adults, children, form]);

  return {
    form,
    tours,
    toursLoading,
  };
};
