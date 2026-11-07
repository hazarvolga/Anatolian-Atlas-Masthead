"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function ToursHeader() {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-background border-b border-border">
      <div className="container">
        <div className="max-w-3xl space-y-3">
          <span className="editorial-kicker block">
            ANATOLIAN ATLAS — ROUTE CATALOG
          </span>
          <h1 className="font-serif text-foreground">
            {t.tours.title || "Journeys & Itineraries"}
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            {t.tours.description ||
              "Filter by region, duration, walking pace, and group size to find the right itinerary across Türkiye."}
          </p>
        </div>
      </div>
    </section>
  );
}
