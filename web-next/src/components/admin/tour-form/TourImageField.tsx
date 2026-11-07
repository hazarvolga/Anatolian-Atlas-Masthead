"use client";


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}
export default function TourImageField({ register, errors }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="image_url">Image URL</Label>
      <Input
        id="image_url"
        {...register("image_url")}
        placeholder="https://example.com/image.jpg"
      />
      {errors.image_url?.message && (
        <p className="text-sm text-destructive">{String(errors.image_url.message)}</p>
      )}
    </div>
  );
}
