"use client";


import React from "react";
import { Button } from "@/components/ui/button";

const STOCK_IMAGES = [
  {
    id: "photo-1649972904349-6e44c42644a7",
    url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&q=80",
    desc: "Kadın, yatakta laptopla",
  },
  {
    id: "photo-1488590528505-98d2b5aba04b",
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80",
    desc: "Açık gri laptop",
  },
  {
    id: "photo-1518770660439-4636190af475",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    desc: "Siyah devre kartı makrosu",
  },
  {
    id: "photo-1461749280684-dccba630e2f6",
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    desc: "Monitor, JAVA ekranda",
  },
  {
    id: "photo-1486312338219-ce68d2c6f44d",
    url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80",
    desc: "MacBook Pro üzerinde biri",
  },
];

interface StockImageSelectorProps {
  onSelect: (url: string) => void;
}

const StockImageSelector: React.FC<StockImageSelectorProps> = ({ onSelect }) => (
  <div className="flex flex-wrap gap-2">
    {STOCK_IMAGES.map(img => (
      <button
        type="button"
        key={img.id}
        title={img.desc}
        className="w-12 h-12 rounded border overflow-hidden hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition ring-offset-background"
        onClick={() => onSelect(img.url)}
        tabIndex={0}
      >
        <img src={img.url} alt={img.desc} className="object-cover w-full h-full" />
      </button>
    ))}
  </div>
);

export default StockImageSelector;
