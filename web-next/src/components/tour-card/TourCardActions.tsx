"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface TourCardActionsProps {
  tourId: string;
  price?: number;
}

export default function TourCardActions({
  tourId,
  price,
}: TourCardActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
      <div>
        <span className="block text-[11px] uppercase tracking-wider text-text-secondary">
          {t.tours.from || "From"}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="font-serif text-2xl font-medium text-foreground tabular-nums">
            €{price ?? 0}
          </span>
          <span className="text-xs text-text-secondary">/ person</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 px-3.5 text-xs font-medium"
        >
          <Link href={`/tours/${tourId}`}>
            {t.tours.viewDetails || "Itinerary"}
          </Link>
        </Button>
        <Button asChild size="sm" className="h-9 px-4 text-xs font-medium">
          <Link href={`/book/${tourId}`} className="inline-flex items-center">
            <span>{t.tours.bookNow || "Reserve"}</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
