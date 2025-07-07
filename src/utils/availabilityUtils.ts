
import { format } from "date-fns";

export const checkAvailability = (
  selectedDate: Date | undefined,
  availability: any[],
  totalCustomers: number
) => {
  if (!selectedDate) {
    return { hasAvailability: false, dateAvailability: null };
  }

  const dateAvailability = availability.find(
    avail => avail.available_date === format(selectedDate, "yyyy-MM-dd")
  );
  
  const hasAvailability = dateAvailability && 
    dateAvailability.available_spots >= totalCustomers;

  return { hasAvailability, dateAvailability };
};
