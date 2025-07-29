
import { MapPin, Star } from "lucide-react";

interface TourHeroSectionProps {
  tour: {
    name: string;
    image_url?: string;
    rating?: number;
  };
  location: string;
}

export default function TourHeroSection({ tour, location }: TourHeroSectionProps) {
  return (
    <div className="relative h-[60vh] overflow-hidden">
      <img
        src={tour.image_url || "/placeholder.svg"}
        alt={tour.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{tour.name}</h1>
            <div className="flex items-center gap-4 text-lg">
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>{tour.rating || 4.5}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
