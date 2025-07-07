
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DestinationFormData } from "./BasicDestinationInfo";

interface ExtraDestinationFieldsProps {
  register: UseFormRegister<DestinationFormData>;
  errors: FieldErrors<DestinationFormData>;
}

export default function ExtraDestinationFields({
  register,
  errors
}: ExtraDestinationFieldsProps) {
  return (
    <section>
      <h3 className="font-semibold text-lg mb-2 text-primary">Ekstra Alanlar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="google_maps_url">Google Maps URL</Label>
          <Input
            id="google_maps_url"
            {...register("google_maps_url")}
            placeholder="örn: https://maps.google.com/xyz"
          />
          {errors.google_maps_url && (
            <p className="text-sm text-red-500">{errors.google_maps_url.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="gallery_images">Görsel Galerisi (URL ile, virgülle ayırın)</Label>
          <Input
            id="gallery_images"
            {...register("gallery_images")}
            placeholder="örn: https://a.jpg, https://b.jpg"
          />
          <span className="text-xs text-muted-foreground">Birden fazla görsel URL'si virgül ile ayrılmalı</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Label htmlFor="extra_info">Ekstra Bilgi (kullanıcıya bilgi kutusunda gösterilecek)</Label>
        <Textarea
          id="extra_info"
          {...register("extra_info")}
          placeholder="Ek bilgi ekleyin (ör. tarihçe, özel bir not vs)"
          rows={2}
        />
      </div>
    </section>
  );
}
