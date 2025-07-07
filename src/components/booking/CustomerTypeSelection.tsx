
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import CustomerCounter from "./customer-selection/CustomerCounter";
import AccommodationSelector from "./customer-selection/AccommodationSelector";
import CustomerInfoPanel from "./customer-selection/CustomerInfoPanel";

interface Customer {
  type: 'adult' | 'child' | 'baby';
  count: number;
  accommodationType?: 'single' | 'double' | 'shared' | 'none';
}

interface CustomerTypeSelectionProps {
  selectedTour: any;
  customers: Customer[];
  onCustomersChange: (customers: Customer[]) => void;
  showAccommodationSelection?: boolean;
}

export default function CustomerTypeSelection({
  selectedTour,
  customers,
  onCustomersChange,
  showAccommodationSelection = true
}: CustomerTypeSelectionProps) {
  // Enhanced logic to determine if accommodation should be shown
  const shouldShowAccommodation = (() => {
    if (!showAccommodationSelection || !selectedTour) return false;
    
    // Check multiple conditions for accommodation requirement
    const isMultiDay = selectedTour.tour_type === 'multiple_day' || selectedTour.tour_type === 'date_range';
    const requiresAccommodation = selectedTour.requires_accommodation === true;
    const isLongDuration = selectedTour.duration && parseInt(selectedTour.duration) > 6; // Tours longer than 6 hours
    const isDurationBased = selectedTour.duration && parseInt(selectedTour.duration) > 1; // Multi-day based on duration
    
    console.log('CustomerTypeSelection - Accommodation logic check:', {
      tourName: selectedTour.name,
      tourType: selectedTour.tour_type,
      duration: selectedTour.duration,
      requiresAccommodation,
      isMultiDay,
      isLongDuration,
      isDurationBased,
      willShow: isMultiDay || requiresAccommodation || isLongDuration || isDurationBased
    });
    
    return isMultiDay || requiresAccommodation || isLongDuration || isDurationBased;
  })();

  console.log('CustomerTypeSelection - Debug info:', {
    showAccommodationSelection,
    selectedTour: selectedTour ? {
      name: selectedTour.name,
      id: selectedTour.id,
      tour_type: selectedTour.tour_type,
      duration: selectedTour.duration,
      requires_accommodation: selectedTour.requires_accommodation
    } : null,
    shouldShowAccommodation,
    customersCount: customers.length,
    customers: customers.map(c => ({ type: c.type, count: c.count, accommodation: c.accommodationType }))
  });

  const updateCustomerCount = (type: 'adult' | 'child' | 'baby', count: number) => {
    console.log('CustomerTypeSelection - Updating customer count:', { type, count });
    
    const existingCustomer = customers.find(c => c.type === type);
    const newCustomers = customers.filter(c => c.type !== type);
    
    if (count > 0) {
      newCustomers.push({
        type,
        count,
        accommodationType: existingCustomer?.accommodationType || (shouldShowAccommodation ? 'double' : 'none')
      });
    }
    
    // Ensure at least 1 adult
    if (type === 'adult' && count === 0 && !newCustomers.some(c => c.type === 'adult')) {
      newCustomers.push({
        type: 'adult',
        count: 1,
        accommodationType: shouldShowAccommodation ? 'double' : 'none'
      });
    }
    
    console.log('CustomerTypeSelection - New customers after count update:', newCustomers);
    onCustomersChange(newCustomers);
  };

  const updateAccommodationType = (type: 'adult' | 'child' | 'baby', accommodationType: string) => {
    const newCustomers = customers.map(c => 
      c.type === type 
        ? { ...c, accommodationType: accommodationType as 'single' | 'double' | 'shared' | 'none' }
        : c
    );
    
    console.log('CustomerTypeSelection - Updated accommodation for', type, ':', accommodationType);
    console.log('CustomerTypeSelection - New customers array:', newCustomers);
    onCustomersChange(newCustomers);
  };

  const getCustomerCount = (type: 'adult' | 'child' | 'baby') => {
    return customers.find(c => c.type === type)?.count || (type === 'adult' ? 1 : 0);
  };

  const getAccommodationType = (type: 'adult' | 'child' | 'baby') => {
    return customers.find(c => c.type === type)?.accommodationType || (shouldShowAccommodation ? 'double' : 'none');
  };

  const customerTypes = [
    { 
      type: 'adult' as const, 
      label: 'Adults', 
      description: 'Age 12+', 
      minCount: 1,
      icon: '👨‍👩‍👧‍👦',
      note: 'At least one adult required'
    },
    { 
      type: 'child' as const, 
      label: 'Children', 
      description: 'Age 2-11', 
      minCount: 0,
      icon: '👧',
      note: 'Reduced pricing available'
    },
    { 
      type: 'baby' as const, 
      label: 'Babies', 
      description: 'Under 2', 
      minCount: 0,
      icon: '👶',
      note: 'Special care included'
    }
  ];

  const totalTravelers = customers.reduce((sum, c) => sum + c.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Travelers
          </div>
          <Badge variant="outline">
            {totalTravelers} {totalTravelers === 1 ? 'traveler' : 'travelers'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CustomerInfoPanel 
          shouldShowAccommodation={shouldShowAccommodation}
          totalTravelers={totalTravelers}
        />

        {customerTypes.map(({ type, label, description, minCount, icon, note }) => {
          const count = getCustomerCount(type);
          const accommodationType = getAccommodationType(type);
          
          console.log(`CustomerTypeSelection - Rendering ${type}:`, {
            count,
            accommodationType,
            shouldShowAccommodation,
            willShowAccommodationSelector: count > 0 && shouldShowAccommodation
          });
          
          return (
            <div key={type} className="space-y-3">
              <CustomerCounter
                type={type}
                label={label}
                description={description}
                icon={icon}
                note={note}
                count={count}
                minCount={minCount}
                onCountChange={(newCount) => updateCustomerCount(type, newCount)}
              />
              
              {/* Show accommodation options when count > 0 and accommodation is required */}
              {count > 0 && shouldShowAccommodation && (
                <AccommodationSelector
                  customerType={type}
                  count={count}
                  label={label}
                  accommodationType={accommodationType}
                  onAccommodationChange={(accommodationType) => updateAccommodationType(type, accommodationType)}
                />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
