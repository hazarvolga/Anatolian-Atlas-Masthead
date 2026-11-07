"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SeasonalGroupDiscount {
  id: string;
  start_date: string;
  end_date: string;
  min_group_size: number;
  max_group_size?: number;
  customer_type: 'adult' | 'child' | 'baby';
  discount_percentage: number;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
}

interface SeasonalGroupDiscountManagerProps {
  tourId?: string;
  onDiscountsChange?: (discounts: SeasonalGroupDiscount[]) => void;
  initialDiscounts?: SeasonalGroupDiscount[];
}

export default function SeasonalGroupDiscountManager({ 
  tourId, 
  onDiscountsChange, 
  initialDiscounts = [] 
}: SeasonalGroupDiscountManagerProps) {
  const [discounts, setDiscounts] = useState<SeasonalGroupDiscount[]>(initialDiscounts);
  const [newDiscount, setNewDiscount] = useState({
    start_date: '',
    end_date: '',
    min_group_size: 2,
    max_group_size: undefined as number | undefined,
    customer_type: 'adult' as const,
    discount_percentage: 0,
    discount_amount: 0,
    discount_type: 'percentage' as const
  });

  const customerTypes = [
    { value: 'adult', label: 'Adult' },
    { value: 'child', label: 'Child' },
    { value: 'baby', label: 'Baby' }
  ] as const;

  useEffect(() => {
    onDiscountsChange?.(discounts);
  }, [discounts, onDiscountsChange]);

  const addDiscount = () => {
    if (!newDiscount.start_date || !newDiscount.end_date) {
      return;
    }

    const discount: SeasonalGroupDiscount = {
      id: `temp-${Date.now()}`,
      ...newDiscount
    };
    setDiscounts([...discounts, discount]);
    setNewDiscount({
      start_date: '',
      end_date: '',
      min_group_size: 2,
      max_group_size: undefined,
      customer_type: 'adult',
      discount_percentage: 0,
      discount_amount: 0,
      discount_type: 'percentage'
    });
  };

  const removeDiscount = (id: string) => {
    setDiscounts(discounts.filter(d => d.id !== id));
  };

  const updateDiscount = (id: string, field: keyof SeasonalGroupDiscount, value: any) => {
    setDiscounts(discounts.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seasonal Group Discounts</CardTitle>
        <CardDescription>
          Set seasonal discounts based on group size and customer type
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Discounts */}
        {discounts.map((discount) => (
          <div key={discount.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {format(new Date(discount.start_date), "MMM dd, yyyy")} - {format(new Date(discount.end_date), "MMM dd, yyyy")}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeDiscount(discount.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <Label className="text-xs">Min Size</Label>
                <Input
                  type="number"
                  value={discount.min_group_size}
                  onChange={(e) => updateDiscount(discount.id, 'min_group_size', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <Label className="text-xs">Max Size</Label>
                <Input
                  type="number"
                  value={discount.max_group_size || ''}
                  onChange={(e) => updateDiscount(discount.id, 'max_group_size', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <Label className="text-xs">Customer Type</Label>
                <Select 
                  value={discount.customer_type} 
                  onValueChange={(value) => updateDiscount(discount.id, 'customer_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customerTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select 
                  value={discount.discount_type} 
                  onValueChange={(value) => updateDiscount(discount.id, 'discount_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">
                  {discount.discount_type === 'percentage' ? 'Percentage (%)' : 'Amount (₺)'}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={discount.discount_type === 'percentage' ? discount.discount_percentage : discount.discount_amount}
                  onChange={(e) => {
                    const field = discount.discount_type === 'percentage' ? 'discount_percentage' : 'discount_amount';
                    updateDiscount(discount.id, field, parseFloat(e.target.value) || 0);
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add New Seasonal Group Discount */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-4">Add New Seasonal Group Discount</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newDiscount.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDiscount.start_date ? format(new Date(newDiscount.start_date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newDiscount.start_date ? new Date(newDiscount.start_date) : undefined}
                      onSelect={(date) => setNewDiscount({...newDiscount, start_date: date ? format(date, 'yyyy-MM-dd') : ''})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newDiscount.end_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDiscount.end_date ? format(new Date(newDiscount.end_date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newDiscount.end_date ? new Date(newDiscount.end_date) : undefined}
                      onSelect={(date) => setNewDiscount({...newDiscount, end_date: date ? format(date, 'yyyy-MM-dd') : ''})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <Label>Min Group Size</Label>
                <Input
                  type="number"
                  value={newDiscount.min_group_size}
                  onChange={(e) => setNewDiscount({...newDiscount, min_group_size: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div>
                <Label>Max Group Size</Label>
                <Input
                  type="number"
                  value={newDiscount.max_group_size || ''}
                  onChange={(e) => setNewDiscount({...newDiscount, max_group_size: e.target.value ? parseInt(e.target.value) : undefined})}
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <Label>Customer Type</Label>
                <Select 
                  value={newDiscount.customer_type} 
                  onValueChange={(value: any) => setNewDiscount({...newDiscount, customer_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customerTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Discount Type</Label>
                <Select 
                  value={newDiscount.discount_type} 
                  onValueChange={(value: any) => setNewDiscount({...newDiscount, discount_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>
                  {newDiscount.discount_type === 'percentage' ? 'Percentage (%)' : 'Amount (₺)'}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newDiscount.discount_type === 'percentage' ? newDiscount.discount_percentage : newDiscount.discount_amount}
                  onChange={(e) => {
                    const field = newDiscount.discount_type === 'percentage' ? 'discount_percentage' : 'discount_amount';
                    setNewDiscount({...newDiscount, [field]: parseFloat(e.target.value) || 0});
                  }}
                />
              </div>
            </div>
            <Button 
              onClick={addDiscount}
              disabled={!newDiscount.start_date || !newDiscount.end_date}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Seasonal Group Discount
            </Button>
          </div>
        </div>

        {discounts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No seasonal group discounts configured yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
