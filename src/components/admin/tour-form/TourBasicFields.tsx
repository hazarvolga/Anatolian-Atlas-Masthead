
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  watch?: UseFormWatch<any>;
}
export default function TourBasicFields({ register, errors, watch }: Props) {
  // Ensure we have a watch function to monitor form changes
  if (!watch) {
    console.warn('TourBasicFields: watch function not provided - price field visibility may not work correctly');
  }
  
  const tourType = watch ? watch("tour_type") : null;
  const isMultiDayTour = tourType === "multiple_day" || tourType === "date_range";
  
  // Debug logging
  console.log('TourBasicFields: tourType =', tourType, 'isMultiDayTour =', isMultiDayTour);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name">Tour Name *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter tour name"
        />
        {errors.name?.message && (
          <p className="text-sm text-destructive">{String(errors.name.message)}</p>
        )}
      </div>
      
      {/* Price field only for one_day tours */}
      {!isMultiDayTour && (
        <div className="space-y-2">
          <Label htmlFor="price">Price (Single Day Tour Only) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            min={0}
            placeholder="Enter price (only for single day tours)"
          />
          {errors.price?.message && (
            <p className="text-sm text-destructive">{String(errors.price.message)}</p>
          )}
          <p className="text-xs text-muted-foreground">Note: For multi-day tours, prices are set in the Pricing tab by room type.</p>
        </div>
      )}
    </div>
  );
}
