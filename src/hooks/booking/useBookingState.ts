
import { useState, useEffect } from "react";

interface Customer {
  type: 'adult' | 'child' | 'baby';
  count: number;
  accommodationType?: 'single' | 'double' | 'shared' | 'none';
}

export const useBookingState = (preselectedTourId?: string) => {
  const [selectedTourId, setSelectedTourId] = useState(preselectedTourId || "");
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([
    { type: 'adult', count: 1, accommodationType: 'double' }
  ]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [addOns, setAddOns] = useState<string[]>([]);

  // Improved synchronization between adults/children and customers
  useEffect(() => {
    console.log('useBookingState - Syncing customers with adults/children:', { adults, children });
    
    const newCustomers: Customer[] = [];
    
    // Always ensure at least 1 adult
    const finalAdults = Math.max(1, adults);
    if (finalAdults !== adults) {
      setAdults(finalAdults);
    }
    
    // Add adults to customers array
    if (finalAdults > 0) {
      const existingAdultAccommodation = customers.find(c => c.type === 'adult')?.accommodationType || 'double';
      newCustomers.push({
        type: 'adult',
        count: finalAdults,
        accommodationType: existingAdultAccommodation
      });
    }
    
    // Add children to customers array if any
    if (children > 0) {
      const existingChildAccommodation = customers.find(c => c.type === 'child')?.accommodationType || 'double';
      newCustomers.push({
        type: 'child',
        count: children,
        accommodationType: existingChildAccommodation
      });
    }
    
    // Only update if actually different to prevent infinite loops
    const customersChanged = JSON.stringify(newCustomers) !== JSON.stringify(customers);
    if (customersChanged) {
      console.log('useBookingState - Updating customers:', newCustomers);
      setCustomers(newCustomers);
    }
  }, [adults, children]); // Removed customers from dependencies to prevent infinite loop

  console.log('useBookingState - Current state:', {
    selectedTourId,
    checkInDate: !!checkInDate,
    checkOutDate: !!checkOutDate,
    adults,
    children,
    customersCount: customers.length,
    customersDetail: customers.map(c => ({ type: c.type, count: c.count, accommodation: c.accommodationType })),
    rooms: rooms.length,
    addOns: addOns.length
  });

  return {
    selectedTourId,
    setSelectedTourId,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    adults,
    setAdults,
    children,
    setChildren,
    customers,
    setCustomers,
    rooms,
    setRooms,
    addOns,
    setAddOns,
  };
};
