
import { Info } from "lucide-react";

interface CustomerInfoPanelProps {
  shouldShowAccommodation: boolean;
  totalTravelers: number;
}

export default function CustomerInfoPanel({ shouldShowAccommodation, totalTravelers }: CustomerInfoPanelProps) {
  return (
    <>
      {/* Accommodation availability info */}
      {shouldShowAccommodation && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Accommodation Options Available:</p>
              <p className="text-blue-800 dark:text-blue-200">This tour includes accommodation options. Please select your preference for each traveler type.</p>
            </div>
          </div>
        </div>
      )}

      {/* Important notes */}
      <div className="text-sm text-muted-foreground p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100 mb-2">Important Notes:</p>
            <ul className="text-xs space-y-1 text-amber-800 dark:text-amber-200">
              <li>• At least one adult (12+) is required for booking</li>
              <li>• Children (2-11) receive discounted pricing</li>
              <li>• Babies (under 2) may have special pricing or be free</li>
              {shouldShowAccommodation && <li>• Accommodation selection affects the final price</li>}
              <li>• Group discounts may apply automatically for larger groups</li>
              <li>• All prices include taxes and fees</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
