import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, ShoppingCart, Info } from "lucide-react";
import { useTourAddOns } from "@/hooks/useTourAddOns";
import { SelectedAddOn } from "@/types/booking";

interface AddOnSelectionProps {
  tourId: string;
  selectedAddOns: SelectedAddOn[];
  onAddOnsChange: (addOns: SelectedAddOn[]) => void;
  totalGuests: number;
}

export default function AddOnSelection({
  tourId,
  selectedAddOns,
  onAddOnsChange,
  totalGuests
}: AddOnSelectionProps) {
  const { data: addOns = [], isLoading } = useTourAddOns(tourId);

  const addOnsByCategory = addOns.reduce((acc, addOn) => {
    const category = addOn.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(addOn);
    return acc;
  }, {} as Record<string, typeof addOns>);

  const updateAddOnQuantity = (addOnId: string, quantity: number) => {
    const addOn = addOns.find(a => a.id === addOnId);
    if (!addOn) return;

    const existing = selectedAddOns.find(sa => sa.addOnId === addOnId);
    
    if (quantity === 0) {
      onAddOnsChange(selectedAddOns.filter(sa => sa.addOnId !== addOnId));
      return;
    }

    const unitPrice = addOn.price;
    const finalQuantity = addOn.is_per_person ? quantity * totalGuests : quantity;
    const totalPrice = unitPrice * finalQuantity;

    if (existing) {
      onAddOnsChange(
        selectedAddOns.map(sa =>
          sa.addOnId === addOnId
            ? { ...sa, quantity, unitPrice, totalPrice }
            : sa
        )
      );
    } else {
      onAddOnsChange([
        ...selectedAddOns,
        {
          id: `addon-${Date.now()}-${Math.random()}`,
          addOnId,
          quantity,
          unitPrice,
          totalPrice
        }
      ]);
    }
  };

  const getSelectedQuantity = (addOnId: string) => {
    return selectedAddOns.find(sa => sa.addOnId === addOnId)?.quantity || 0;
  };

  const getTotalAddOnsPrice = () => {
    return selectedAddOns.reduce((total, addOn) => total + addOn.totalPrice, 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (addOns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add-on Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No additional services available for this tour.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Add-on Services
        </CardTitle>
        {selectedAddOns.length > 0 && (
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              {selectedAddOns.length} service{selectedAddOns.length !== 1 ? 's' : ''} selected
            </Badge>
            <span className="font-semibold">₺{getTotalAddOnsPrice()}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(addOnsByCategory).map(([category, categoryAddOns]) => (
          <div key={category}>
            <h4 className="font-medium mb-3 capitalize">
              {category.replace('_', ' ')} Services
            </h4>
            <div className="space-y-3">
              {categoryAddOns.map((addOn) => {
                const selectedQuantity = getSelectedQuantity(addOn.id);
                const displayPrice = addOn.is_per_person 
                  ? `₺${addOn.price} per person` 
                  : `₺${addOn.price}`;

                return (
                  <div key={addOn.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium">{addOn.name}</h5>
                        {addOn.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {addOn.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-semibold text-primary">{displayPrice}</span>
                          {addOn.is_per_person && (
                            <Badge variant="secondary" className="text-xs">
                              <Info className="h-3 w-3 mr-1" />
                              Per Person
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAddOnQuantity(addOn.id, Math.max(0, selectedQuantity - 1))}
                          disabled={selectedQuantity === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{selectedQuantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAddOnQuantity(addOn.id, selectedQuantity + 1)}
                          disabled={addOn.max_quantity && selectedQuantity >= addOn.max_quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {selectedQuantity > 0 && (
                      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                        <div className="flex justify-between items-center">
                          <span>
                            {selectedQuantity} × {displayPrice}
                            {addOn.is_per_person && ` × ${totalGuests} guests`}
                          </span>
                          <span className="font-semibold">
                            ₺{selectedAddOns.find(sa => sa.addOnId === addOn.id)?.totalPrice || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {category !== Object.keys(addOnsByCategory)[Object.keys(addOnsByCategory).length - 1] && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}

        {selectedAddOns.length > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Add-ons:</span>
              <span className="font-bold text-lg">₺{getTotalAddOnsPrice()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
