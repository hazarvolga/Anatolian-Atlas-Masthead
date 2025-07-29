
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Users } from "lucide-react";

interface TourSelectionStepProps {
  control: any;
  tours: any[];
  toursLoading: boolean;
  selectedTourId: string;
  onTourChange: (tourId: string) => void;
}

export default function TourSelectionStep({
  control,
  tours,
  toursLoading,
  selectedTourId,
  onTourChange
}: TourSelectionStepProps) {
  const selectedTour = tours.find(tour => tour.id === selectedTourId);

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="tourId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Choose Your Tour</FormLabel>
            <Select
              disabled={toursLoading}
              onValueChange={(value) => {
                field.onChange(value);
                onTourChange(value);
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a tour" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tours.map((tour) => (
                  <SelectItem key={tour.id} value={tour.id}>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{tour.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${tour.price}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedTour && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{selectedTour.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTour.destination?.name || 'Various Locations'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTour.duration} {selectedTour.duration === 1 ? 'day' : 'days'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Max {selectedTour.max_participants} guests</span>
                </div>
              </div>

              {selectedTour.description && (
                <p className="text-muted-foreground">{selectedTour.description}</p>
              )}

              <div className="text-2xl font-bold text-primary">
                From ${selectedTour.price} per person
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
