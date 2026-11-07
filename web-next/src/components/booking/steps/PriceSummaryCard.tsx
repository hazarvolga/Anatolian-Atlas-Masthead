"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BreakdownItem {
  item?: string;
  price?: number;
  customer?: {
    count?: number;
    type?: string;
    accommodationType?: string;
  };
}

interface PriceSummaryCardProps {
  pricing?: {
    total?: number;
    breakdown?: BreakdownItem[];
  } | null;
  pricingLoading?: boolean;
}

export default function PriceSummaryCard({
  pricing,
  pricingLoading,
}: PriceSummaryCardProps) {
  const breakdown = Array.isArray(pricing?.breakdown) ? pricing.breakdown : [];

  const formatEuro = (val: number) =>
    `€${Math.abs(val).toFixed(2)}`;

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
            {breakdown.length > 0 ? (
              breakdown.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.item ??
                      (item.customer?.type
                        ? `${item.customer.count} ${item.customer.type}s`.toUpperCase()
                        : "Extra")}
                  </span>
                  <span className="tabular-nums">
                    {typeof item.price === "number"
                      ? item.price < 0
                        ? `-${formatEuro(item.price)}`
                        : formatEuro(item.price)
                      : "€0.00"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground italic text-sm">
                No price breakdown available. Please adjust your selections.
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="tabular-nums">
                {typeof pricing?.total === "number"
                  ? formatEuro(pricing.total)
                  : "€0.00"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
