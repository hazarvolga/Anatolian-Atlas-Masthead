
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PriceSummaryCard({ pricing, pricingLoading }: any) {
  // Yeni: breakdown güncel mi logla
  if (typeof window !== "undefined") {
    console.log("PriceSummaryCard props ALDIM:", { 
      pricing, 
      pricingLoading,
      breakdownArr: pricing?.breakdown,
      total: pricing?.total,
      updatedAt: new Date().toISOString() 
    });
  }

  // pricing.breakdown array check
  const breakdown = Array.isArray(pricing?.breakdown) ? pricing.breakdown : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Price Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pricingLoading ? (
          <div className="text-center py-4 text-muted-foreground">
            Calculating final price...
          </div>
        ) : (
          <div className="space-y-3">
            {breakdown.length > 0
              ? breakdown.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.item ??
                        (item.customer?.type
                          ? `${item.customer.count} ${item.customer.type}s`.toUpperCase()
                          : "Extra")}
                      {(() => {
                        if (item.customer?.accommodationType && item.customer.accommodationType !== "none") {
                          const accType = item.customer.accommodationType;
                          const modifiedAccType = accType.replace(/\s*\(\d+\s+night(s)?\)/i, '').trim();
                          if (modifiedAccType) {
                            return ` (${modifiedAccType})`;
                          }
                        }
                        return "";
                      })()}
                    </span>
                    <span>
                      {typeof item.price === "number"
                        ? item.price < 0
                          ? `-${Math.abs(item.price).toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}`
                          : item.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })
                        : "$0.00"}
                    </span>
                  </div>
                ))
              : <div className="text-muted-foreground italic text-sm">No price breakdown available. Please adjust your selections.</div>
            }
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>
                {typeof pricing?.total === "number"
                  ? pricing.total.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  : "$0.00"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
