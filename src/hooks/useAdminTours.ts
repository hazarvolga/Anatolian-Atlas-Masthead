
import { useFetchAdminTours } from "./useFetchAdminTours";
import { useCreateTour } from "./useCreateTour";
import { useUpdateTour } from "./useUpdateTour";
import { useDeleteTour } from "./useDeleteTour";

// Export the focused hooks for use in components
export { useFetchAdminTours as useAdminTours };
export { useCreateTour };
export { useUpdateTour };
export { useDeleteTour };

// Re-export the types for backward compatibility
export type { CreateTourData } from "./useCreateTour";
