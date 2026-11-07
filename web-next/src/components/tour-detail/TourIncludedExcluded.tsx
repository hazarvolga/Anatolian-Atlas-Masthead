
import { Badge } from "@/components/ui/badge";

interface TourIncludedExcludedProps {
  included?: string[];
  excluded?: string[];
}

export default function TourIncludedExcluded({ included = [], excluded = [] }: TourIncludedExcludedProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-semibold mb-2 text-primary">What&apos;s Included</h3>
        {included.length ? (
          <ul className="flex flex-wrap gap-2">
            {included.map((item, idx) => (
              <Badge key={idx} variant="secondary" className="mb-1">
                {item}
              </Badge>
            ))}
          </ul>
        ) : (
          <span className="text-sm text-muted-foreground">No details provided.</span>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">What&apos;s Excluded</h3>
        {excluded.length ? (
          <ul className="flex flex-wrap gap-2">
            {excluded.map((item, idx) => (
              <Badge key={idx} variant="destructive" className="mb-1">
                {item}
              </Badge>
            ))}
          </ul>
        ) : (
          <span className="text-sm text-muted-foreground">No details provided.</span>
        )}
      </div>
    </div>
  );
}
