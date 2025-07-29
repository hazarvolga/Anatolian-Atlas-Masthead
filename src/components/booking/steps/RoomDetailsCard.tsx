import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function RoomDetailsCard({ rooms }: any) {
  if (!rooms?.length) return null;
  
  // Toplam misafir sayısını hesapla
  const totalAdults = rooms.reduce((sum: number, room: any) => sum + (room.adults || 0), 0);
  const totalChildren = rooms.reduce((sum: number, room: any) => sum + (room.children || 0), 0);
  const totalGuests = totalAdults + totalChildren;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bed className="h-5 w-5" />
          Travelers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rooms.map((room: any, index: number) => (
          <div key={room.id || index} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Room {index + 1}:</span>
              <span className="capitalize">{room.type} Room</span>
            </div>
            <div className="text-sm text-muted-foreground ml-4">
              {room.adults} adult{room.adults !== 1 ? 's' : ''}, {room.children} {room.children === 1 ? 'child' : 'children'}
              {room.extraBeds > 0 && ` + ${room.extraBeds} extra bed${room.extraBeds > 1 ? "s" : ""}`}
            </div>
            {index < rooms.length - 1 && <Separator />}
          </div>
        ))}
        
        <Separator />
        
        {/* Toplam misafir sayısını göster */}
        <div className="flex justify-between font-medium">
          <span>Total Guests:</span>
          <span>{totalGuests} ({totalAdults} adult{totalAdults !== 1 ? 's' : ''}, {totalChildren} {totalChildren === 1 ? 'child' : 'children'})</span>
        </div>
      </CardContent>
    </Card>
  );
}
