"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { TourPricing } from "@/types/tour";
import { toast } from "@/hooks/use-toast"; // <-- toast eklendi
import { Coins } from "lucide-react";

interface TourPricingManagerProps {
  tourId?: string;
  onPricingChange: (pricing: TourPricing[]) => void;
  initialPricing: TourPricing[];
  basePriceFromForm?: number;
  tourType?: string; // Added tour_type prop
}

const CUSTOMER_TYPES = [
  { value: 'adult', label: 'Adult' },
  { value: 'child', label: 'Child' },
  { value: 'baby', label: 'Baby' }
];

const ACCOMMODATION_TYPES = [
  { value: 'none', label: 'No Accommodation' },
  { value: 'single', label: 'Single Room' },
  { value: 'double', label: 'Double Room' },
  { value: 'triple', label: 'Triple Room' },
  { value: 'shared', label: 'Shared Room' }
];

export default function TourPricingManager({ 
  tourId, 
  onPricingChange, 
  initialPricing,
  basePriceFromForm,
  tourType
}: TourPricingManagerProps) {
  // Determine if it's a multi-day tour based on the tourType prop
  const isMultiDayTour = tourType === 'multiple_day' || tourType === 'date_range';
  
  // initialPricing değiştiğinde local state'i güncel tut
  const [pricing, setPricing] = useState<TourPricing[]>(initialPricing);
  useEffect(() => {
    setPricing(initialPricing);
  }, [initialPricing]);

  // Define accommodation type properly with all possible values
  type AccommodationType = 'none' | 'single' | 'double' | 'triple' | 'shared';
  
  // Remove customer_type from newPricing state, keep only base_price and accommodation_type
  const [newPricing, setNewPricing] = useState({
    base_price: basePriceFromForm || 0,
    accommodation_type: (isMultiDayTour ? 'single' : 'none') as AccommodationType
  });

  // basePriceFromForm değişirse yeni pricing fiyatını güncelle
  useEffect(() => {
    setNewPricing(prev => ({
      ...prev,
      base_price: basePriceFromForm ? basePriceFromForm : prev.base_price
    }));
  }, [basePriceFromForm]);

  // İlk olarak pricing boşsa ve basePriceFromForm varsa, default pricing'i ekle (set as 'adult' for database compatibility)
  useEffect(() => {
    if (pricing.length === 0 && basePriceFromForm) {
      const defaultPricing: TourPricing = {
        id: `temp-${Date.now()}`,
        tour_id: tourId || '',
        customer_type: 'adult', // left for DB but not shown in UI
        base_price: basePriceFromForm,
        accommodation_type: 'none'
      };
      setPricing([defaultPricing]);
      onPricingChange([defaultPricing]);
    }
    // eslint-disable-next-line
  }, []);

  // Her pricing güncellendiğinde parent'a bildir
  useEffect(() => {
    onPricingChange(pricing);
    // eslint-disable-next-line
  }, [pricing]);

  // Pricing ekle (always as 'adult' customer_type for compatibility)
  const addPricing = () => {
    if (newPricing.base_price <= 0) {
      toast({
        title: "Fiyat Girilmeli",
        description: "Lütfen pozitif bir fiyat değeri girin.",
        variant: "destructive"
      });
      return;
    }
    // Only check uniqueness by accommodation_type
    const exists = pricing.some(p => 
      p.accommodation_type === newPricing.accommodation_type
    );
    if (exists) {
      toast({
        title: "Zaten Eklenmiş",
        description: "Bu konaklama tipi zaten mevcut.",
        variant: "destructive"
      });
      return;
    }

    const pricingItem: TourPricing = {
      id: `temp-${Date.now()}`,
      tour_id: tourId || '',
      customer_type: 'adult', // for DB, not UI
      base_price: newPricing.base_price,
      accommodation_type: newPricing.accommodation_type
    };

    const updatedPricing = [...pricing, pricingItem];
    setPricing(updatedPricing);

    // For multi-day tours, reset price to 0 when adding a new pricing option
    // For one-day tours, use basePriceFromForm or 0
    setNewPricing({
      base_price: isMultiDayTour ? 0 : (basePriceFromForm || 0),
      accommodation_type: isMultiDayTour ? 'single' : 'none' as AccommodationType
    });

    toast({
      title: "Fiyatlandırma Eklendi",
      description: "Yeni fiyatlandırma seçeneği başarıyla eklendi.",
      variant: "default"
    });
  };

  // Pricing sil
  const removePricing = (index: number) => {
    const removed = pricing[index];
    const updatedPricing = pricing.filter((_, i) => i !== index);
    setPricing(updatedPricing);

    toast({
      title: "Fiyatlandırma Silindi",
      description: `${ACCOMMODATION_TYPES.find(a => a.value === removed.accommodation_type)?.label} silindi.`,
      variant: "default"
    });
  };

  // Pricing güncelle (fiyat/konaklama değişikliğinde bilgilendirme)
  const updatePricing = (index: number, field: keyof TourPricing, value: any) => {
    const updatedPricing = [...pricing];
    updatedPricing[index] = { ...updatedPricing[index], [field]: value };
    setPricing(updatedPricing);

    if (field === "base_price") {
      toast({
        title: "Fiyat Güncellendi",
        description: "Fiyat başarıyla güncellendi.",
        variant: "default"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tour Pricing Configuration</CardTitle>
          <CardDescription>
            Set different prices for flexible accommodation options.
            {basePriceFromForm && (
              <span className="block mt-2 text-sm text-blue-600">
                Base Price from Basic Info: ${basePriceFromForm.toFixed(2)} (will be used as default)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Pricing */}
          <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 items-end md:items-center">
            <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
              {/* Accommodation selector */}
              <div>
                <Label className="mb-1">Accommodation</Label>
                <div className="flex gap-2 flex-wrap">
                  {ACCOMMODATION_TYPES.map(type => {
                    // For multi-day tours: hide "No Accommodation" option
                    // For one-day tours: show only "No Accommodation" option
                    if ((type.value === 'none' && isMultiDayTour) || 
                        (type.value !== 'none' && !isMultiDayTour)) {
                      return null;
                    }
                    
                    return (
                      <button
                        key={type.value}
                        type="button"
                        className={
                          `px-3 py-2 rounded border text-[15px] font-semibold transition-colors
                          ${newPricing.accommodation_type === type.value
                            ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                            : 'bg-white dark:bg-gray-900 border-gray-300 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950'
                          }`
                        }
                        aria-pressed={newPricing.accommodation_type === type.value}
                        onClick={() => {
                          // When changing accommodation type in multi-day tours, reset price to empty
                          if (isMultiDayTour) {
                            setNewPricing({ 
                              base_price: 0, 
                              accommodation_type: type.value as AccommodationType 
                            });
                          } else {
                            setNewPricing({ 
                              ...newPricing, 
                              accommodation_type: type.value as AccommodationType 
                            });
                          }
                        }}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
                {isMultiDayTour && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Multi-day tours require accommodation. Select room types for pricing.
                  </p>
                )}
                {!isMultiDayTour && (
                  <p className="text-xs text-muted-foreground mt-1">
                    One-day tours typically don't require accommodation.
                  </p>
                )}
              </div>
              {/* Price Input */}
              <div className="flex flex-col relative md:ml-auto w-full md:w-[120px]">
                <Label className="mb-1">Price (₺)</Label>
                <div className="relative flex items-center">
                  <Coins className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600" size={17} />
                  <Input
                    type="number"
                    step="0.01"
                    value={newPricing.base_price}
                    onChange={(e) => setNewPricing({ ...newPricing, base_price: parseFloat(e.target.value) || 0 })}
                    placeholder={isMultiDayTour ? "Enter price" : "₺0.00"}
                    className={`pl-8 font-bold text-base transition-colors py-2 text-right w-full ${
                      isMultiDayTour 
                        ? 'border-yellow-200 focus:border-yellow-400 animate-pulse' 
                        : 'border-blue-200 focus:border-blue-400'
                    } dark:bg-gray-950 dark:border-blue-950 dark:focus:border-blue-500`}
                    min={0}
                    style={{ maxWidth: '120px' }}
                    inputMode="decimal"
                  />
                </div>
                {isMultiDayTour && (
                  <p className="text-xs text-amber-600 mt-1 w-[120px]">
                    Enter room price
                  </p>
                )}
              </div>
            </div>
            {/* Add Pricing Button */}
            <div className="w-full md:w-auto md:ml-2">
              <Button
                onClick={addPricing}
                className="w-full text-base py-2 flex items-center justify-center gap-1"
                type="button"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Pricing
              </Button>
            </div>
          </div>
          {/* Existing Pricing List */}
          <div className="space-y-4">
            {pricing.length > 0 ? (
              pricing.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-900 items-center"
                >
                  {/* Accommodation selector */}
                  <div className="flex flex-col justify-between w-full md:w-auto">
                    <Label className="mb-1">Accommodation</Label>
                    <div className="flex gap-2 flex-wrap">
                      {ACCOMMODATION_TYPES.map(type => (
                        // For multi-day tours, hide "No Accommodation" option
                        (type.value === 'none' && isMultiDayTour) ? null : (
                          <button
                            key={type.value}
                            type="button"
                            className={
                              `px-3 py-2 rounded border text-[15px] font-semibold transition-colors
                              ${item.accommodation_type === type.value
                                ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                                : 'bg-white dark:bg-gray-900 border-gray-300 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950'
                              }`
                            }
                            aria-pressed={item.accommodation_type === type.value}
                            onClick={() =>
                              updatePricing(
                                index,
                                'accommodation_type',
                                type.value as typeof item.accommodation_type
                              )
                            }
                          >
                            {type.label}
                          </button>
                        )
                      ))}
                    </div>
                    {isMultiDayTour && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Multi-day tours require accommodation.
                      </p>
                    )}
                  </div>
                  {/* Price input aligned right and close to Remove */}
                  <div className="flex flex-col md:flex-row md:items-center w-full md:justify-end gap-2 md:gap-4 mt-2 md:mt-0">
                    <div className="flex flex-col relative w-full md:w-[90px] md:ml-auto">
                      <Label className="mb-1 md:sr-only">Price ($)</Label>
                      <div className="relative flex items-center">
                        <Coins className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600" size={17} />
                        <Input
                          type="number"
                          step="0.01"
                          value={item.base_price}
                          onChange={(e) => updatePricing(index, 'base_price', parseFloat(e.target.value) || 0)}
                          className="pl-8 font-bold text-base border-blue-200 focus:border-blue-400 dark:bg-gray-950 dark:border-blue-950 dark:focus:border-blue-500 transition-colors py-2 text-right w-full"
                          min={0}
                          style={{ maxWidth: '90px' }}
                          inputMode="decimal"
                        />
                      </div>
                    </div>
                    <div className="md:ml-1 w-full md:w-auto">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removePricing(index)}
                        className="w-full flex gap-1 items-center"
                        type="button"
                      >
                        <Trash2 className="h-5 w-5 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No pricing configuration yet.</p>
                <p className="text-sm">Add pricing options above to get started.</p>
              </div>
            )}
          </div>
          {/* Pricing Summary */}
          {pricing.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ACCOMMODATION_TYPES.map(type => {
                    const typePricing = pricing.filter(p => p.accommodation_type === type.value);
                    if (typePricing.length === 0) return null;
                    return (
                      <div key={type.value} className="space-y-2">
                        <h4 className="font-medium">{type.label}</h4>
                        {typePricing.map((item, i) => (
                          <div key={item.id} className="text-lg font-semibold">
                            ${item.base_price.toFixed(2)}
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
