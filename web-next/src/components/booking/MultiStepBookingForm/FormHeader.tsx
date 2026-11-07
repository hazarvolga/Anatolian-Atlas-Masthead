"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface FormHeaderProps {
  tourName?: string;
}

export default function FormHeader({ tourName }: FormHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-8 pb-6 border-b border-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <span className="editorial-kicker block mb-1">
          SELECTED FIELD ITINERARY
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground">
          {tourName || t.booking.bookYourTour}
        </h2>
      </div>
      <p className="text-xs uppercase tracking-[0.14em] text-text-secondary">
        {t.booking.completeBookingSteps}
      </p>
    </div>
  );
}
