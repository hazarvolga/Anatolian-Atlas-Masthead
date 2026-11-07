"use client";


import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DestinationFormData } from "./BasicDestinationInfo";

interface DescriptionSectionProps {
  register: UseFormRegister<DestinationFormData>;
  errors: FieldErrors<DestinationFormData>;
  aiDescOpen: boolean;
  setAIDescOpen: (open: boolean) => void;
  onAIGetDesc: () => void;
  onAcceptAIDesc: () => void;
  aiLoading: boolean;
  aiResult: string | null;
}

export default function DescriptionSection({
  register,
  errors,
  aiDescOpen,
  setAIDescOpen,
  onAIGetDesc,
  onAcceptAIDesc,
  aiLoading,
  aiResult
}: DescriptionSectionProps) {
  return (
    <section>
      <h3 className="font-semibold text-lg mb-2 text-primary">Açıklama</h3>
      <Textarea
        id="description"
        {...register("description")}
        placeholder="Destinasyon açıklamasını girin"
        rows={4}
      />
      <div className="flex items-center gap-3 mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAIGetDesc}
        >
          AI ile Açıklama Önerisi Al
        </Button>
        <span className="text-xs text-muted-foreground">Açıklamanız için hızlı öneri alın.</span>
      </div>
      {(aiDescOpen || aiResult) && (
        <div className="mt-2">
          <div className="bg-muted border rounded p-3 space-y-2">
            <div className="text-xs text-muted-foreground mb-1">AI önerisi:</div>
            {aiLoading ? (
              <div className="text-sm text-muted-foreground">AI'dan açıklama bekleniyor...</div>
            ) : (
              <div className="text-sm whitespace-pre-line">{aiResult || "Henüz öneri alınmadı."}</div>
            )}
            <div className="flex gap-2">
              {aiResult && (
                <Button
                  size="sm"
                  variant="default"
                  type="button"
                  onClick={onAcceptAIDesc}
                  disabled={aiLoading}
                >
                  Öneriyi Kullan
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => setAIDescOpen(false)}
              >
                Kapat
              </Button>
            </div>
          </div>
        </div>
      )}
      {errors.description && (
        <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
      )}
    </section>
  );
}
