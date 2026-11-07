"use client";


import { useState } from "react";

// Strict itinerary item type: all keys required
export type StrictItineraryItem = { day: number; title: string; description: string };

interface UseAdminTourFormStateProps {
  tour?: any;
}

// Helper to convert any input array to strictly typed itinerary array
const toStrictItinerary = (raw: any[] | undefined): StrictItineraryItem[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any) => ({
    day: typeof item.day === "number" ? item.day : 1,
    title: typeof item.title === "string" ? item.title : "",
    description: typeof item.description === "string" ? item.description : "",
  }));
};

export const useAdminTourFormState = ({ tour }: UseAdminTourFormStateProps) => {
  const [highlights, setHighlights] = useState<string[]>(tour?.highlights || []);
  const [included, setIncluded] = useState<string[]>(tour?.included || []);
  const [excluded, setExcluded] = useState<string[]>(tour?.excluded || []);
  const [benefits, setBenefits] = useState<string[]>(tour?.benefits || []);
  // Always strict structure
  const [itinerary, setItinerary] = useState<StrictItineraryItem[]>(toStrictItinerary(tour?.itinerary));
  const [activeTab, setActiveTab] = useState("basic");

  return {
    highlights,
    included,
    excluded,
    benefits,
    itinerary,
    activeTab,
    setHighlights,
    setIncluded,
    setExcluded,
    setBenefits,
    setItinerary, // enforce user to always pass correct typed array
    setActiveTab,
  };
};
