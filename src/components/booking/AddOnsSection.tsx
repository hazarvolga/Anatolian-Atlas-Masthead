
import { SelectedAddOn } from "@/types/booking";
import AddOnSelection from "./AddOnSelection";

interface AddOnsSectionProps {
  selectedTourId: string;
  customers: any[];
  selectedAddOns: SelectedAddOn[];
  onAddOnsChange: (addOns: SelectedAddOn[]) => void;
}

export default function AddOnsSection({
  selectedTourId,
  customers,
  selectedAddOns,
  onAddOnsChange
}: AddOnsSectionProps) {
  if (!selectedTourId || customers.length === 0) return null;

  const totalGuests = customers.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <h3 className="text-xl font-semibold mb-4">Optional Services</h3>
      <AddOnSelection
        tourId={selectedTourId}
        selectedAddOns={selectedAddOns}
        onAddOnsChange={onAddOnsChange}
        totalGuests={totalGuests}
      />
    </div>
  );
}
