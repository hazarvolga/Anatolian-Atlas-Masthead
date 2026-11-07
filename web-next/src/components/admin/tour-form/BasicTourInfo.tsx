"use client";

import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDestinations } from "@/hooks/useDestinations";
import TourBenefitsItinerary from "./TourBenefitsItinerary";
import type { TourFormData } from "@/hooks/useAdminTourForm";

interface BasicTourInfoProps {
  register: UseFormRegister<TourFormData>;
  setValue: UseFormSetValue<TourFormData>;
  watch: UseFormWatch<TourFormData>;
  errors: FieldErrors<TourFormData>;
  tour?: any;
  benefits: string[];
  itinerary: Array<{ day: number; title: string; description: string; }>;
  onBenefitsChange: (benefits: string[]) => void;
  onItineraryChange: (itinerary: Array<{ day: number; title: string; description: string; }>) => void;
}

import TourBasicFields from "./TourBasicFields";
import TourDetailsFields from "./TourDetailsFields";
import TourDateFields from "./TourDateFields";
import TourImageField from "./TourImageField";

export default function BasicTourInfo({ 
  register, 
  setValue, 
  watch, 
  errors, 
  tour,
  benefits,
  itinerary,
  onBenefitsChange,
  onItineraryChange
}: BasicTourInfoProps) {
  const { data: destinations = [] } = useDestinations();
  const tourType = watch("tour_type");

  // React Hook Form'un controlled select desteği için bir fix:
  // Eğer destination_id seçilirse, formda güncel olarak gösterilecek.
  const selectedDestinationId = watch("destination_id") || tour?.destination_id || "";

  return (
    <div className="space-y-6">
      <TourBasicFields register={register} errors={errors} watch={watch} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tour_type">Tour Type *</Label>
          <Select 
            defaultValue={tour?.tour_type || "one_day"}
            onValueChange={(value) => setValue("tour_type", value as "one_day" | "multiple_day" | "date_range")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tour type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one_day">One Day Tour</SelectItem>
              <SelectItem value="multiple_day">Multiple Day Tour</SelectItem>
              <SelectItem value="date_range">Date Range Tour</SelectItem>
            </SelectContent>
          </Select>
          {errors.tour_type?.message && (
            <p className="text-sm text-destructive">{String(errors.tour_type.message)}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level *</Label>
          <Select
            defaultValue={tour?.difficulty || "easy"}
            onValueChange={(value) => setValue("difficulty", value as "easy" | "moderate" | "challenging")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="challenging">Challenging</SelectItem>
            </SelectContent>
          </Select>
          {errors.difficulty?.message && (
            <p className="text-sm text-destructive">{String(errors.difficulty.message)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="deposit">Deposit</Label>
          <Input
            id="deposit"
            type="number"
            step="0.01"
            {...register("deposit", { valueAsNumber: true })}
            placeholder="Enter deposit amount (optional)"
          />
          {errors.deposit && (
            <p className="text-sm text-destructive">{String(errors.deposit.message)}</p>
          )}
          {tourType === "multiple_day" || tourType === "date_range" ? (
            <p className="text-xs text-muted-foreground">For multi-day tours, prices are set in the Pricing tab by room type.</p>
          ) : null}
        </div>
        <div className="col-span-1"> 
          {/* Empty div to maintain grid layout, can be used for future fields */}
        </div>
      </div>

      <TourDetailsFields register={register} errors={errors} watch={watch} />

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter tour description"
          className="min-h-[100px]"
        />
        {errors.description?.message && (
          <p className="text-sm text-destructive">{String(errors.description.message)}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination_id">Destination *</Label>
        <Select
          defaultValue={selectedDestinationId}
          onValueChange={(value) => setValue("destination_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select destination" />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((destination: any) => (
              <SelectItem key={destination.id} value={destination.id}>
                {destination.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.destination_id?.message && (
          <p className="text-sm text-destructive">{String(errors.destination_id.message)}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_group_size">Maximum Group Size *</Label>
        <Input
          id="max_group_size"
          type="number"
          {...register("max_group_size", { valueAsNumber: true })}
          min={1}
        />
        {errors.max_group_size?.message && (
          <p className="text-sm text-destructive">{String(errors.max_group_size.message)}</p>
        )}
      </div>

      <TourImageField register={register} errors={errors} />

      <TourDateFields register={register} errors={errors} />

      <TourBenefitsItinerary
        benefits={benefits}
        onBenefitsChange={onBenefitsChange}
        itinerary={itinerary}
        onItineraryChange={onItineraryChange}
        tourType={tourType}
      />
    </div>
  );
}
