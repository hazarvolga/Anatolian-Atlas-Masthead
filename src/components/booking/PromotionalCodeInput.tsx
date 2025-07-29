
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Check, X, Loader2 } from "lucide-react";
import { usePromotionalCode } from "@/hooks/usePromotionalCodes";

interface PromotionalCodeInputProps {
  tourId: string;
  appliedCode?: string;
  onCodeApply: (code: string | null, discount: number) => void;
  bookingTotal: number;
}

export default function PromotionalCodeInput({
  tourId,
  appliedCode,
  onCodeApply,
  bookingTotal
}: PromotionalCodeInputProps) {
  const [inputCode, setInputCode] = useState(appliedCode || '');
  const [attemptedCode, setAttemptedCode] = useState<string | null>(null);

  const { data: promoData, isLoading, error } = usePromotionalCode(
    attemptedCode || appliedCode, 
    tourId
  );

  const handleApplyCode = () => {
    if (!inputCode.trim()) return;
    setAttemptedCode(inputCode.trim().toUpperCase());
  };

  const handleRemoveCode = () => {
    setInputCode('');
    setAttemptedCode(null);
    onCodeApply(null, 0);
  };

  const calculateDiscount = (promoData: any, total: number) => {
    if (!promoData) return 0;

    let discount = 0;
    if (promoData.discount_type === 'percentage') {
      discount = total * (promoData.discount_value / 100);
    } else {
      discount = promoData.discount_value;
    }

    // Apply max discount limit if set
    if (promoData.max_discount_amount && discount > promoData.max_discount_amount) {
      discount = promoData.max_discount_amount;
    }

    return discount;
  };

  // Check if code is valid and apply discount
  if (promoData && attemptedCode && !appliedCode) {
    const discount = calculateDiscount(promoData, bookingTotal);
    onCodeApply(attemptedCode, discount);
  }

  const isCodeValid = promoData && !error;
  const currentDiscount = promoData ? calculateDiscount(promoData, bookingTotal) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Promotional Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!appliedCode ? (
          <div className="flex gap-2">
            <Input
              placeholder="Enter promotional code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyCode()}
              className="flex-1"
            />
            <Button 
              onClick={handleApplyCode}
              disabled={!inputCode.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="font-medium">{appliedCode}</span>
              <Badge variant="secondary">Applied</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveCode}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Show validation result */}
        {attemptedCode && !isLoading && (
          <div>
            {isCodeValid ? (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Valid promotional code!
                  </span>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  <p>{promoData.description}</p>
                  <p className="font-semibold mt-1">
                    Discount: {promoData.discount_type === 'percentage' 
                      ? `${promoData.discount_value}%` 
                      : `₺${promoData.discount_value}`} 
                    (₺{currentDiscount} off)
                  </p>
                  {promoData.min_booking_amount && bookingTotal < promoData.min_booking_amount && (
                    <p className="text-amber-600 dark:text-amber-400 mt-1">
                      Minimum booking amount: ₺{promoData.min_booking_amount}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Invalid or expired promotional code
                  </span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Please check the code and try again, or contact support if you believe this is an error.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Promotional info */}
        <div className="text-sm text-muted-foreground">
          <p>Have a promotional code? Enter it above to apply discounts to your booking.</p>
        </div>
      </CardContent>
    </Card>
  );
}
