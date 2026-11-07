"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TourCard from "@/components/TourCard";
import { Button } from "@/components/ui/button";
import { useTours } from "@/hooks/useTours";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ToursSection() {
  const { t } = useLanguage();
  const { data: tours, isLoading, error } = useTours();

  const safeTours = Array.isArray(tours) ? tours.slice(0, 6) : [];

  return (
    <section className="section bg-muted/35 border-b border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="editorial-kicker block">
              02 — SELECTED JOURNEYS
            </span>
            <h2 className="font-serif text-foreground">
              {t.home.featuredTours}
            </h2>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed">
              {t.home.featuredToursSubtitle}
            </p>
          </div>
          <Button asChild variant="outline" className="btn-outline shrink-0">
            <Link href="/tours" className="inline-flex items-center">
              <span>{t.home.booking.viewTours}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-lg bg-card animate-pulse border border-border"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-lg border border-border bg-card text-center">
            <p className="text-text-secondary">
              Unable to load journeys at the moment.
            </p>
          </div>
        ) : safeTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safeTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
