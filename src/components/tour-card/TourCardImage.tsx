
import { useState } from "react";
import { Star, Heart, MapPin, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourCardImageProps {
  tour: {
    id: string;
    name: string;
    price: number;
    duration: number;
    max_group_size: number;
    image_url?: string;
    location?: string;
    rating?: number;
    difficulty?: string;
    tour_type?: 'multiple_day' | 'one_day' | 'date_range';
    destinations?: {
      city?: string;
      country?: string;
    };
  };
  isHovered: boolean;
}

export default function TourCardImage({ tour, isHovered }: TourCardImageProps) {
  const [isLiked, setIsLiked] = useState(false);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success bg-success/10 border-success/20';
      case 'moderate': return 'text-warning bg-warning/10 border-warning/20';
      case 'challenging': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getTourTypeLabel = (type?: string) => {
    switch (type) {
      case 'multiple_day': return 'Multi-Day';
      case 'one_day': return 'One Day';
      case 'date_range': return 'Date Range';
      default: return 'One Day';
    }
  };

  const getTourTypeColor = (type?: string) => {
    switch (type) {
      case 'multiple_day': return 'text-primary bg-primary/10 border-primary/20';
      case 'one_day': return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'date_range': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-secondary bg-secondary/10 border-secondary/20';
    }
  };

  const location = tour.destinations ? 
    `${tour.destinations.city}, ${tour.destinations.country}` : 
    tour.location || 'Unknown Location';

  return (
    <div className="relative overflow-hidden h-64 md:h-72 rounded-t-2xl">
      <img 
        src={tour.image_url || "/placeholder.svg"} 
        alt={tour.name}
        className={cn(
          "w-full h-full object-cover transition-transform duration-700",
          isHovered ? "scale-110" : "scale-100"
        )}
      />
      
      {/* Enhanced Overlay with Blue Theme */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80",
        "transition-all duration-500",
        isHovered ? "to-black/70" : ""
      )} />
      
      {/* Top Badges with Modern Design */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-white/20">
          <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
          <span className="text-sm font-semibold text-gray-900">{tour.rating || 4.5}</span>
        </div>
      </div>
      
      {/* Top Right Badges with Blue Theme */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className={cn(
            "p-2 rounded-full backdrop-blur-sm transition-all duration-300 border",
            isLiked 
              ? "bg-primary text-white border-primary/20" 
              : "bg-white/90 text-gray-600 hover:bg-white hover:text-primary border-white/20"
          )}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
        </button>
        
        {tour.difficulty && typeof tour.difficulty === 'string' && (
          <span className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm",
            getDifficultyColor(tour.difficulty)
          )}>
            {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
          </span>
        )}
        
        <span className={cn(
          "px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm",
          getTourTypeColor(tour.tour_type)
        )}>
          {getTourTypeLabel(tour.tour_type)}
        </span>
      </div>
      
      {/* Bottom Info Overlay with Enhanced Typography */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2 leading-tight">
            {tour.name}
          </h3>
          <div className="flex items-center text-white/90 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate font-medium">{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-white/90 text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1.5" />
                <span className="font-medium">{tour.max_group_size} max</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                <span className="font-medium">
                  {tour.tour_type === 'multiple_day' 
                    ? `${tour.duration} days` 
                    : `${tour.duration}h`
                  }
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                €{tour.price}
              </div>
              <div className="text-xs text-white/70 font-medium">per person</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
