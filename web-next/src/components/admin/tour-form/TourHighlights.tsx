"use client";


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface TourHighlightsProps {
  highlights: string[];
  onHighlightsChange: (highlights: string[]) => void;
}

export default function TourHighlights({ highlights, onHighlightsChange }: TourHighlightsProps) {
  const [newHighlight, setNewHighlight] = useState("");

  const addHighlight = () => {
    if (newHighlight.trim() && !highlights.includes(newHighlight.trim())) {
      onHighlightsChange([...highlights, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    onHighlightsChange(highlights.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label>Tour Highlights</Label>
      <div className="flex gap-2">
        <Input
          value={newHighlight}
          onChange={(e) => setNewHighlight(e.target.value)}
          placeholder="Add a highlight"
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
        />
        <Button type="button" onClick={addHighlight} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {highlights.map((highlight, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {highlight}
              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
