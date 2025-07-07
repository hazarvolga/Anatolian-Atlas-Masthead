
import { toast } from "@/hooks/use-toast";

export const convertToActualTourId = (id: string, tours: any[]): string => {
  if (!id || tours.length === 0) return id;
  
  // If it's already a UUID, return as is
  if (!/^\d+$/.test(id)) return id;
  
  // If it's numeric, try to find the corresponding tour
  const numericIndex = parseInt(id) - 1; // Assuming 1-based indexing
  if (numericIndex >= 0 && numericIndex < tours.length) {
    const actualId = tours[numericIndex].id;
    console.log('Converting numeric ID to UUID:', id, '->', actualId);
    return actualId;
  }
  
  return id;
};

export const validateAndSetTour = (
  preselectedTourId: string, 
  tours: any[], 
  setValue: (field: string, value: string) => void,
  setSelectedTourId: (id: string) => void,
  setCustomers: (customers: any[]) => void,
  customers: any[]
) => {
  console.log('Processing preselectedTourId:', preselectedTourId);
  console.log('Available tours:', tours.map(t => ({ id: t.id, name: t.name })));
  
  const actualTourId = convertToActualTourId(preselectedTourId, tours);
  
  // Verify the tour exists
  const tour = tours.find(t => t.id === actualTourId);
  
  if (tour) {
    console.log('Setting tour:', actualTourId);
    setValue("tourId", actualTourId);
    setSelectedTourId(actualTourId);
    console.log('Tour set successfully');
    
    // Set default accommodation type based on tour type
    const isMultiDay = tour.tour_type === 'multiple_day';
    const defaultAccommodation: 'single' | 'double' | 'shared' | 'none' = isMultiDay ? 'double' : 'none';
    
    const updatedCustomers = customers.map(customer => ({
      ...customer,
      accommodationType: defaultAccommodation
    }));
    setCustomers(updatedCustomers);
  } else {
    console.log('Tour not found with ID:', actualTourId);
    
    // Force a toast notification about the issue
    toast({
      title: "Tour Loading Issue",
      description: `Tour with ID ${preselectedTourId} not found. Please check the URL or contact support.`,
      variant: "destructive",
    });
  }
};
