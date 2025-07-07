
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  watch?: UseFormWatch<any>;
}
export default function TourDateFields({ register, errors, watch }: Props) {
  // Eğer watch gelmemişse formda bir şey göstermeyecek!
  const tourType = watch ? watch("tour_type") : undefined;
  if (tourType !== "date_range") return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date</Label>
        <Input
          id="start_date"
          type="date"
          {...register("start_date")}
        />
        {errors.start_date?.message && (
          <p className="text-sm text-destructive">{String(errors.start_date.message)}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="end_date">End Date</Label>
        <Input
          id="end_date"
          type="date"
          {...register("end_date")}
        />
        {errors.end_date?.message && (
          <p className="text-sm text-destructive">{String(errors.end_date.message)}</p>
        )}
      </div>
    </div>
  );
}
