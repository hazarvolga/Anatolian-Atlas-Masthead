
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface SelectedDateInfoProps {
  selectedDate?: Date;
  availability: any[];
}

export default function SelectedDateInfo({ selectedDate, availability }: SelectedDateInfoProps) {
  if (!selectedDate) return null;

  const getDateAvailability = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return availability.find(avail => avail.available_date === dateStr);
  };

  const getDateStatus = (date: Date) => {
    const avail = getDateAvailability(date);
    if (!avail) return 'unavailable';
    if (avail.available_spots === 0) return 'full';
    if (avail.available_spots < 5) return 'limited';
    return 'available';
  };

  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{format(selectedDate, "MMMM dd, yyyy")}</div>
          <div className="text-sm text-muted-foreground">
            {getDateAvailability(selectedDate)?.available_spots} spots available
          </div>
        </div>
        <Badge variant={getDateStatus(selectedDate) === 'available' ? 'default' : 'secondary'}>
          {getDateStatus(selectedDate)}
        </Badge>
      </div>
    </div>
  );
}
