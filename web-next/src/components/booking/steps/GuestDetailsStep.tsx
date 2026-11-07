"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Minus, Plus } from "lucide-react";

interface GuestDetailsStepProps {
  adults: number;
  children: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
}

export default function GuestDetailsStep({
  adults,
  children,
  onAdultsChange,
  onChildrenChange
}: GuestDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">How many guests?</h3>
        <p className="text-muted-foreground">
          Select the number of adults and children for your trip
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Adults</div>
                  <div className="text-sm text-muted-foreground">Age 18+</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label="Decrease adults count"
                  onClick={() => onAdultsChange(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </Button>
                <span
                  data-testid="adults-count"
                  aria-live="polite"
                  className="w-8 text-center font-medium"
                >
                  {adults}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-testid="adults-plus"
                  aria-label="Increase adults count"
                  onClick={() => onAdultsChange(adults + 1)}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Children</div>
                  <div className="text-sm text-muted-foreground">Age 0-17</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label="Decrease children count"
                  onClick={() => onChildrenChange(Math.max(0, children - 1))}
                  disabled={children <= 0}
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </Button>
                <span
                  aria-live="polite"
                  className="w-8 text-center font-medium"
                >
                  {children}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label="Increase children count"
                  onClick={() => onChildrenChange(children + 1)}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Total guests: <span className="font-medium">{adults + children}</span>
        </p>
      </div>
    </div>
  );
}
