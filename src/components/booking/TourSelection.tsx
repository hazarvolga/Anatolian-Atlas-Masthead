
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

interface TourSelectionProps {
  control: Control<any>;
  tours: any[];
  toursLoading: boolean;
  onTourChange: (tourId: string) => void;
  preselectedTourId?: string;
}

export default function TourSelection({ control, tours, toursLoading, onTourChange, preselectedTourId }: TourSelectionProps) {
  // Function to find tour by either UUID or numeric ID
  const findTourById = (id: string) => {
    if (!id || tours.length === 0) return null;
    
    // First try to find by exact UUID match
    let tour = tours.find(t => t.id === id);
    
    // If not found and ID is numeric, try to find by index (for backward compatibility)
    if (!tour && /^\d+$/.test(id)) {
      const numericIndex = parseInt(id) - 1; // Assuming 1-based indexing
      if (numericIndex >= 0 && numericIndex < tours.length) {
        tour = tours[numericIndex];
      }
    }
    
    return tour;
  };

  // Get the actual tour ID to use (convert numeric to UUID if needed)
  const getActualTourId = (id: string) => {
    const tour = findTourById(id);
    return tour ? tour.id : id;
  };

  return (
    <FormField
      control={control}
      name="tourId"
      render={({ field }) => {
        // If we have a preselected ID and the field is empty, set it
        if (preselectedTourId && !field.value && tours.length > 0) {
          const actualTourId = getActualTourId(preselectedTourId);
          if (actualTourId !== preselectedTourId) {
            console.log('TourSelection - Converting numeric ID to UUID:', preselectedTourId, '->', actualTourId);
            field.onChange(actualTourId);
            onTourChange(actualTourId);
          }
        }

        return (
          <FormItem>
            <FormLabel>Select Tour</FormLabel>
            <Select 
              onValueChange={(value) => {
                console.log('TourSelection - Tour selected:', value);
                field.onChange(value);
                onTourChange(value);
              }} 
              value={field.value}
              disabled={toursLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={toursLoading ? "Loading tours..." : "Choose a tour"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tours.map((tour) => (
                  <SelectItem key={tour.id} value={tour.id}>
                    {tour.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
            <div className="text-xs text-muted-foreground mt-2">
              The price will be calculated after you select travelers and accommodation.
            </div>
          </FormItem>
        );
      }}
    />
  );
}
