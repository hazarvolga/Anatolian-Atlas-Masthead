
import { useFetchAdminTours } from "./useFetchAdminTours";
import { useCreateTour } from "./useCreateTour";
import { useUpdateTour } from "./useUpdateTour";
import { useDeleteTour } from "./useDeleteTour";
import { useToggleTourStatus } from "./useToggleTourStatus";

// Export the focused hooks for use in components
export { useFetchAdminTours as useAdminTours };
export { useCreateTour };
export { useUpdateTour };
export { useDeleteTour };
export { useToggleTourStatus };

// Re-export the types for backward compatibility
export type { CreateTourData } from "./useCreateTour";
