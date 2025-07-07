
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface TourInclusionsProps {
  included: string[];
  excluded: string[];
  onIncludedChange: (included: string[]) => void;
  onExcludedChange: (excluded: string[]) => void;
}

export default function TourInclusions({ 
  included, 
  excluded, 
  onIncludedChange, 
  onExcludedChange 
}: TourInclusionsProps) {
  const [newIncluded, setNewIncluded] = useState("");
  const [newExcluded, setNewExcluded] = useState("");

  const addIncluded = () => {
    if (newIncluded.trim() && !included.includes(newIncluded.trim())) {
      onIncludedChange([...included, newIncluded.trim()]);
      setNewIncluded("");
    }
  };

  const removeIncluded = (index: number) => {
    onIncludedChange(included.filter((_, i) => i !== index));
  };

  const addExcluded = () => {
    if (newExcluded.trim() && !excluded.includes(newExcluded.trim())) {
      onExcludedChange([...excluded, newExcluded.trim()]);
      setNewExcluded("");
    }
  };

  const removeExcluded = (index: number) => {
    onExcludedChange(excluded.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* What's Included */}
      <div className="space-y-4">
        <Label>What's Included</Label>
        <div className="flex gap-2">
          <Input
            value={newIncluded}
            onChange={(e) => setNewIncluded(e.target.value)}
            placeholder="Enter what's included in this tour"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIncluded())}
          />
          <Button type="button" onClick={addIncluded} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {included.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {included.map((item, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {item}
                <button
                  type="button"
                  onClick={() => removeIncluded(index)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* What's Excluded */}
      <div className="space-y-4">
        <Label>What's Excluded</Label>
        <div className="flex gap-2">
          <Input
            value={newExcluded}
            onChange={(e) => setNewExcluded(e.target.value)}
            placeholder="Enter what's not included in this tour"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExcluded())}
          />
          <Button type="button" onClick={addExcluded} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {excluded.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {excluded.map((item, index) => (
              <Badge key={index} variant="destructive" className="gap-1">
                {item}
                <button
                  type="button"
                  onClick={() => removeExcluded(index)}
                  className="ml-1 hover:text-red-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
