
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Bed, Plus, Minus } from "lucide-react";

interface RoomConfig {
  id: string;
  type: 'standard' | 'deluxe' | 'suite';
  adults: number;
  children: number;
  extraBeds: number;
}

interface SmartRoomSelectorProps {
  totalAdults: number;
  totalChildren: number;
  checkInDate?: Date;
  checkOutDate?: Date;
  onRoomConfigChange: (rooms: RoomConfig[]) => void;
}

const roomTypes = [
  { id: 'standard', name: 'Standard Room', maxOccupancy: 2, basePrice: 150 },
  { id: 'deluxe', name: 'Deluxe Room', maxOccupancy: 3, basePrice: 200 },
  { id: 'suite', name: 'Suite', maxOccupancy: 4, basePrice: 300 }
];

export default function SmartRoomSelector({
  totalAdults,
  totalChildren,
  checkInDate,
  checkOutDate,
  onRoomConfigChange
}: SmartRoomSelectorProps) {
  const [rooms, setRooms] = useState<RoomConfig[]>([]);

  // Auto-suggest room configuration based on guest count
  useEffect(() => {
    if (totalAdults > 0) {
      const totalGuests = totalAdults + totalChildren;
      const suggestedRooms: RoomConfig[] = [];

      if (totalGuests <= 2) {
        suggestedRooms.push({
          id: '1',
          type: 'standard',
          adults: totalAdults,
          children: totalChildren,
          extraBeds: 0
        });
      } else if (totalGuests <= 4) {
        suggestedRooms.push({
          id: '1',
          type: 'deluxe',
          adults: totalAdults,
          children: totalChildren,
          extraBeds: 0
        });
      } else {
        // Multiple rooms needed
        let remainingAdults = totalAdults;
        let remainingChildren = totalChildren;
        let roomId = 1;

        while (remainingAdults > 0 || remainingChildren > 0) {
          const roomAdults = Math.min(remainingAdults, 2);
          const roomChildren = Math.min(remainingChildren, 2);
          
          suggestedRooms.push({
            id: roomId.toString(),
            type: 'standard',
            adults: roomAdults,
            children: roomChildren,
            extraBeds: 0
          });

          remainingAdults -= roomAdults;
          remainingChildren -= roomChildren;
          roomId++;
        }
      }

      setRooms(suggestedRooms);
      onRoomConfigChange(suggestedRooms);
    }
  }, [totalAdults, totalChildren, onRoomConfigChange]);

  const addRoom = () => {
    const newRoom: RoomConfig = {
      id: (rooms.length + 1).toString(),
      type: 'standard',
      adults: 1,
      children: 0,
      extraBeds: 0
    };
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    onRoomConfigChange(updatedRooms);
  };

  const removeRoom = (roomId: string) => {
    const updatedRooms = rooms.filter(room => room.id !== roomId);
    setRooms(updatedRooms);
    onRoomConfigChange(updatedRooms);
  };

  const updateRoom = (roomId: string, updates: Partial<RoomConfig>) => {
    const updatedRooms = rooms.map(room =>
      room.id === roomId ? { ...room, ...updates } : room
    );
    setRooms(updatedRooms);
    onRoomConfigChange(updatedRooms);
  };

  const totalConfiguredGuests = rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
  const totalExpectedGuests = totalAdults + totalChildren;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bed className="h-5 w-5" />
          Room Configuration
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Total guests: {totalExpectedGuests}</span>
          {totalConfiguredGuests !== totalExpectedGuests && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              {totalConfiguredGuests > totalExpectedGuests ? "Over" : "Under"} allocated
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rooms.map((room, index) => (
          <div key={room.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Room {index + 1}</h4>
              {rooms.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeRoom(room.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Room Type</label>
                <select
                  value={room.type}
                  onChange={(e) => updateRoom(room.id, { type: e.target.value as any })}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  {roomTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} (max {type.maxOccupancy})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Adults</label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateRoom(room.id, { adults: Math.max(0, room.adults - 1) })}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{room.adults}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateRoom(room.id, { adults: room.adults + 1 })}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Children</label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateRoom(room.id, { children: Math.max(0, room.children - 1) })}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{room.children}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateRoom(room.id, { children: room.children + 1 })}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Extra Beds</label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateRoom(room.id, { extraBeds: Math.max(0, room.extraBeds - 1) })}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{room.extraBeds}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateRoom(room.id, { extraBeds: room.extraBeds + 1 })}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Room capacity: {room.adults + room.children} guests
              {room.extraBeds > 0 && ` + ${room.extraBeds} extra bed${room.extraBeds > 1 ? 's' : ''}`}
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addRoom}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Room
        </Button>

        {totalConfiguredGuests !== totalExpectedGuests && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {totalConfiguredGuests < totalExpectedGuests
                ? `You need to allocate ${totalExpectedGuests - totalConfiguredGuests} more guest${totalExpectedGuests - totalConfiguredGuests > 1 ? 's' : ''}.`
                : `You have allocated ${totalConfiguredGuests - totalExpectedGuests} extra guest${totalConfiguredGuests - totalExpectedGuests > 1 ? 's' : ''}.`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
