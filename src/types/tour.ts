
export interface TourProps {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  max_group_size: number;
  image_url: string;
  location: string;
  highlights: string[];
  rating: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  tour_type?: 'multiple_day' | 'one_day' | 'date_range';
  start_date?: string;
  end_date?: string;
  benefits?: string[];
  itinerary?: Array<{ day: number; title: string; description: string; }>;
  destinations?: {
    id: string;
    name: string;
    city?: string;
    country?: string;
  };
  deposit?: number; // Added deposit field
}

export interface TourPricing {
  id: string;
  tour_id: string;
  customer_type: 'adult' | 'child' | 'baby';
  base_price: number;
  accommodation_type?: 'single' | 'double' | 'triple' | 'shared' | 'none';
}

export interface TourTimeSlot {
  id: string;
  tour_id: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
}

export interface SeasonalPricing {
  id: string;
  tour_id: string;
  customer_type: 'adult' | 'child' | 'baby';
  start_date: string;
  end_date: string;
  price_adjustment: number;
  adjustment_type: 'percentage' | 'fixed';
}

export interface GroupSizeDiscount {
  id: string;
  tour_id: string;
  customer_type: 'adult' | 'child' | 'baby';
  min_group_size: number;
  max_group_size?: number;
  discount_type: 'percentage' | 'fixed';
  discount_percentage: number;
  discount_amount: number;
  discount_reason: 'early_bird' | 'family' | 'student' | 'group_size' | 'seasonal' | 'loyalty' | 'last_minute';
}
