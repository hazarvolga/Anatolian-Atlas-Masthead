
import { format } from "date-fns";

interface SelectedDatesDisplayProps {
  checkInDate?: Date;
  checkOutDate?: Date;
}

export default function SelectedDatesDisplay({ checkInDate, checkOutDate }: SelectedDatesDisplayProps) {
  if (!checkInDate && !checkOutDate) return null;

  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium">Check-in</div>
          <div className="text-lg">
            {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Not selected"}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium">Check-out</div>
          <div className="text-lg">
            {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Not selected"}
          </div>
        </div>
      </div>
      {checkInDate && checkOutDate && (
        <div className="mt-2 text-sm text-muted-foreground">
          Duration: {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} nights
        </div>
      )}
    </div>
  );
}
