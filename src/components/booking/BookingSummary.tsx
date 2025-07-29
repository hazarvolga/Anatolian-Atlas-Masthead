
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingSummaryProps {
  selectedTour: any;
  selectedDate: Date;
  adults: number;
  children: number;
  totalPrice: number;
  hasAvailability: boolean;
  dateAvailability: any;
}

export default function BookingSummary({
  selectedTour,
  selectedDate,
  adults,
  children,
  totalPrice,
  hasAvailability,
  dateAvailability,
}: BookingSummaryProps) {
  if (!selectedTour || !selectedDate) return null;

  return (
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="font-semibold mb-2">Booking Summary</h3>
      <div className="space-y-1 text-sm">
        <p><strong>Tour:</strong> {selectedTour.name}</p>
        <p><strong>Date:</strong> {format(selectedDate, "PPP")}</p>
        <p><strong>Guests:</strong> {adults} adults{children > 0 && `, ${children} children`}</p>
        <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
        {dateAvailability && (
          <p className={cn(
            "font-medium",
            hasAvailability ? "text-green-600" : "text-red-600"
          )}>
            <strong>Availability:</strong> {hasAvailability 
              ? `${dateAvailability.available_spots} spots available` 
              : "Not enough spots available"
            }
          </p>
        )}
      </div>
    </div>
  );
}
