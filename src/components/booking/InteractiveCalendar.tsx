
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { useTourAvailability } from "@/hooks/useTours";
import { useCalendarLogic } from "@/hooks/useCalendarLogic";
import CalendarLegend from "./calendar/CalendarLegend";
import SelectedDatesDisplay from "./calendar/SelectedDatesDisplay";
import SelectedDateInfo from "./calendar/SelectedDateInfo";

interface InteractiveCalendarProps {
  tourId: string;
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  checkInDate?: Date;
  checkOutDate?: Date;
  onCheckInSelect?: (date: Date) => void;
  onCheckOutSelect?: (date: Date) => void;
  isMultiDay?: boolean;
}

export default function InteractiveCalendar({
  tourId,
  selectedDate,
  onDateSelect,
  checkInDate,
  checkOutDate,
  onCheckInSelect,
  onCheckOutSelect,
  isMultiDay = false
}: InteractiveCalendarProps) {
  const { data: availability = [] } = useTourAvailability(tourId);

  console.log('InteractiveCalendar - availability data:', availability?.length);
  console.log('InteractiveCalendar - availability:', availability);

  const {
    selectingCheckOut,
    isDateAvailable,
    handleDateClick,
    renderDayContent,
  } = useCalendarLogic({
    availability,
    isMultiDay,
    onDateSelect,
    onCheckInSelect,
    onCheckOutSelect,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          {isMultiDay ? 'Select Check-in and Check-out Dates' : 'Select Tour Date'}
        </CardTitle>
        {isMultiDay && (
          <div className="text-sm text-muted-foreground">
            {!checkInDate ? 'Click to select check-in date' : 
             selectingCheckOut ? 'Click to select check-out date' : 
             'Dates selected - click again to modify'}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && handleDateClick(date, checkInDate)}
          disabled={(date) => date < new Date()}
          className="rounded-md border pointer-events-auto"
          components={{
            DayContent: ({ date }) => renderDayContent(date, selectedDate, checkInDate, checkOutDate)
          }}
        />

        <CalendarLegend />

        <SelectedDatesDisplay 
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
        />

        <SelectedDateInfo 
          selectedDate={selectedDate}
          availability={availability}
        />
      </CardContent>
    </Card>
  );
}
