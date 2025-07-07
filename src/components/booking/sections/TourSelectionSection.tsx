
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TourSelection from "../TourSelection";

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
    <Card>
      <CardHeader>
        <CardTitle>1. Select Your Tour</CardTitle>
      </CardHeader>
      <CardContent>
        <TourSelection
          control={control}
          tours={tours}
          toursLoading={toursLoading}
          onTourChange={onTourChange}
          preselectedTourId={preselectedTourId}
        />
      </CardContent>
    </Card>
  );
}
