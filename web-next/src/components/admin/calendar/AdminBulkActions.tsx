"use client";


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Save } from 'lucide-react';
import { format } from 'date-fns';

interface AdminBulkActionsProps {
  selectedDates: Date[];
  selectedTour: string;
  onClearSelection: () => void;
  onBulkUpdate: any;
}

export default function AdminBulkActions({
  selectedDates,
  selectedTour,
  onClearSelection,
  onBulkUpdate
}: AdminBulkActionsProps) {
  const [availableSpots, setAvailableSpots] = useState<number>(12);
  const [isAvailable, setIsAvailable] = useState(true);
  const [priceOverride, setPriceOverride] = useState<string>('');

  const handleBulkUpdate = () => {
    const updates: any = {
      available_spots: availableSpots,
      is_available: isAvailable,
    };

    if (priceOverride && !isNaN(Number(priceOverride))) {
      updates.price_override = Number(priceOverride);
    }

    onBulkUpdate.mutate({ dates: selectedDates, updates });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <span>Bulk Actions</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Dates */}
        <div>
          <Label className="text-xs">Selected Dates ({selectedDates.length})</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedDates.slice(0, 3).map((date, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {format(date, 'MMM d')}
              </Badge>
            ))}
            {selectedDates.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{selectedDates.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {selectedTour === 'all' && (
          <div className="text-xs text-red-600">
            Please select a specific tour to perform bulk operations
          </div>
        )}

        {selectedTour !== 'all' && (
          <>
            {/* Available Spots */}
            <div>
              <Label htmlFor="availableSpots" className="text-xs">Available Spots</Label>
              <Input
                id="availableSpots"
                type="number"
                value={availableSpots}
                onChange={(e) => setAvailableSpots(Number(e.target.value))}
                min={0}
                className="text-xs"
              />
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <Label htmlFor="isAvailable" className="text-xs">Available for booking</Label>
            </div>

            {/* Price Override */}
            <div>
              <Label htmlFor="priceOverride" className="text-xs">Price Override (₺)</Label>
              <Input
                id="priceOverride"
                type="number"
                value={priceOverride}
                onChange={(e) => setPriceOverride(e.target.value)}
                placeholder="Leave empty for default price"
                className="text-xs"
              />
            </div>

            {/* Apply Button */}
            <Button
              onClick={handleBulkUpdate}
              disabled={onBulkUpdate.isPending}
              className="w-full"
              size="sm"
            >
              {onBulkUpdate.isPending ? (
                'Updating...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Apply to {selectedDates.length} dates
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
