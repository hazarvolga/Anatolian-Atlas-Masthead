
import { Calculator, AlertTriangle } from "lucide-react";

interface BookingSummarySectionProps {
  customers: any[];
  totals: {
    subtotal: number;
    addOnsTotal: number;
    discountAmount: number;
    taxAmount: number;
    finalTotal: number;
  };
  pricingLoading: boolean;
  pricingError: any;
}

export default function BookingSummarySection({
  customers,
  totals,
  pricingLoading,
  pricingError
}: BookingSummarySectionProps) {
  if (customers.length === 0) return null;

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
      {pricingLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="h-5 w-5 animate-spin" />
            <span className="text-lg font-medium">Calculating price...</span>
          </div>
        </div>
      ) : pricingError ? (
        <div className="py-8 text-center text-red-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-lg font-medium">Pricing Error</span>
          </div>
          <div className="text-sm mb-4">There was an error loading pricing information.</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Base Total:</span>
            <span className="font-semibold">${totals.subtotal.toFixed(2)}</span>
          </div>
          {totals.addOnsTotal > 0 && (
            <div className="flex justify-between items-center">
              <span>Add-ons:</span>
              <span className="font-semibold">${totals.addOnsTotal.toFixed(2)}</span>
            </div>
          )}
          {totals.discountAmount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>Discount:</span>
              <span className="font-semibold">-${totals.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span>Taxes (18%):</span>
            <span className="font-semibold">${totals.taxAmount.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span>${totals.finalTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
