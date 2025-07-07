
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourCardActionsProps {
  tourId: string;
}

export default function TourCardActions({ tourId }: TourCardActionsProps) {
  return (
    <div className="flex gap-3 pt-2">
      <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl hover:bg-accent-vibrant/5 hover:border-accent-vibrant/50 hover:text-accent-vibrant">
        <Link to={`/tours/${tourId}`}>
          View Details
        </Link>
      </Button>
      <Button asChild size="sm" className="flex-1 btn-primary">
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
