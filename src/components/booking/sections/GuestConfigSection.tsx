
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SmartRoomSelector from "../SmartRoomSelector";
import CustomerTypeSelection from "../CustomerTypeSelection";

interface Customer {
  type: 'adult' | 'child' | 'baby';
  count: number;
  accommodationType?: 'single' | 'double' | 'shared' | 'none';
}

interface GuestConfigSectionProps {
  checkInDate?: Date;
  checkOutDate?: Date;
  adults: number;
  children: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  customers: Customer[];
  onCustomersChange: (customers: Customer[]) => void;
  isMultiDayTour: boolean;
  rooms: any[];
  onRoomConfigChange: (rooms: any[]) => void;
  selectedTour?: any;
}

export default function GuestConfigSection({
  checkInDate,
  checkOutDate,
  adults,
  children,
  onAdultsChange,
  onChildrenChange,
  customers,
  onCustomersChange,
  isMultiDayTour,
  rooms,
  onRoomConfigChange,
  selectedTour
}: GuestConfigSectionProps) {
  if (!checkInDate) return null;

  // Enhanced customers change handler with improved state sync
  const handleCustomersChange = (newCustomers: Customer[]) => {
    console.log('GuestConfigSection - Customers changing from:', customers);
    console.log('GuestConfigSection - Customers changing to:', newCustomers);
    
    // Extract counts from customers array
    const adultCustomer = newCustomers.find(c => c.type === 'adult');
    const childCustomer = newCustomers.find(c => c.type === 'child');
    
    // Ensure at least 1 adult always
    const newAdults = Math.max(1, adultCustomer?.count || 1);
    const newChildren = childCustomer?.count || 0;
    
    console.log('GuestConfigSection - Extracted counts:', { newAdults, newChildren });
    console.log('GuestConfigSection - Current counts:', { adults, children });
    
    // Update parent state only if different to prevent loops
    if (newAdults !== adults) {
      console.log('GuestConfigSection - Updating adults from', adults, 'to', newAdults);
      onAdultsChange(newAdults);
    }
    
    if (newChildren !== children) {
      console.log('GuestConfigSection - Updating children from', children, 'to', newChildren);
      onChildrenChange(newChildren);
    }
    
    // Update customers state
    onCustomersChange(newCustomers);
  };

  // Enhanced tour configuration for accommodation logic
  const tourForAccommodation = selectedTour || {
    tour_type: isMultiDayTour ? 'multiple_day' : 'one_day',
    requires_accommodation: true,
    duration: isMultiDayTour ? 48 : 8,
    name: 'Selected Tour'
  };

  // Determine if this is a real multi-day tour based on multiple factors
  const isRealMultiDayTour = (() => {
    if (!selectedTour) return isMultiDayTour;
    
    const typeIsMultiDay = selectedTour.tour_type === 'multiple_day' || selectedTour.tour_type === 'date_range';
    const durationIsMultiDay = selectedTour.duration && parseInt(selectedTour.duration) > 1;
    const requiresAccommodation = selectedTour.requires_accommodation === true;
    
    console.log('GuestConfigSection - Multi-day determination:', {
      tourName: selectedTour.name,
      typeIsMultiDay,
      durationIsMultiDay,
      requiresAccommodation,
      finalDecision: typeIsMultiDay || durationIsMultiDay || requiresAccommodation
    });
    
    return typeIsMultiDay || durationIsMultiDay || requiresAccommodation;
  })();

  console.log('GuestConfigSection render:', {
    adults,
    children,
    isMultiDayTour,
    isRealMultiDayTour,
    selectedTour: selectedTour?.name,
    tourForAccommodation: {
      tour_type: tourForAccommodation.tour_type,
      requires_accommodation: tourForAccommodation.requires_accommodation,
      duration: tourForAccommodation.duration
    },
    customersLength: customers.length,
    customers: customers.map(c => ({ type: c.type, count: c.count, accommodation: c.accommodationType })),
    shouldShowAccommodation: true
  });

  // For single day tours (or tours that don't really need accommodation), show customer selection only
  if (!isRealMultiDayTour) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>3. Configure Your Stay</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerTypeSelection
            selectedTour={tourForAccommodation}
            customers={customers}
            onCustomersChange={handleCustomersChange}
            showAccommodationSelection={true}
          />
        </CardContent>
      </Card>
    );
  }

  // For real multi-day tours, show both customer selection and room configuration
  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Configure Your Stay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Type Selection with Enhanced Accommodation Logic */}
        <CustomerTypeSelection
          selectedTour={tourForAccommodation}
          customers={customers}
          onCustomersChange={handleCustomersChange}
          showAccommodationSelection={true}
        />

        {checkOutDate && (
          <>
            <Separator />
            {/* Room Configuration for Multi-day Tours */}
            <SmartRoomSelector
              totalAdults={adults}
              totalChildren={children}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onRoomConfigChange={onRoomConfigChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
