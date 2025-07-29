
import { Customer } from "@/types/booking";
import CustomerTypeSelection from "./CustomerTypeSelection";

interface TravelersSectionProps {
  selectedTourId: string;
  selectedDate?: Date;
  selectedTour: any;
  customers: Customer[];
  onCustomersChange: (customers: Customer[]) => void;
}

export default function TravelersSection({
  selectedTourId,
  selectedDate,
  selectedTour,
  customers,
  onCustomersChange
}: TravelersSectionProps) {
  if (!selectedTourId || !selectedDate) return null;

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <h3 className="text-xl font-semibold mb-4">Travelers</h3>
      <CustomerTypeSelection
        selectedTour={selectedTour}
        customers={customers}
        onCustomersChange={onCustomersChange}
      />
    </div>
  );
}
