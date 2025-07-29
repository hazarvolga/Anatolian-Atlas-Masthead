import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  watch: UseFormWatch<any>;
}

export default function TourDetailsFields({ register, errors, watch }: Props) {
  const tourType = watch("tour_type");
  const isOneDayTour = tourType === "one_day";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {isOneDayTour && (
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (hours)</Label>
          <Input
            id="duration"
            type="number"
            step="0.01"
            {...register("duration", { valueAsNumber: true })}
            min={0.5}
            max={23.99}
          />
          {errors.duration?.message && (
            <p className="text-sm text-destructive">{String(errors.duration.message)}</p>
          )}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register("location")}
        />
        {errors.location?.message && (
          <p className="text-sm text-destructive">{String(errors.location.message)}</p>
        )}
      </div>
    </div>
  );
}
