"use client";

import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminTourFormState } from "./useAdminTourFormState";
import { useAdminTourPricing } from "./useAdminTourPricing";
import { useAdminTourSubmit } from "./useAdminTourSubmit";

// Zod şeması - itinerary tüm alanları optional olarak tanımlanıyor ama transform ile zorunlu hale getiriliyor
const tourSchema = z.object({
  name: z.string().min(1, "Tour name is required"),
  description: z.string().min(1, "Description is required"),
  // Price is conditionally required only for one_day tours, for multi-day tours this is calculated from room prices
  price: z.number().min(0, "Price must be positive"),
  duration: z.number().min(0.5, "Duration must be at least 0.5 hours"),
  max_group_size: z.number().min(1, "Group size must be at least 1"),
  destination_id: z.string().min(1, "Destination is required"),
  difficulty: z.enum(["easy", "moderate", "challenging"]),
  tour_type: z.enum(["one_day", "multiple_day", "date_range"]),
  image_url: z.string().url().optional().or(z.literal("")),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  deposit: z.number().min(0, "Deposit must be positive").optional(), // Added deposit field
  highlights: z.array(z.string()).optional(),
  departure_location: z.string().optional(),
  departure_time: z.string().optional(),
  return_time: z.string().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  itinerary: z.array(
    z.object({
      day: z.number().optional(),
      title: z.string().optional(),
      description: z.string().optional()
    })
  ).optional().transform((arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item, index) => ({
      day: typeof item?.day === "number" && !isNaN(item.day) ? item.day : index + 1,
      title: typeof item?.title === "string" && item.title.trim() !== "" ? item.title : `Day ${index + 1}`,
      description: typeof item?.description === "string" && item.description.trim() !== "" ? item.description : "Description pending",
    }));
  }),
  is_active: z.boolean().optional(),
});

export type TourFormData = z.infer<typeof tourSchema>;

interface UseAdminTourFormProps {
  tour?: any;
  onSuccess?: () => void;
}

export const useAdminTourForm = ({ tour, onSuccess }: UseAdminTourFormProps) => {
  // Use smaller focused hooks
  const formState = useAdminTourFormState({ tour });
  const pricingState = useAdminTourPricing({ tour });
  const submitHandler = useAdminTourSubmit({ tour, onSuccess });

  // Her zaman ZORUNLU alanlar döner - itinerary için güvenli dönüşüm
  const getValidItinerary = (itineraryRaw: any[] | undefined): Array<{ day: number; title: string; description: string; }> => {
    if (!Array.isArray(itineraryRaw)) return [];
    // Her öğede zorunlu alan kontrolleri (eksikse default set et)
    return itineraryRaw.map((item: any, index: number) => ({
      day: typeof item?.day === "number" && !isNaN(item.day) ? item.day : index + 1,
      title: typeof item?.title === "string" && item.title.trim() !== "" ? item.title : `Day ${index + 1}`,
      description: typeof item?.description === "string" && item.description.trim() !== "" ? item.description : "Description pending",
    }));
  };

  const form: UseFormReturn<TourFormData> = useForm<TourFormData>({
    resolver: zodResolver(tourSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 1,
      max_group_size: 10,
      destination_id: "",
      difficulty: "easy",
      tour_type: "one_day",
      image_url: "",
      start_date: "",
      end_date: "",
      highlights: [],
      departure_location: "",
      departure_time: "",
      return_time: "",
      included: [],
      excluded: [],
      benefits: [],
      itinerary: [],
      is_active: true,
      deposit: 0,
    },
  });

  // Reset form with tour data when tour changes
  useEffect(() => {
    if (tour) {
      form.reset({
        name: tour.name || "",
        description: tour.description || "",
        price: typeof tour.price === "number" ? tour.price : 0,
        duration: Number(tour.duration) || 1,
        max_group_size: typeof tour.max_group_size === "number" ? tour.max_group_size : 10,
        destination_id: tour.destination_id || "",
        difficulty: tour.difficulty || "easy",
        tour_type: tour.tour_type || "one_day",
        image_url: tour.image_url || "",
        start_date: tour.start_date || "",
        end_date: tour.end_date || "",
        highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
        departure_location: tour.departure_location || "",
        departure_time: tour.departure_time || "",
        return_time: tour.return_time || "",
        included: Array.isArray(tour.included) ? tour.included : [],
        excluded: Array.isArray(tour.excluded) ? tour.excluded : [],
        benefits: Array.isArray(tour.benefits) ? tour.benefits : [],
        itinerary: getValidItinerary(tour.itinerary),
        is_active: typeof tour.is_active === "boolean" ? tour.is_active : true,
        deposit: typeof tour.deposit === "number" ? tour.deposit : 0,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        price: 0,
        duration: 1,
        max_group_size: 10,
        destination_id: "",
        difficulty: "easy",
        tour_type: "one_day",
        image_url: "",
        start_date: "",
        end_date: "",
        highlights: [],
        departure_location: "",
        departure_time: "",
        return_time: "",
        included: [],
        excluded: [],
        benefits: [],
        itinerary: [],
        is_active: true,
        deposit: 0,
      });
    }
  }, [tour, form]);

  const basePrice = form.watch("price");

  // Sync form values with state
  useEffect(() => {
    form.setValue("highlights", formState.highlights);
  }, [formState.highlights, form]);

  useEffect(() => {
    form.setValue("included", formState.included);
  }, [formState.included, form]);

  useEffect(() => {
    form.setValue("excluded", formState.excluded);
  }, [formState.excluded, form]);

  useEffect(() => {
    form.setValue("benefits", formState.benefits);
  }, [formState.benefits, form]);

  useEffect(() => {
    // Her zaman zorunlu shape döndürülecek!
    form.setValue("itinerary", getValidItinerary(formState.itinerary));
  }, [formState.itinerary, form]);

  // Ensure destination_id is always consistent in form
  useEffect(() => {
    if (tour && tour.destination_id) {
      form.setValue("destination_id", tour.destination_id);
    }
  }, [tour, form]);

  const onSubmit = async (data: TourFormData, shouldClose: boolean = true) => {
    await submitHandler.onSubmit(
      data,
      {
        highlights: formState.highlights,
        included: formState.included,
        excluded: formState.excluded,
        benefits: formState.benefits,
        itinerary: getValidItinerary(formState.itinerary),
        shouldClose, // Pass the shouldClose parameter
      },
      pricingState.savePricingData
    );
  };

  return {
    form,
    basePrice,
    onSubmit,
    ...formState,
    ...pricingState,
  };
};
