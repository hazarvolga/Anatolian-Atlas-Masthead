
import { SelectedRoom } from "@/types/booking";
import RoomSelection from "./RoomSelection";

interface AccommodationSectionProps {
  isMultiDayTour: boolean;
  selectedTourId: string;
  customers: any[];
  selectedRooms: SelectedRoom[];
  onRoomsChange: (rooms: SelectedRoom[]) => void;
}

export default function AccommodationSection({
  isMultiDayTour,
  selectedTourId,
  customers,
  selectedRooms,
  onRoomsChange
}: AccommodationSectionProps) {
  if (!isMultiDayTour || !selectedTourId || customers.length === 0) return null;

  const totalGuestsBreakdown = {
    adults: customers.filter(c => c.type === 'adult').reduce((sum, c) => sum + c.count, 0),
    children: customers.filter(c => c.type === 'child').reduce((sum, c) => sum + c.count, 0)
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <h3 className="text-xl font-semibold mb-4">Choose Your Accommodation</h3>
      <RoomSelection
        tourId={selectedTourId}
        totalGuests={totalGuestsBreakdown}
        selectedRooms={selectedRooms}
        onRoomsChange={onRoomsChange}
      />
    </div>
  );
}
