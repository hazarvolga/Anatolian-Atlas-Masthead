"use client";


import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AIDataEnrichmentPanel from "../AIDataEnrichmentPanel";
import { DestinationFormData } from "./BasicDestinationInfo";

interface AIEnrichmentFieldsProps {
  register: UseFormRegister<DestinationFormData>;
  setValue: UseFormSetValue<DestinationFormData>;
  watch: UseFormWatch<DestinationFormData>;
  aiEnrichOpen: boolean;
  setAIEnrichOpen: (open: boolean) => void;
  onAIEnrich: () => void;
  onAcceptEnrich: (field: "coords" | "bestTime" | "activities", value: string | string[]) => void;
  onAcceptAllEnrich: () => void;
  aiLoading: boolean;
  enrichedData: any;
}

export default function AIEnrichmentFields({
  register,
  setValue,
  watch,
  aiEnrichOpen,
  setAIEnrichOpen,
  onAIEnrich,
  onAcceptEnrich,
  onAcceptAllEnrich,
  aiLoading,
  enrichedData
}: AIEnrichmentFieldsProps) {
  const name = watch("name");
  const city = watch("city");
  const country = watch("country");

  return (
    <section>
      <h3 className="font-semibold text-lg mb-2 text-primary">AI ile Zenginleştirme & Ek Alanlar</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="coords">Koordinatlar (opsiyonel)</Label>
          <Input id="coords" {...register("coords")} placeholder="örn: 38.4237, 27.1428" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="best_time">En iyi ziyaret zamanı (opsiyonel)</Label>
          <Input id="best_time" {...register("best_time")} placeholder="örn: Nisan-Eylül" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="activities">Popüler Aktiviteler (virgülle ayırın, opsiyonel)</Label>
          <Input id="activities" {...register("activities")} placeholder="örn: Yüzme, Tarihi gezi, Yöresel yemek" />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAIEnrich}
          disabled={!name || !city || !country}
        >
          AI ile Koordinat / Ziyaret Zamanı / Aktivite Önerisi Al
        </Button>
        <span className="text-xs text-muted-foreground">AI önerilerini otomatik alanlara ekleyebilirsiniz.</span>
      </div>
      {aiEnrichOpen && (
        <AIDataEnrichmentPanel
          loading={aiLoading}
          data={enrichedData}
          onAccept={onAcceptEnrich}
          onAcceptAll={onAcceptAllEnrich}
        />
      )}
    </section>
  );
}
