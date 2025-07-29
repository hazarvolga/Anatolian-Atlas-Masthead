
import { Camera } from "lucide-react";

interface TourCardContentProps {
  tour: {
    description?: string;
    highlights?: string[];
  };
}

export default function TourCardContent({ tour }: TourCardContentProps) {
  return (
    <div className="space-y-4">
      <p className="text-text-secondary line-clamp-3 text-sm leading-relaxed font-medium">
        {tour.description || "Discover amazing experiences with this tour."}
      </p>
      
      {/* Modern Highlights with blue theme */}
      {tour.highlights && tour.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tour.highlights.slice(0, 3).map((highlight, index) => (
            <div 
              key={index} 
              className="flex items-center text-xs font-medium text-text-primary bg-surface-container px-3 py-2 rounded-full border border-border/30 hover:border-primary/30 transition-colors duration-200"
            >
              <Camera className="h-3 w-3 mr-1.5 text-primary" />
              <span>{highlight}</span>
            </div>
          ))}
          {tour.highlights.length > 3 && (
            <div className="text-xs font-medium text-text-secondary bg-surface-container px-3 py-2 rounded-full border border-border/30 hover:border-primary/30 transition-colors duration-200">
              +{tour.highlights.length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}
