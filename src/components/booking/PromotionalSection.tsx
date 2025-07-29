
import PromotionalCodeInput from "./PromotionalCodeInput";

interface PromotionalSectionProps {
  selectedTourId: string;
  appliedCode?: string;
  onCodeApply: (code: string | null, discount: number) => void;
  bookingTotal: number;
}

export default function PromotionalSection({
  selectedTourId,
  appliedCode,
  onCodeApply,
  bookingTotal
}: PromotionalSectionProps) {
  if (!selectedTourId) return null;

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <PromotionalCodeInput
        tourId={selectedTourId}
        appliedCode={appliedCode}
        onCodeApply={onCodeApply}
        bookingTotal={bookingTotal}
      />
    </div>
  );
}
