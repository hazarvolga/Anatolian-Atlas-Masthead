
import { useCreateTour, useUpdateTour } from "./useAdminTours";

export const useTourFormMutations = () => {
  const createTourMutation = useCreateTour();
  const updateTourMutation = useUpdateTour();

  return { 
    createTourMutation, 
    updateTourMutation 
  };
};
