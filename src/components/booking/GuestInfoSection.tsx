
import GuestInformation from "./GuestInformation";

interface GuestInfoSectionProps {
  customers: any[];
  control: any;
}

export default function GuestInfoSection({ customers, control }: GuestInfoSectionProps) {
  if (customers.length === 0) return null;

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <h3 className="text-xl font-semibold mb-4">Guest Information</h3>
      <GuestInformation control={control} />
    </div>
  );
}
