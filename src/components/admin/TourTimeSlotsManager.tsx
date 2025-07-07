
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Clock } from "lucide-react";
import { TourTimeSlot } from "@/types/tour";

interface TourTimeSlotsManagerProps {
  tourId?: string;
  onTimeSlotsChange: (timeSlots: TourTimeSlot[]) => void;
  initialTimeSlots?: TourTimeSlot[];
}

export default function TourTimeSlotsManager({ 
  tourId, 
  onTimeSlotsChange, 
  initialTimeSlots = [] 
}: TourTimeSlotsManagerProps) {
  const [timeSlots, setTimeSlots] = useState<TourTimeSlot[]>(initialTimeSlots);

  useEffect(() => {
    onTimeSlotsChange(timeSlots);
  }, [timeSlots, onTimeSlotsChange]);

  const addTimeSlot = () => {
    const newTimeSlot: TourTimeSlot = {
      id: `temp-${Date.now()}`,
      tour_id: tourId || '',
      start_time: '09:00',
      end_time: '11:00',
      max_capacity: 12
    };
    setTimeSlots([...timeSlots, newTimeSlot]);
  };

  const updateTimeSlot = (id: string, field: keyof TourTimeSlot, value: string | number) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const formatTimeDisplay = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Slots
        </CardTitle>
        <CardDescription>
          Configure available time slots for one-day tours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {timeSlots.map((slot) => (
          <div key={slot.id} className="p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`start-${slot.id}`}>Start Time</Label>
                <Input
                  id={`start-${slot.id}`}
                  type="time"
                  value={slot.start_time}
                  onChange={(e) => updateTimeSlot(slot.id, 'start_time', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`end-${slot.id}`}>End Time</Label>
                <Input
                  id={`end-${slot.id}`}
                  type="time"
                  value={slot.end_time}
                  onChange={(e) => updateTimeSlot(slot.id, 'end_time', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`capacity-${slot.id}`}>Max Capacity</Label>
                <Input
                  id={`capacity-${slot.id}`}
                  type="number"
                  value={slot.max_capacity}
                  onChange={(e) => updateTimeSlot(slot.id, 'max_capacity', parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {formatTimeDisplay(slot.start_time, slot.end_time)} 
                • Max {slot.max_capacity} people
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeTimeSlot(slot.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addTimeSlot}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Time Slot
        </Button>

        {timeSlots.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No time slots configured yet. Add time slots for one-day tours.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
