import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { GroupSizeDiscount } from "@/types/tour";

interface GroupSizeDiscountManagerProps {
  tourId?: string;
  onDiscountsChange: (discounts: GroupSizeDiscount[]) => void;
  initialDiscounts: GroupSizeDiscount[];
}

const CUSTOMER_TYPES = [
  { value: 'adult', label: 'Adult' },
  { value: 'child', label: 'Child' },
  { value: 'baby', label: 'Baby' }
];

const DISCOUNT_TYPES = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed Amount' }
];

const DISCOUNT_REASONS = [
  { value: 'early_bird', label: 'Early Bird' },
  { value: 'family', label: 'Family Discount' },
  { value: 'student', label: 'Student Discount' },
  { value: 'group_size', label: 'Group Size' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'loyalty', label: 'Loyalty' },
  { value: 'last_minute', label: 'Last Minute' }
];

export default function GroupSizeDiscountManager({ 
  tourId, 
  onDiscountsChange, 
  initialDiscounts 
}: GroupSizeDiscountManagerProps) {
  const [discounts, setDiscounts] = useState<GroupSizeDiscount[]>(initialDiscounts);
  const [newDiscount, setNewDiscount] = useState({
    customer_type: 'adult' as const,
    min_group_size: 2,
    max_group_size: undefined as number | undefined,
    discount_type: 'percentage' as const,
    discount_percentage: 0,
    discount_amount: 0,
    discount_reason: 'group_size' as const
  });

  const addDiscount = () => {
    // Check if discount values are valid based on discount type
    let isValid = false;
    if (newDiscount.discount_type === 'percentage') {
      isValid = newDiscount.discount_percentage > 0;
    } else if (newDiscount.discount_type === 'fixed') {
      isValid = newDiscount.discount_amount > 0;
    }
    
    if (!isValid || newDiscount.min_group_size <= 0) return;

    const discountItem: GroupSizeDiscount = {
      id: `temp-${Date.now()}`,
      tour_id: tourId || '',
      customer_type: newDiscount.customer_type,
      min_group_size: newDiscount.min_group_size,
      max_group_size: newDiscount.max_group_size,
      discount_type: newDiscount.discount_type,
      discount_percentage: newDiscount.discount_percentage,
      discount_amount: newDiscount.discount_amount,
      discount_reason: newDiscount.discount_reason
    };

    const updatedDiscounts = [...discounts, discountItem];
    setDiscounts(updatedDiscounts);
    onDiscountsChange(updatedDiscounts);
    
    setNewDiscount({
      customer_type: 'adult',
      min_group_size: 2,
      max_group_size: undefined,
      discount_type: 'percentage',
      discount_percentage: 0,
      discount_amount: 0,
      discount_reason: 'group_size'
    });
  };

  const removeDiscount = (index: number) => {
    const updatedDiscounts = discounts.filter((_, i) => i !== index);
    setDiscounts(updatedDiscounts);
    onDiscountsChange(updatedDiscounts);
  };

  const updateDiscount = (index: number, field: keyof GroupSizeDiscount, value: any) => {
    const updatedDiscounts = [...discounts];
    updatedDiscounts[index] = { ...updatedDiscounts[index], [field]: value };
    setDiscounts(updatedDiscounts);
    onDiscountsChange(updatedDiscounts);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Group Size & Special Discounts</CardTitle>
          <CardDescription>
            Configure discounts based on group size and special reasons like early bird, family, student discounts, etc.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>Customer Type</Label>
              <Select
                value={newDiscount.customer_type}
                onValueChange={(value: any) => setNewDiscount({ ...newDiscount, customer_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount Reason</Label>
              <Select
                value={newDiscount.discount_reason}
                onValueChange={(value: any) => setNewDiscount({ ...newDiscount, discount_reason: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISCOUNT_REASONS.map(reason => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Min Group Size</Label>
              <Input
                type="number"
                value={newDiscount.min_group_size}
                onChange={(e) => setNewDiscount({ ...newDiscount, min_group_size: parseInt(e.target.value) || 0 })}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label>Max Group Size (Optional)</Label>
              <Input
                type="number"
                value={newDiscount.max_group_size || ''}
                onChange={(e) => setNewDiscount({ ...newDiscount, max_group_size: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="Leave empty for no limit"
              />
            </div>

            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select
                value={newDiscount.discount_type}
                onValueChange={(value: any) => setNewDiscount({ ...newDiscount, discount_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISCOUNT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newDiscount.discount_type === 'percentage' ? (
              <div className="space-y-2">
                <Label>Discount Percentage (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  max="100"
                  value={newDiscount.discount_percentage}
                  onChange={(e) => setNewDiscount({ ...newDiscount, discount_percentage: parseFloat(e.target.value) || 0 })}
                  placeholder="10"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Discount Amount (₺)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newDiscount.discount_amount}
                  onChange={(e) => setNewDiscount({ ...newDiscount, discount_amount: parseFloat(e.target.value) || 0 })}
                  placeholder="50.00"
                />
              </div>
            )}

            <div className="flex items-end md:col-span-2 lg:col-span-1">
              <Button onClick={addDiscount} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Discount
              </Button>
            </div>
          </div>

          {/* Existing Discounts List */}
          <div className="space-y-4">
            {discounts.length > 0 ? (
              discounts.map((discount, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="space-y-2">
                    <Label>Customer & Reason</Label>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">
                        {CUSTOMER_TYPES.find(t => t.value === discount.customer_type)?.label}
                      </Badge>
                      <Badge variant="secondary">
                        {DISCOUNT_REASONS.find(r => r.value === discount.discount_reason)?.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Group Size Range</Label>
                    <div className="text-sm">
                      {discount.min_group_size}
                      {discount.max_group_size ? ` - ${discount.max_group_size}` : '+'} people
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Discount</Label>
                    <div className="text-sm font-medium">
                      {discount.discount_type === 'percentage' 
                        ? `${discount.discount_percentage}%` 
                        : `₺${discount.discount_amount.toFixed(2)}`
                      }
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDiscount(index)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No discounts configured yet.</p>
                <p className="text-sm">Add discount rules above to get started.</p>
              </div>
            )}
          </div>

          {/* Discounts Summary by Reason */}
          {discounts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Discounts Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DISCOUNT_REASONS.map(reason => {
                    const reasonDiscounts = discounts.filter(d => d.discount_reason === reason.value);
                    if (reasonDiscounts.length === 0) return null;

                    return (
                      <div key={reason.value} className="space-y-2">
                        <h4 className="font-medium">{reason.label}</h4>
                        {reasonDiscounts.map((discount, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium">
                              {CUSTOMER_TYPES.find(t => t.value === discount.customer_type)?.label}:
                            </div>
                            <div className="text-muted-foreground">
                              {discount.min_group_size}{discount.max_group_size ? `-${discount.max_group_size}` : '+'} people →{' '}
                              {discount.discount_type === 'percentage' 
                                ? `${discount.discount_percentage}% off` 
                                : `₺${discount.discount_amount} off`
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
