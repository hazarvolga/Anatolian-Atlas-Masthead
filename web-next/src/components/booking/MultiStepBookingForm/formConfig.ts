"use client";


import * as z from "zod";

export const formSchema = z.object({
  tourId: z.string().min(1, "Please select a tour"),
  adults: z.number().min(1, "At least 1 adult is required"),
  children: z.number().min(0, "Children cannot be negative"),
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Please enter a valid email"),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export interface MultiStepBookingFormProps {
  preselectedTourId?: string;
}
