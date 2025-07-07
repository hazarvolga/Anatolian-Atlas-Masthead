export interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  price_child?: number;
  price_single?: number;
  price_double?: number;
  price_triple?: number;
  addon_price?: number;
  group_discount_percentage?: number;
  tour_type: 'one_day' | 'multiple_day' | 'date_range';
  duration?: number;
  departure_time?: string;
  departure_location?: string;
  itinerary?: string[];
  benefits: string[];
  images: string[];
  requires_accommodation: boolean;
  is_active: boolean;
  destination_id: string;
  created_at: string;
  updated_at: string;
  booking_deadline_days: number;
  cancellation_policy: string;
  deposit?: number;
  destinations?: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
}
