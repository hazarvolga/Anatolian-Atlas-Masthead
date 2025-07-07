
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Calendar } from "lucide-react";
import { SeasonalPricing } from "@/types/tour";

interface SeasonalPricingManagerProps {
  tourId?: string;
  onSeasonalPricingChange: (seasonalPricing: SeasonalPricing[]) => void;
  initialSeasonalPricing?: SeasonalPricing[];
}

export default function SeasonalPricingManager({ 
  tourId, 
  onSeasonalPricingChange, 
  initialSeasonalPricing = [] 
}: SeasonalPricingManagerProps) {
  const [seasonalPricing, setSeasonalPricing] = useState<SeasonalPricing[]>(initialSeasonalPricing);

  const customerTypes = [
    { value: 'adult', label: 'Adult' },
    { value: 'child', label: 'Child' },
    { value: 'baby', label: 'Baby' }
  ] as const;

  useEffect(() => {
    onSeasonalPricingChange(seasonalPricing);
  }, [seasonalPricing, onSeasonalPricingChange]);

  const addSeasonalPricing = () => {
    const newPricing: SeasonalPricing = {
      id: `temp-${Date.now()}`,
      tour_id: tourId || '',
      customer_type: 'adult',
      start_date: '',
      end_date: '',
      price_adjustment: 0,
      adjustment_type: 'percentage'
    };
    setSeasonalPricing([...seasonalPricing, newPricing]);
  };

  const updateSeasonalPricing = (id: string, field: keyof SeasonalPricing, value: string | number) => {
    setSeasonalPricing(seasonalPricing.map(pricing => 
      pricing.id === id ? { ...pricing, [field]: value } : pricing
    ));
  };

  const removeSeasonalPricing = (id: string) => {
    setSeasonalPricing(seasonalPricing.filter(pricing => pricing.id !== id));
  };

  const getAdjustmentTypeLabel = (type: 'percentage' | 'fixed') => {
    return type === 'percentage' ? '%' : '₺';
  };

  const getAdjustmentDisplay = (adjustment: number, type: 'percentage' | 'fixed') => {
    const symbol = adjustment >= 0 ? '+' : '';
    const suffix = type === 'percentage' ? '%' : '₺';
    return `${symbol}${adjustment}${suffix}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Seasonal Pricing
        </CardTitle>
        <CardDescription>
          Set special pricing for holidays and seasonal periods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {seasonalPricing.map((pricing) => (
          <div key={pricing.id} className="p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`start-date-${pricing.id}`}>Start Date</Label>
                <Input
                  id={`start-date-${pricing.id}`}
                  type="date"
                  value={pricing.start_date}
                  onChange={(e) => updateSeasonalPricing(pricing.id, 'start_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`end-date-${pricing.id}`}>End Date</Label>
                <Input
                  id={`end-date-${pricing.id}`}
                  type="date"
                  value={pricing.end_date}
                  onChange={(e) => updateSeasonalPricing(pricing.id, 'end_date', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`customer-type-${pricing.id}`}>Customer Type</Label>
                <Select
                  value={pricing.customer_type}
                  onValueChange={(value: 'adult' | 'child' | 'baby') => 
                    updateSeasonalPricing(pricing.id, 'customer_type', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`adjustment-type-${pricing.id}`}>Adjustment Type</Label>
                <Select
                  value={pricing.adjustment_type}
                  onValueChange={(value: 'percentage' | 'fixed') => 
                    updateSeasonalPricing(pricing.id, 'adjustment_type', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₺)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`adjustment-${pricing.id}`}>
                  Price Adjustment ({getAdjustmentTypeLabel(pricing.adjustment_type)})
                </Label>
                <Input
                  id={`adjustment-${pricing.id}`}
                  type="number"
                  step={pricing.adjustment_type === 'percentage' ? '1' : '0.01'}
                  value={pricing.price_adjustment}
                  onChange={(e) => updateSeasonalPricing(pricing.id, 'price_adjustment', parseFloat(e.target.value) || 0)}
                  placeholder={pricing.adjustment_type === 'percentage' ? '10' : '50.00'}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {customerTypes.find(t => t.value === pricing.customer_type)?.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {pricing.start_date} → {pricing.end_date}
                </span>
                <Badge variant={pricing.price_adjustment >= 0 ? "default" : "secondary"}>
                  {getAdjustmentDisplay(pricing.price_adjustment, pricing.adjustment_type)}
                </Badge>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeSeasonalPricing(pricing.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addSeasonalPricing}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Seasonal Pricing
        </Button>

        {seasonalPricing.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No seasonal pricing configured yet. Add special pricing for holidays or seasons.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
