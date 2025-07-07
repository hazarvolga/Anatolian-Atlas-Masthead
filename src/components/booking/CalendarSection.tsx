
import InteractiveCalendar from "./InteractiveCalendar";

interface CalendarSectionProps {
  selectedTourId: string;
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  checkInDate?: Date;
  checkOutDate?: Date;
  onCheckInSelect: (date: Date) => void;
  onCheckOutSelect: (date: Date) => void;
  isMultiDay?: boolean;
}

export default function CalendarSection({
  selectedTourId,
  selectedDate,
  onDateSelect,
  checkInDate,
  checkOutDate,
  onCheckInSelect,
  onCheckOutSelect,
  isMultiDay
}: CalendarSectionProps) {
  if (!selectedTourId) return null;

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <h3 className="text-xl font-semibold mb-4">Choose Your Dates</h3>
      <InteractiveCalendar
        tourId={selectedTourId}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        onCheckInSelect={onCheckInSelect}
        onCheckOutSelect={onCheckOutSelect}
        isMultiDay={isMultiDay}
      />
    </div>
  );
}
