
import { Link } from "react-router-dom";
import { Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourCardActionsProps {
  tourId: string;
}

export default function TourCardActions({ tourId }: TourCardActionsProps) {
  return (
    <div className="flex gap-3 pt-2">
      <Button 
        asChild 
        variant="outline" 
        size="sm" 
        className="flex-1 rounded-xl border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300 font-medium"
      >
        <Link to={`/tours/${tourId}`}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Link>
      </Button>
      <Button 
        asChild 
        size="sm" 
        className="flex-1 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
      >
        <Link 
          to={`/book/${tourId}`}
          onClick={() => console.log('Book Now clicked for tour:', tourId)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Now
        </Link>
      </Button>
    </div>
  );
}
