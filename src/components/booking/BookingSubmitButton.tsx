
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface BookingSubmitButtonProps {
  isPending: boolean;
  hasAvailability: boolean;
  pricingLoading: boolean;
  customers: any[];
  finalTotal: number;
}

export default function BookingSubmitButton({
  isPending,
  hasAvailability,
  pricingLoading,
  customers,
  finalTotal
}: BookingSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full py-6 text-lg"
      disabled={isPending || !hasAvailability || pricingLoading || customers.length === 0}
    >
      <CreditCard className="h-5 w-5 mr-2" />
      {isPending
        ? "Creating Payment..."
        : customers.length > 0 && finalTotal > 0
          ? `Pay Now - $${finalTotal.toFixed(2)}`
          : "Complete Selection to Continue"}
    </Button>
  );
}
