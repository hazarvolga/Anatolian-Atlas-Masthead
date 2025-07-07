
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DestinationFormData } from "./BasicDestinationInfo";

interface DestinationFormActionsProps {
  setValue: UseFormSetValue<DestinationFormData>;
  watch: UseFormWatch<DestinationFormData>;
  isSubmitting: boolean;
  isEdit: boolean;
}

export default function DestinationFormActions({
  setValue,
  watch,
  isSubmitting,
  isEdit
}: DestinationFormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 border-t pt-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={watch("is_active")}
          onCheckedChange={(checked) => setValue("is_active", checked)}
        />
        <Label htmlFor="is_active">Destinasyon Aktif</Label>
      </div>
      <Button
        type="submit"
        className="w-full sm:w-auto min-w-[180px] sm:ml-auto"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? (isEdit ? "Güncelleniyor..." : "Oluşturuluyor...")
          : (isEdit ? "Destinasyonu Güncelle" : "Destinasyon Oluştur")
        }
      </Button>
    </div>
  );
}
