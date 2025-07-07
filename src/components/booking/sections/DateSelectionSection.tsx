
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedCalendar from "../EnhancedCalendar";

interface DateSelectionSectionProps {
  selectedTourId: string;
  checkInDate?: Date;
  onCheckInSelect: (date: Date) => void;
  isMultiDayTour: boolean;
}

export default function DateSelectionSection({
  selectedTourId,
  checkInDate,
  onCheckInSelect,
  isMultiDayTour
}: DateSelectionSectionProps) {
  if (!selectedTourId) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Choose Your Dates</CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedCalendar
          tourId={selectedTourId}
          checkInDate={checkInDate}
          onCheckInSelect={onCheckInSelect}
          isMultiDay={isMultiDayTour}
        />
      </CardContent>
    </Card>
  );
}
