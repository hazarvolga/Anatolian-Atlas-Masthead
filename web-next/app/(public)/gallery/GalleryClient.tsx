"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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
    { key: "all", label: t.gallery.filters.all || "All Plates" },
    {
      key: "architecture",
      label: t.gallery.filters.exterior || "Architecture & Monuments",
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
    <main className="pt-20 pb-24 bg-background min-h-screen">
      {/* Editorial Header */}
      <section className="py-14 md:py-20 bg-card border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <span className="editorial-kicker block">
                04 — PHOTOGRAPHIC ARCHIVE & FIELD PLATES
              </span>
              <h1 className="font-serif text-foreground">{t.gallery.title}</h1>
            </div>
            <div className="lg:col-span-4 lg:text-right space-y-2">
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                {t.gallery.subtitle}
              </p>
              <span className="inline-block text-[11px] uppercase tracking-[0.16em] text-primary font-semibold tabular-nums">
                {filteredImages.length} ARCHIVAL PLATES
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Ledger Bar */}
      <section className="border-b border-border bg-background">
        <div className="container">
          <div className="flex flex-wrap border-x border-border bg-card">
            {filterOptions.map((option, idx) => (
              <button
                key={option.key}
                type="button"
                onClick={() => filterGallery(option.key)}
                className={cn(
                  "px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition-colors border-r border-b sm:border-b-0 border-border tabular-nums",
                  activeFilter === option.key
                    ? "bg-foreground text-background"
                    : "bg-card text-text-secondary hover:text-foreground hover:bg-background"
                )}
              >
                <span className="text-primary mr-2">0{idx + 1}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Asymmetric Monograph Plate Grid */}
      <section className="py-14 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {filteredImages.map((image, index) => {
              const isWide = index % 3 === 0;
              return (
                <figure
                  key={image.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open Plate ${String(index + 1).padStart(2, "0")}: ${image.location} — ${image.alt}`}
                  className={cn(
                    "group bg-card border border-border cursor-pointer transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between",
                    isWide ? "md:col-span-7" : "md:col-span-5"
                  )}
                  onClick={() => setSelectedImage(image.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedImage(image.id);
                    }
                  }}
                >
                  <div>
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-text-secondary tabular-nums bg-background/50">
                      <span className="text-primary font-semibold">
                        PLATE {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{image.region}</span>
                    </div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-foreground border-b border-border">
                      <img
                        src={image.src}
                        alt={image.alt}
                        width={1200}
                        height={750}
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                  <figcaption className="p-5 space-y-1.5">
                    <div className="font-serif text-xl text-foreground">
                      {image.location}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {image.alt}
                    </p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.alt}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-background p-3 border border-background/25 hover:bg-background hover:text-foreground transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-background p-3 border border-background/25 hover:bg-background hover:text-foreground transition-colors"
            onClick={() => navigateGallery("prev")}
            aria-label="Previous photograph"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <figure className="max-w-4xl w-full space-y-4">
            <div className="max-h-[75vh] overflow-hidden border border-background/20 flex items-center justify-center bg-foreground">
              <img
                src={activeLightboxItem.src}
                alt={activeLightboxItem.alt}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <figcaption className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-background/90 px-1 uppercase tracking-[0.14em]">
              <span className="font-semibold text-primary-subtle">
                {activeLightboxItem.location} — {activeLightboxItem.region}
              </span>
              <span className="text-background/75 normal-case tracking-normal">
                {activeLightboxItem.alt}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-background p-3 border border-background/25 hover:bg-background hover:text-foreground transition-colors"
            onClick={() => navigateGallery("next")}
            aria-label="Next photograph"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </main>
  );
}
