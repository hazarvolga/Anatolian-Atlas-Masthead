import React from "react";
import { Button } from "@/components/ui/button";

interface AIDataEnrichmentPanelProps {
  loading: boolean;
  data: {
    coords?: string;
    bestTime?: string;
    activities?: string[] | string;
    error?: string;
    rawText?: string;
  } | null;
  onAccept: (field: "coords" | "bestTime" | "activities", value: string | string[]) => void;
  onAcceptAll?: () => void; // toplu uygula callback'i
}

export default function AIDataEnrichmentPanel({ loading, data, onAccept, onAcceptAll }: AIDataEnrichmentPanelProps) {
  if (loading) {
    return (
      <div className="p-4">
        <span>AI'dan öneriler bekleniyor...</span>
      </div>
    );
  }
  if (!data || data.error) {
    return (
      <div className="p-4">
        <span className="text-red-500">{data?.error || "Öneri bulunamadı."}</span>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-2 border rounded bg-muted">
      <div className="flex gap-2 mb-2">
        {onAcceptAll && (
          <button
            className="px-3 py-1 text-sm rounded bg-accent-vibrant text-white hover:bg-accent-vibrant/90 transition disabled:opacity-60"
            type="button"
            onClick={onAcceptAll}
          >
            Tümünü Kullan
          </button>
        )}
        <span className="text-xs text-muted-foreground ml-auto">AI önerilerini alanlara otomatik ekleyebilirsiniz.</span>
      </div>
      <div className="space-y-1">
        <div>
          <b>Koordinatlar:</b>{" "}
          <span>{data.coords || "—"}</span>
          {data.coords && (
            <button
              className="ml-2 px-2 py-0.5 text-xs rounded bg-primary text-white hover:bg-primary/80 transition"
              type="button"
              onClick={() => onAccept("coords", data.coords!)}
            >
              Öneriyi Kullan
            </button>
          )}
        </div>
        <div>
          <b>En iyi ziyaret zamanı:</b>{" "}
          <span>{data.bestTime || "—"}</span>
          {data.bestTime && (
            <button
              className="ml-2 px-2 py-0.5 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-800 transition"
              type="button"
              onClick={() => onAccept("bestTime", data.bestTime!)}
            >
              Öneriyi Kullan
            </button>
          )}
        </div>
        <div>
          <b>Popüler aktiviteler:</b>{" "}
          <span>
            {Array.isArray(data.activities)
              ? data.activities.join(", ")
              : data.activities || "—"}
          </span>
          {(data.activities && (Array.isArray(data.activities) ? data.activities.length > 0 : !!data.activities)) && (
            <button
              className="ml-2 px-2 py-0.5 text-xs rounded bg-coral-600 text-white hover:bg-coral-800 transition"
              type="button"
              onClick={() => onAccept("activities", data.activities!)}
            >
              Öneriyi Kullan
            </button>
          )}
        </div>
      </div>
      {data.rawText && (
        <div className="text-xs text-muted-foreground mt-2">
          <b>AI ham öneri:</b> {data.rawText}
        </div>
      )}
    </div>
  );
}
