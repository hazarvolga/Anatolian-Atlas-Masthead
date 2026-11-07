"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateDestination, useUpdateDestination, type CreateDestinationData } from "@/hooks/useDestinations";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAIDestinationHelper } from "@/hooks/useAIDestinationHelper";
import type { DestinationFormData } from "./destination-form/BasicDestinationInfo";

export const destinationSchema = z.object({
  name: z.string().min(1, "Destinasyon adı gereklidir"),
  description: z.string().optional(),
  country: z.string().min(1, "Ülke gereklidir"),
  city: z.string().min(1, "Şehir gereklidir"),
  image_url: z.string().url().optional().or(z.literal("")),
  is_active: z.boolean(),
  coords: z.string().optional(),
  best_time: z.string().optional(),
  activities: z.string().optional(),
  google_maps_url: z.string().url().optional().or(z.literal("")),
  gallery_images: z
    .string()
    .optional()
    .transform(str => str
      ? str.split(",").map(x => x.trim()).filter(Boolean)
      : []),
  extra_info: z.string().optional()
});

export function useAdminDestinationFormLogic({ destination, onSuccess }: { destination?: any, onSuccess?: () => void }) {
  const createDestination = useCreateDestination();
  const updateDestination = useUpdateDestination();
  
  const { token } = useAuth();
  const accessToken = token || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationSchema) as any,
    defaultValues: destination
      ? {
          name: destination.name,
          description: destination.description || "",
          country: destination.country || "",
          city: destination.city || "",
          image_url: destination.image_url || "",
          is_active: destination.is_active ?? true,
          coords: destination.coords || "",
          best_time: destination.best_time || "",
          activities: destination.activities || "",
          google_maps_url: destination.google_maps_url || "",
          gallery_images: Array.isArray(destination.gallery_images)
            ? destination.gallery_images.join(", ")
            : "",
          extra_info: destination.extra_info || ""
        }
      : {
          country: "Türkiye",
          is_active: true,
          google_maps_url: "",
          gallery_images: [],
          extra_info: ""
        },
  });

  // AI hooks and state
  const [aiDescOpen, setAIDescOpen] = useState(false);
  const [aiEnrichOpen, setAIEnrichOpen] = useState(false);
  const {
    loading: aiLoading,
    aiResult,
    askAIForDescription,
    getImageAltText,
    imageHelper,
    enrichedData,
    enrichData,
  } = useAIDestinationHelper({ accessToken });

  // Inputs for AI
  const name = watch("name");
  const city = watch("city");
  const country = watch("country");

  // AI description fetch
  const handleAIGetDesc = () => {
    setAIDescOpen(true);
    askAIForDescription(name, country, city);
  };

  const handleAcceptAIDesc = () => {
    if (aiResult) setValue("description", aiResult);
    setAIDescOpen(false);
  };

  // AI alt text fetch for image
  const handleGetImageAlt = () => {
    const image_url = watch("image_url");
    getImageAltText(image_url, name);
  };
  
  // AI enrichment
  const handleAIEnrich = () => {
    setAIEnrichOpen(true);
    enrichData(name, country, city);
  };

  const handleAcceptEnrich = (field: "coords" | "bestTime" | "activities", value: string | string[]) => {
    if (field === "coords") setValue("coords", value as string);
    if (field === "bestTime") setValue("best_time", value as string);
    if (field === "activities") {
      setValue("activities", typeof value === "string" ? value : (value as string[]).join(", "));
    }
    setAIEnrichOpen(false);
  };

  const handleAcceptAllEnrich = () => {
    if (enrichedData) {
      if (enrichedData.coords)
        setValue("coords", enrichedData.coords);
      if (enrichedData.bestTime)
        setValue("best_time", enrichedData.bestTime);
      if (enrichedData.activities)
        setValue("activities", Array.isArray(enrichedData.activities)
          ? enrichedData.activities.join(", ") : enrichedData.activities);
    }
    setAIEnrichOpen(false);
  };

  const onSubmit = async (data: DestinationFormData) => {
    const destinationData: CreateDestinationData = {
      name: data.name,
      description: data.description,
      country: data.country,
      city: data.city,
      image_url: data.image_url || undefined,
      is_active: data.is_active,
      coords: data.coords,
      best_time: data.best_time,
      activities: data.activities,
      google_maps_url: data.google_maps_url,
      gallery_images: data.gallery_images as string[],
      extra_info: data.extra_info
    };
    
    if (destination) {
      await updateDestination.mutateAsync({ destinationId: destination.id, destinationData });
    } else {
      await createDestination.mutateAsync(destinationData);
    }
    
    onSuccess?.();
  };

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    aiDescOpen,
    setAIDescOpen,
    aiEnrichOpen,
    setAIEnrichOpen,
    aiLoading,
    aiResult,
    askAIForDescription,
    getImageAltText,
    imageHelper,
    enrichedData,
    enrichData,
    handleAIGetDesc,
    handleAcceptAIDesc,
    handleGetImageAlt,
    handleAIEnrich,
    handleAcceptEnrich,
    handleAcceptAllEnrich,
    onSubmit,
    createDestination,
    updateDestination
  };
}
