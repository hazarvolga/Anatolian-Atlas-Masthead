
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Receipt, Users, Calendar, AlertCircle, CheckCircle, DollarSign } from "lucide-react";

interface Customer {
  type: 'adult' | 'child' | 'baby';
  count: number;
  accommodationType?: 'single' | 'double' | 'shared' | 'none';
}

interface PricingBreakdown {
  customer: Customer;
  basePrice: number;
  accommodationPrice: number;
  seasonalAdjustment: number;
  groupDiscount: number;
  totalPrice: number;
  discountReason?: string;
}

interface EnhancedBookingSummaryProps {
  selectedTour: any;
  selectedDate: Date;
  customers: Customer[];
  pricingBreakdown: PricingBreakdown[];
  totalPrice: number;
  hasAvailability: boolean;
  dateAvailability: any;
}

export default function EnhancedBookingSummary({
  selectedTour,
  selectedDate,
  customers,
  pricingBreakdown,
  totalPrice,
  hasAvailability,
  dateAvailability,
}: EnhancedBookingSummaryProps) {
  if (!selectedTour || !selectedDate || customers.length === 0) {
    console.log('EnhancedBookingSummary: Missing required data');
    return null;
  }

  console.log('EnhancedBookingSummary render:', {
    selectedTour: selectedTour.name,
    selectedDate,
    customers,
    pricingBreakdown,
    totalPrice
  });

  const totalCustomers = customers.reduce((sum, c) => sum + c.count, 0);
  const totalDiscount = pricingBreakdown.reduce((sum, breakdown) => sum + breakdown.groupDiscount, 0);
  const totalSeasonalAdjustment = pricingBreakdown.reduce((sum, breakdown) => sum + breakdown.seasonalAdjustment, 0);
  const totalBasePrice = pricingBreakdown.reduce((sum, breakdown) => sum + breakdown.basePrice, 0);

  const getCustomerTypeLabel = (type: string) => {
    switch (type) {
      case 'adult': return 'Adults';
      case 'child': return 'Children';
      case 'baby': return 'Babies';
      default: return type;
    }
  };

  const getAccommodationLabel = (type?: string) => {
    switch (type) {
      case 'single': return 'Single Room';
      case 'double': return 'Double Room';
      case 'shared': return 'Shared Room';
      case 'none': return 'No Accommodation';
      default: return 'No Accommodation';
    }
  };

  const getDiscountReasonLabel = (reason?: string) => {
    switch (reason) {
      case 'early_bird': return 'Early Bird Discount';
      case 'family': return 'Family Discount';
      case 'student': return 'Student Discount';
      case 'group_size': return 'Group Size Discount';
      case 'seasonal': return 'Seasonal Discount';
      case 'loyalty': return 'Loyalty Discount';
      case 'last_minute': return 'Last Minute Discount';
      default: return 'Discount';
    }
  };

  if (pricingBreakdown.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Pricing not available</p>
          <p className="text-sm text-muted-foreground">
            Unable to calculate pricing for your selection. Please try different options or contact support.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tour Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <strong>Tour:</strong> {selectedTour.name}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <strong>Date:</strong> {format(selectedDate, "PPP")}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <strong>Travelers:</strong> {totalCustomers} total
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Price Breakdown
          </h4>
          
          {pricingBreakdown.map((breakdown, index) => (
            <div key={index} className="space-y-1 p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {breakdown.customer.count}x {getCustomerTypeLabel(breakdown.customer.type)}
                </span>
                <span className="font-semibold">${breakdown.basePrice.toFixed(2)}</span>
              </div>
              
              {breakdown.customer.accommodationType && breakdown.customer.accommodationType !== 'none' && (
                <div className="text-sm text-muted-foreground ml-4">
                  Accommodation: {getAccommodationLabel(breakdown.customer.accommodationType)}
                </div>
              )}
              
              {breakdown.seasonalAdjustment !== 0 && (
                <div className="flex justify-between text-sm ml-4">
                  <span className={breakdown.seasonalAdjustment > 0 ? "text-red-600" : "text-green-600"}>
                    Seasonal {breakdown.seasonalAdjustment > 0 ? 'Surcharge' : 'Discount'}:
                  </span>
                  <span className={breakdown.seasonalAdjustment > 0 ? "text-red-600" : "text-green-600"}>
                    {breakdown.seasonalAdjustment > 0 ? '+' : ''}${breakdown.seasonalAdjustment.toFixed(2)}
                  </span>
                </div>
              )}
              
              {breakdown.groupDiscount > 0 && (
                <div className="flex justify-between text-sm ml-4 text-green-600">
                  <span>{getDiscountReasonLabel(breakdown.discountReason)}:</span>
                  <span>-${breakdown.groupDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-medium pt-1 border-t">
                <span>Subtotal:</span>
                <span>${breakdown.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Totals */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base Total:</span>
            <span>${totalBasePrice.toFixed(2)}</span>
          </div>
          
          {totalSeasonalAdjustment !== 0 && (
            <div className="flex justify-between text-sm">
              <span>Total Seasonal Adjustment:</span>
              <span className={totalSeasonalAdjustment > 0 ? "text-red-600" : "text-green-600"}>
                {totalSeasonalAdjustment > 0 ? '+' : ''}${totalSeasonalAdjustment.toFixed(2)}
              </span>
            </div>
          )}
          
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Total Discounts:</span>
              <span>-${totalDiscount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total Price:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Availability Status */}
        <div className="border-t pt-4">
          {dateAvailability && (
            <div className={cn(
              "flex items-center gap-2 text-sm p-2 rounded-lg",
              hasAvailability 
                ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950" 
                : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950"
            )}>
              {hasAvailability ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Available - {dateAvailability.available_spots} spots remaining</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <span>Not enough spots available ({dateAvailability.available_spots} remaining)</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
