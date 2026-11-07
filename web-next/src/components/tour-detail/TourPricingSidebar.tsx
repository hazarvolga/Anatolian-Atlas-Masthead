"use client";

import Link from "next/link";
import { Calendar, Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface TourPricingSidebarProps {
  tour: {
    id: string;
    price: number;
    rating?: number;
    duration: number;
    max_group_size?: number;
    tour_type?: "one_day" | "multiple_day" | "date_range";
  };
}

export default function TourPricingSidebar({ tour }: TourPricingSidebarProps) {
  const { t } = useLanguage();
  const hasVerifiedRating =
    typeof tour.rating === "number" && tour.rating > 0;

  return (
    <div className="space-y-6">
      <Card className="sticky top-28 border-border bg-card">
        <CardContent className="p-6 space-y-6">
          <div className="pb-5 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-1">
              {t.tours.from || "From"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-4xl font-medium text-foreground tabular-nums">
                €{tour.price}
              </span>
              <span className="text-sm text-text-secondary">/ person</span>
            </div>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {t.tourDetail.duration}:
              </span>
              <span className="font-medium text-foreground tabular-nums">
                {tour.tour_type === "multiple_day"
                  ? `${tour.duration} ${t.tours.days}`
                  : `${tour.duration} hours`}
              </span>
            </div>

            {tour.max_group_size && (
              <div className="flex items-center justify-between">
                <span className="text-text-secondary inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  {t.tourDetail.groupSize}:
                </span>
                <span className="font-medium text-foreground tabular-nums">
                  Max {tour.max_group_size} {t.tourDetail.people}
                </span>
              </div>
            )}

            {hasVerifiedRating && (
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">
                  {t.tourDetail.rating}:
                </span>
                <div className="flex items-center gap-1 tabular-nums">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{tour.rating?.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          <Button asChild className="w-full btn-primary h-12" size="lg">
            <Link href={`/book/${tour.id}`}>
              <Calendar className="h-4 w-4 mr-2" />
              {t.tourDetail.bookTour}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
