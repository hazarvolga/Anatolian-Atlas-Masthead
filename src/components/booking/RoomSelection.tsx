import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Users, Bed, Plus, Minus, Star } from "lucide-react";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { SelectedRoom } from "@/types/booking";

interface RoomSelectionProps {
  tourId: string;
  selectedRooms: SelectedRoom[];
  onRoomsChange: (rooms: SelectedRoom[]) => void;
  totalGuests: { adults: number; children: number };
}

export default function RoomSelection({
  tourId,
  selectedRooms,
  onRoomsChange,
  totalGuests
}: RoomSelectionProps) {
  const { data: roomTypes = [], isLoading } = useRoomTypes(tourId);
  const [expandedRoomType, setExpandedRoomType] = useState<string | null>(null);

  const addRoom = (roomTypeId: string) => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomType) return;

    const newRoom: SelectedRoom = {
      id: `room-${Date.now()}-${Math.random()}`,
      roomTypeId,
      adults: 1,
      children: 0,
      extraBeds: 0,
      roomPrice: roomType.base_price,
      extraBedPrice: 0
    };

    onRoomsChange([...selectedRooms, newRoom]);
  };

  const updateRoom = (roomId: string, updates: Partial<SelectedRoom>) => {
    onRoomsChange(
      selectedRooms.map(room => 
        room.id === roomId ? { ...room, ...updates } : room
      )
    );
  };

  const removeRoom = (roomId: string) => {
    onRoomsChange(selectedRooms.filter(room => room.id !== roomId));
  };

  const getRoomType = (roomTypeId: string) => {
    return roomTypes.find(rt => rt.id === roomTypeId);
  };

  const calculateTotalOccupancy = () => {
    return selectedRooms.reduce((total, room) => ({
      adults: total.adults + room.adults,
      children: total.children + room.children
    }), { adults: 0, children: 0 });
  };

  const currentOccupancy = calculateTotalOccupancy();
  const occupancyMatch = currentOccupancy.adults === totalGuests.adults && 
                        currentOccupancy.children === totalGuests.children;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Room Selection
        </CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Total Guests: {totalGuests.adults} adults, {totalGuests.children} children
          </span>
          <Badge variant={occupancyMatch ? "default" : "destructive"}>
            {occupancyMatch ? "Rooms Match" : "Occupancy Mismatch"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-medium">Available Room Types</h4>
          {roomTypes.map((roomType) => (
            <div key={roomType.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h5 className="font-medium">{roomType.name}</h5>
                  <p className="text-sm text-muted-foreground">{roomType.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₺{roomType.base_price}</p>
                  <p className="text-sm text-muted-foreground">per night</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Max: {roomType.max_adults} adults, {roomType.max_children} children</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addRoom(roomType.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </div>

              {roomType.features && roomType.features.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {roomType.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedRooms.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Selected Rooms ({selectedRooms.length})</h4>
              {selectedRooms.map((room, index) => {
                const roomType = getRoomType(room.roomTypeId);
                if (!roomType) return null;

                return (
                  <div key={room.id} className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Room {index + 1} - {roomType.name}</h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRoom(room.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Adults</label>
                        <Select
                          value={room.adults.toString()}
                          onValueChange={(value) => updateRoom(room.id!, { adults: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: roomType.max_adults }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1} adult{i > 0 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Children</label>
                        <Select
                          value={room.children.toString()}
                          onValueChange={(value) => updateRoom(room.id!, { children: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: roomType.max_children + 1 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i} child{i !== 1 ? 'ren' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Occupancy: {room.adults} adults, {room.children} children
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₺{room.roomPrice}</p>
                        <p className="text-sm text-muted-foreground">per night</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!occupancyMatch && selectedRooms.length > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ Room occupancy ({currentOccupancy.adults} adults, {currentOccupancy.children} children) 
              doesn't match total guests ({totalGuests.adults} adults, {totalGuests.children} children). 
              Please adjust your room selection.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
