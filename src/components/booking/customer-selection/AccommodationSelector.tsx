
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home } from "lucide-react";

interface AccommodationSelectorProps {
  customerType: 'adult' | 'child' | 'baby';
  count: number;
  label: string;
  accommodationType: string;
  onAccommodationChange: (accommodationType: string) => void;
}

const accommodationTypes = [
  { value: 'none', label: 'No Accommodation', description: 'Day tour only' },
  { value: 'single', label: 'Single Room', description: 'Private room for one' },
  { value: 'double', label: 'Double Room', description: 'Shared room for two' },
  { value: 'shared', label: 'Shared Room', description: 'Budget-friendly option' }
];

export default function AccommodationSelector({
  customerType,
  count,
  label,
  accommodationType,
  onAccommodationChange
}: AccommodationSelectorProps) {
  return (
    <div className="ml-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg border-l-4 border-primary">
      <div className="flex items-center gap-2 mb-3">
        <Home className="h-4 w-4 text-primary" />
        <label className="text-sm font-medium text-primary">
          Accommodation for {count} {label.toLowerCase()}:
        </label>
      </div>
      <Select 
        value={accommodationType} 
        onValueChange={onAccommodationChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select accommodation" />
        </SelectTrigger>
        <SelectContent>
          {accommodationTypes.map(({ value, label, description }) => (
            <SelectItem key={value} value={value}>
              <div className="flex flex-col items-start">
                <div className="font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {accommodationType !== 'none' && (
        <div className="text-xs text-muted-foreground mt-2 p-2 bg-white/50 dark:bg-black/20 rounded">
          💡 Room selection affects final pricing. Prices will update automatically.
        </div>
      )}
    </div>
  );
}
