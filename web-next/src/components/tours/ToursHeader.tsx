"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function ToursHeader() {
  const { t } = useLanguage();

  return (
    <section className="py-14 md:py-20 bg-card border-b border-border">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <span className="editorial-kicker block">
              03 — EXPEDITION CATALOGUE & SCHEDULED DEPARTURES
            </span>
            <h1 className="font-serif text-foreground">
              {t.tours.title || "Journeys & Field Itineraries"}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:text-right space-y-3">
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              {t.tours.description ||
                "Filter by region, duration, walking pace, and group size to inspect our scheduled departures across Türkiye."}
            </p>
            <span className="inline-block text-[11px] uppercase tracking-[0.16em] text-primary font-semibold tabular-nums">
              ALL ROUTES LED BY LICENSED HISTORIANS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
