import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { DEFAULT_DEMO_HERO_IMAGE } from "@/lib/data/demo-images";

interface TourHeroSectionProps {
  tour: {
    name: string;
    image_url?: string;
    rating?: number;
  };
  location: string;
}

export default function TourHeroSection({
  tour,
  location,
}: TourHeroSectionProps) {
  const hasVerifiedRating =
    typeof tour.rating === "number" && tour.rating > 0;

  return (
    <div className="relative h-[52vh] min-h-[360px] overflow-hidden bg-atlas-ink">
      <Image
        src={tour.image_url || DEFAULT_DEMO_HERO_IMAGE}
        alt={tour.name}
        width={1400}
        height={800}
        priority
        sizes="100vw"
        className="w-full h-full object-cover opacity-85"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-10">
          <div className="max-w-3xl text-atlas-paper space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-sm text-atlas-paper/90">
              <div className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{location}</span>
              </div>
              {hasVerifiedRating && (
                <div className="inline-flex items-center gap-1 tabular-nums">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{tour.rating?.toFixed(1)}</span>
                </div>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-atlas-paper leading-tight">
              {tour.name}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
