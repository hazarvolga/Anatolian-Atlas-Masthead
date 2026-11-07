"use client";


import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StockImageSelector from "../StockImageSelector";
import AIGenerateImagePanel from "../AIGenerateImagePanel";
import { useState } from "react";

export interface DestinationFormData {
  name?: string;
  description?: string;
  country?: string;
  city?: string;
  image_url?: string;
  is_active?: boolean;
  coords?: string;
  best_time?: string;
  activities?: string;
  google_maps_url?: string;
  gallery_images?: string[];
  extra_info?: string;
}

interface BasicDestinationInfoProps {
  register: UseFormRegister<DestinationFormData>;
  errors: FieldErrors<DestinationFormData>;
  setValue: UseFormSetValue<DestinationFormData>;
  watch: UseFormWatch<DestinationFormData>;
  onImageAltText: () => void;
  imageHelper?: any;
}

export default function BasicDestinationInfo({
  register,
  errors,
  setValue,
  watch,
  onImageAltText,
  imageHelper
}: BasicDestinationInfoProps) {
  const [showStockImages, setShowStockImages] = useState(false);
  const [aiImagePanelOpen, setAIImagePanelOpen] = useState(false);
  
  const name = watch("name");
  const city = watch("city");
  const country = watch("country");
  const image_url = watch("image_url");

  return (
    <section>
      <h3 className="font-semibold text-lg mb-2 text-primary">Temel Bilgiler</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Destinasyon Adı</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Destinasyon adını girin"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="country">Ülke</Label>
          <Input
            id="country"
            {...register("country")}
            placeholder="Ülkeyi girin"
          />
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="city">Şehir</Label>
          <Input
            id="city"
            {...register("city")}
            placeholder="Şehiri girin"
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="image_url">Resim URL (opsiyonel)</Label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center flex-wrap">
              <Input
                id="image_url"
                {...register("image_url")}
                placeholder="https://example.com/image.jpg"
                onBlur={onImageAltText}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="whitespace-nowrap"
                onClick={onImageAltText}
                disabled={!image_url}
              >
                Alt Metin Önerisi
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Stok görselleri aç"
                onClick={() => setShowStockImages(s => !s)}
              >
                📸
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAIImagePanelOpen(true)}
                className="whitespace-nowrap"
              >
                AI ile Görsel Üret
              </Button>
            </div>
            {image_url && (
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={image_url}
                  alt="Önizleme"
                  className="w-20 h-20 object-cover rounded border"
                  style={{ minWidth: 56, background: "#f4f4f5" }}
                  onError={e => (e.currentTarget.style.display = "none")}
                />
                <span className="text-xs text-muted-foreground">Girilen URL'nin önizlemesi</span>
              </div>
            )}
            {showStockImages && (
              <div className="mt-2">
                <StockImageSelector
                  onSelect={url => {
                    setValue("image_url", url);
                    setShowStockImages(false);
                  }}
                />
              </div>
            )}
          </div>
          {errors.image_url && (
            <p className="text-sm text-red-500">{errors.image_url.message}</p>
          )}
          {imageHelper && image_url && (
            <div className="mt-1 text-xs space-y-1 border rounded bg-muted p-2">
              {imageHelper.error && (<span className="text-red-500">{imageHelper.error}</span>)}
              {imageHelper.valid !== undefined && (<span className={imageHelper.valid ? "text-green-600" : "text-orange-600"}>
                {imageHelper.valid ? "Resim geçerli" : "Resim doğrulanamadı"}
              </span>)}
              {imageHelper.alt && (<div><b>Alt (AI):</b> {imageHelper.alt}</div>)}
            </div>
          )}
        </div>
      </div>

      {aiImagePanelOpen && (
        <AIGenerateImagePanel
          prompt={`${name || ""}, ${city || ""}, ${country || ""}`}
          onSelect={url => {
            setValue("image_url", url);
          }}
          onClose={() => setAIImagePanelOpen(false)}
        />
      )}
    </section>
  );
}
