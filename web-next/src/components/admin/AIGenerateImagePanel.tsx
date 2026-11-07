"use client";


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIGenerateImagePanelProps {
  prompt: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

const DUMMY_LOADING_IMAGE = "https://media.giphy.com/media/3ov9k5OeYmXJvVQ6UQ/giphy.gif";

export default function AIGenerateImagePanel({
  prompt,
  onSelect,
  onClose,
}: AIGenerateImagePanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState(prompt);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setImageUrl(null);
    try {
      // OpenAI gpt-image-1 veya DALL-E ile görsel oluşturma örnek çağrısı
      const resp = await fetch("/api/generate-ai-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt }),
      });
      const data = await resp.json();
      if (!data.imageUrl) throw new Error(data.error || "Görsel üretilemedi");
      setImageUrl(data.imageUrl);
    } catch (e: any) {
      setError(e.message || "Beklenmedik bir hata oluştu");
    }
    setLoading(false);
  };

  return (
    <div className="fixed z-50 inset-0 bg-black/40 flex items-center justify-center">
      <Card className="max-w-sm w-full shadow-lg relative">
        <CardHeader>
          <CardTitle>AI ile Görsel Oluştur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Prompt</label>
            <Input 
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="örn: Kapadokya'da sıcak hava balonları"
            />
            <Button 
              onClick={handleGenerate}
              disabled={loading || !customPrompt}
              type="button"
              variant="outline"
            >
              {loading ? "Oluşturuluyor..." : "Görsel Üret"}
            </Button>
            {loading && (
              <div className="flex items-center justify-center py-4">
                <img src={DUMMY_LOADING_IMAGE} alt="Yükleniyor" className="w-12 h-12" />
              </div>
            )}
            {imageUrl && (
              <div className="mt-2 flex flex-col gap-2 items-center">
                <img
                  src={imageUrl}
                  alt="AI Görseli"
                  className="w-40 h-40 object-cover rounded border"
                />
                <Button
                  size="sm"
                  variant="default"
                  type="button"
                  onClick={() => {
                    onSelect(imageUrl);
                    onClose();
                  }}
                >
                  Bu görseli kullan
                </Button>
              </div>
            )}
            {error && (
              <div className="text-sm text-red-500 mt-2">{error}</div>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              type="button"
              onClick={onClose}
            >
              Kapat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
