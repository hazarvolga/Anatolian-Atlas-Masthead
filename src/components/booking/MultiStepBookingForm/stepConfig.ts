
import { useMemo } from "react";

export const useStepConfiguration = (isMultiDayTour: boolean) => {
  const formSteps = useMemo(() => {
    if (isMultiDayTour) {
      return [
        { id: 1, key: "accommodation", title: "Travelers", description: "Select your option(s)" },
        { id: 2, key: "dates", title: "Choose Dates", description: "Pick your travel dates" },
        { id: 3, key: "details", title: "Your Details", description: "Contact information" },
        { id: 4, key: "review", title: "Review", description: "Confirm & pay" },
      ];
    }
    // default: single/günlük tur
    return [
      { id: 1, key: "travelers", title: "Travelers", description: "How many guests?" },
      { id: 2, key: "dates", title: "Choose Dates", description: "Pick your travel dates" },
      { id: 3, key: "details", title: "Your Details", description: "Contact information" },
      { id: 4, key: "review", title: "Review", description: "Confirm & pay" },
    ];
  }, [isMultiDayTour]);

  return { formSteps };
};
