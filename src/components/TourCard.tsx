
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import TourCardImage from "./tour-card/TourCardImage";
import TourCardContent from "./tour-card/TourCardContent";
import TourCardActions from "./tour-card/TourCardActions";

interface TourCardProps {
  tour: {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    max_group_size: number;
    image_url?: string;
    location?: string;
    highlights?: string[];
    rating?: number;
    difficulty?: string;
    tour_type?: 'multiple_day' | 'one_day' | 'date_range';
    destinations?: {
      city?: string;
      country?: string;
    };
  };
}

export default function TourCard({ tour }: TourCardProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  
  console.log('TourCard - tour ID:', tour.id);
  
  return (
    <div 
      className={cn(
        "group tour-card transition-all duration-500",
        isHovered ? "shadow-2xl shadow-primary/15" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <TourCardImage tour={tour} isHovered={isHovered} />
      
      {/* Content Section */}
      <div className="p-6 space-y-4">
        <TourCardContent tour={tour} />
        
        {/* Action Buttons */}
        <TourCardActions tourId={tour.id} />
      </div>
    </div>
  );
}
