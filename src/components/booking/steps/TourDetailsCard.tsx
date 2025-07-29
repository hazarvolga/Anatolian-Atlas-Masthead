import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface TourDetailsCardProps {
  selectedTour: any;
  getTourTypeDisplay: () => string;
  getDurationDisplay: () => string;
}

export default function TourDetailsCard({ selectedTour, getTourTypeDisplay, getDurationDisplay }: TourDetailsCardProps) {
  const isOneDayTour = selectedTour?.tour_type === 'one_day';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Tour Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Tour:</span>
          <span>{selectedTour?.name}</span>
        </div>
        {isOneDayTour && (
          <div className="flex justify-between">
            <span className="font-medium">Duration:</span>
            <span>{getDurationDisplay()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-medium">Type:</span>
          <span>{getTourTypeDisplay()}</span>
        </div>
        {selectedTour?.location && (
          <div className="flex justify-between">
            <span className="font-medium">Location:</span>
            <span>{selectedTour.location}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
