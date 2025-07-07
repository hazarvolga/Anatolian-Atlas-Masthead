
import { Customer } from "@/types/booking";

export const createInitialCustomers = (): Customer[] => [
  { type: 'adult', count: 1, accommodationType: 'none' }
];

export const updateCustomersForMultiDayTour = (customers: Customer[], isMultiDay: boolean): Customer[] => {
  const defaultAccommodation: 'single' | 'double' | 'shared' | 'none' = isMultiDay ? 'double' : 'none';
  
  return customers.map(customer => ({
    ...customer,
    accommodationType: defaultAccommodation
  }));
};

export const calculatePaymentData = (customers: Customer[]) => {
  const adults = customers.find(c => c.type === 'adult')?.count || 0;
  const children = customers.reduce((sum, c) => 
    c.type === 'child' || c.type === 'baby' ? sum + c.count : sum, 0
  );
  
  return { adults, children };
};
