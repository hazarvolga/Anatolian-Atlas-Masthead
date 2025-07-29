
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface PaymentSectionProps {
  pricing: any;
  isLoading: boolean;
  isPending: boolean;
}

export default function PaymentSection({ pricing, isLoading, isPending }: PaymentSectionProps) {
  if (pricing.total <= 0) return null;

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isPending || isLoading}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {isPending ? "Processing..." : `Book Now - $${pricing.total.toFixed(2)}`}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Secure payment • No hidden fees • Instant confirmation
        </p>
      </CardContent>
    </Card>
  );
}
