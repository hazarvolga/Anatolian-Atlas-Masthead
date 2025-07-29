
import SmartRoomSelector from "../SmartRoomSelector";

interface AccommodationStepProps {
  totalAdults: number;
  totalChildren: number;
  checkInDate?: Date;
  checkOutDate?: Date;
  rooms: any[];
  onRoomConfigChange: (rooms: any[]) => void;
}

export default function AccommodationStep({
  totalAdults,
  totalChildren,
  checkInDate,
  checkOutDate,
  rooms,
  onRoomConfigChange
}: AccommodationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Configure Your Rooms</h3>
        <p className="text-muted-foreground">
          Select your accommodation preferences for your stay
        </p>
      </div>

      <SmartRoomSelector
        totalAdults={totalAdults}
        totalChildren={totalChildren}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        onRoomConfigChange={onRoomConfigChange}
      />
    </div>
  );
}
