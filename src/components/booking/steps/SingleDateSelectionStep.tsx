
import EnhancedCalendar from "../EnhancedCalendar";

interface SingleDateSelectionStepProps {
  selectedTourId: string;
  checkInDate?: Date;
  onCheckInSelect: (date: Date) => void;
  isMultiDay: boolean;
}

export default function SingleDateSelectionStep({
  selectedTourId,
  checkInDate,
  onCheckInSelect,
  isMultiDay
}: SingleDateSelectionStepProps) {
  if (!selectedTourId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please select a tour first
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">
          {isMultiDay ? "Select Your Start Date" : "Select Your Tour Date"}
        </h3>
        <p className="text-muted-foreground">
          {isMultiDay
            ? "Choose the check-in/start date for your multi-day tour."
            : "Choose the date for your tour."
          }
        </p>
      </div>

      <EnhancedCalendar
        tourId={selectedTourId}
        checkInDate={checkInDate}
        onCheckInSelect={onCheckInSelect}
        isMultiDay={isMultiDay}
      />
    </div>
  );
}
