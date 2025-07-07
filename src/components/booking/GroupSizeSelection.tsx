
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { BookingFormData } from "@/hooks/useBookingForm";

interface GroupSizeSelectionProps {
  control: Control<BookingFormData>;
}

export default function GroupSizeSelection({ control }: GroupSizeSelectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="adults"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adults</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="children"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Children</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
