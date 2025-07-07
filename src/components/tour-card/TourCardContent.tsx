
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
      <p className="text-text-secondary line-clamp-2 text-sm leading-relaxed">
        {tour.description || "Discover amazing experiences with this tour."}
      </p>
      
      {/* Highlights */}
      {tour.highlights && tour.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tour.highlights.slice(0, 3).map((highlight, index) => (
            <div 
              key={index} 
              className="flex items-center text-xs text-text-secondary bg-surface-elevated px-3 py-1.5 rounded-full border border-border/30"
            >
              <Camera className="h-3 w-3 mr-1.5 text-accent-vibrant" />
              <span>{highlight}</span>
            </div>
          ))}
          {tour.highlights.length > 3 && (
            <div className="text-xs text-text-tertiary bg-surface-elevated px-3 py-1.5 rounded-full border border-border/30">
              +{tour.highlights.length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}
