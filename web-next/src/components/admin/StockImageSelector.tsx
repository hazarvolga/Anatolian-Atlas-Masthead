"use client";

import React from "react";
import Image from "next/image";
import { DEMO_IMAGE_MANIFEST } from "@/lib/data/demo-images";

interface StockImageSelectorProps {
  onSelect: (url: string) => void;
}

const StockImageSelector: React.FC<StockImageSelectorProps> = ({ onSelect }) => (
  <div className="flex flex-wrap gap-2">
    {Object.values(DEMO_IMAGE_MANIFEST).map((img) => (
      <button
        type="button"
        key={img.key}
        title={img.alt}
        className="w-12 h-12 rounded border overflow-hidden hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition ring-offset-background"
        onClick={() => onSelect(img.src)}
        tabIndex={0}
      >
        <Image
          src={img.src}
          alt={img.alt}
          width={48}
          height={48}
          sizes="48px"
          className="object-cover w-full h-full"
        />
      </button>
    ))}
  </div>
);

export default StockImageSelector;
