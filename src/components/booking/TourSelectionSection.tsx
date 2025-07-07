
import TourSelection from "./TourSelection";

interface TourSelectionSectionProps {
  control: any;
  tours: any[];
  toursLoading: boolean;
  onTourChange: (tourId: string) => void;
  preselectedTourId?: string;
}

export default function TourSelectionSection({
  control,
  tours,
  toursLoading,
  onTourChange,
  preselectedTourId
}: TourSelectionSectionProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <h3 className="text-xl font-semibold mb-4">Select Your Tour</h3>
      <TourSelection
        control={control}
        tours={tours}
        toursLoading={toursLoading}
        onTourChange={onTourChange}
        preselectedTourId={preselectedTourId}
      />
    </div>
  );
}
