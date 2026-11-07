"use client";


import { Card } from "@/components/ui/card";

export default function AIContentSuggestionPanel({ suggestion, loading, onAccept }: {
  suggestion: string | null;
  loading: boolean;
  onAccept: (() => void) | null;
}) {
  if (!suggestion && !loading) return null;
  return (
    <Card className="bg-muted p-3 mt-3">
      <div className="mb-2 font-semibold text-blue-900">AI Önerisi</div>
      {loading ? (
        <div>Yapay zeka önerisi alınıyor...</div>
      ) : (
        <>
          <div className="text-sm text-gray-700 whitespace-pre-wrap">{suggestion}</div>
          {onAccept && (
            <button
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
              type="button"
              onClick={onAccept}
            >
              Öneriyi Kullan
            </button>
          )}
        </>
      )}
    </Card>
  );
}
