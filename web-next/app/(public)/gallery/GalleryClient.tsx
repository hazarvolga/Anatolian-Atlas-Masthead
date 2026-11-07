"use client";

import { useEffect, useState, useCallback } from "react";
import { X, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_GALLERY_ITEMS, type GalleryItem } from "@/lib/data/demo-content";

type FilterCategory =
  | "all"
  | "architecture"
  | "landscapes"
  | "coastline"
  | "craft";

export default function GalleryClient() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filteredImages, setFilteredImages] =
    useState<GalleryItem[]>(DEMO_GALLERY_ITEMS);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const filterGallery = (category: FilterCategory) => {
    setActiveFilter(category);
    if (category === "all") {
      setFilteredImages(DEMO_GALLERY_ITEMS);
    } else {
      setFilteredImages(
        DEMO_GALLERY_ITEMS.filter((img) => img.category === category)
      );
    }
  };

  const navigateGallery = useCallback(
    (direction: "prev" | "next") => {
      if (selectedImage === null || filteredImages.length === 0) return;

      const currentIndex = filteredImages.findIndex(
        (img) => img.id === selectedImage
      );
      const newIndex =
        direction === "prev"
          ? currentIndex > 0
            ? currentIndex - 1
            : filteredImages.length - 1
          : currentIndex < filteredImages.length - 1
            ? currentIndex + 1
            : 0;

      setSelectedImage(filteredImages[newIndex].id);
    },
    [selectedImage, filteredImages]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === "Escape") {
        setSelectedImage(null);
      } else if (e.key === "ArrowLeft") {
        navigateGallery("prev");
      } else if (e.key === "ArrowRight") {
        navigateGallery("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, navigateGallery]);

  const filterOptions: { key: FilterCategory; label: string }[] = [
    { key: "all", label: t.gallery.filters.all || "All Regions" },
    {
      key: "architecture",
      label: t.gallery.filters.exterior || "Architecture & Sites",
    },
    {
      key: "landscapes",
      label: t.gallery.filters.rooms || "Landscapes & Valleys",
    },
    { key: "coastline", label: "Coastline & Straits" },
    { key: "craft", label: "Material Craft" },
  ];

  const activeLightboxItem = filteredImages.find(
    (img) => img.id === selectedImage
  );

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="py-12 md:py-16 bg-background border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-3">
            <span className="editorial-kicker block">
              ANATOLIAN ATLAS — PHOTOGRAPHIC FIELD NOTES
            </span>
            <h1 className="font-serif text-foreground">{t.gallery.title}</h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              {t.gallery.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Archive Grid */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-wrap gap-2 mb-10">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => filterGallery(option.key)}
                className={cn(
                  "px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors border",
                  activeFilter === option.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-text-secondary border-border hover:text-foreground hover:border-foreground/30"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image, index) => (
              <figure
                key={image.id}
                className="group bg-card rounded-lg border border-border overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => setSelectedImage(image.id)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-background/95 text-foreground font-mono text-[11px] font-medium border border-border/80 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <figcaption className="p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-primary font-medium">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {image.location}
                    </span>
                    <span className="text-text-secondary">{image.region}</span>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {image.alt}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-atlas-ink/95 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.alt}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-atlas-paper p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-atlas-paper p-3 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => navigateGallery("prev")}
            aria-label="Previous photograph"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <figure className="max-w-4xl w-full space-y-3">
            <div className="max-h-[75vh] overflow-hidden rounded-md flex items-center justify-center">
              <img
                src={activeLightboxItem.src}
                alt={activeLightboxItem.alt}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <figcaption className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-atlas-paper/90 px-1">
              <span className="font-medium">
                {activeLightboxItem.location} — {activeLightboxItem.region}
              </span>
              <span className="text-atlas-paper/75">
                {activeLightboxItem.alt}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-atlas-paper p-3 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => navigateGallery("next")}
            aria-label="Next photograph"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  );
}
