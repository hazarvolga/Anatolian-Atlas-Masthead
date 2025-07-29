
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
        // Modern Blue Theme Card with enhanced hover effects
        "group relative overflow-hidden rounded-2xl bg-card border border-border/30",
        "shadow-lg hover:shadow-2xl hover:shadow-primary/15",
        "transition-all duration-500 hover:-translate-y-3 transform",
        "cursor-pointer",
        isHovered ? "shadow-2xl shadow-primary/20 border-primary/30" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section with enhanced overlay */}
      <TourCardImage tour={tour} isHovered={isHovered} />
      
      {/* Content Section with modern spacing */}
      <div className="p-6 space-y-5">
        <TourCardContent tour={tour} />
        
        {/* Action Buttons with modern styling */}
        <TourCardActions tourId={tour.id} />
      </div>
      
      {/* Subtle accent border on hover */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl border-2 border-transparent",
          "transition-all duration-500",
          isHovered ? "border-primary/20" : ""
        )}
      />
    </div>
  );
}
