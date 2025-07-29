
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";

interface CustomerCounterProps {
  type: 'adult' | 'child' | 'baby';
  label: string;
  description: string;
  icon: string;
  note: string;
  count: number;
  minCount: number;
  onCountChange: (count: number) => void;
}

export default function CustomerCounter({
  type,
  label,
  description,
  icon,
  note,
  count,
  minCount,
  onCountChange
}: CustomerCounterProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-medium flex items-center gap-2">
            {label}
            {type === 'adult' && <Badge variant="secondary" className="text-xs">Required</Badge>}
          </div>
          <div className="text-sm text-muted-foreground">{description}</div>
          <div className="text-xs text-muted-foreground mt-1">{note}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCountChange(Math.max(minCount, count - 1))}
          disabled={count <= minCount}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium text-lg">{count}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCountChange(count + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
