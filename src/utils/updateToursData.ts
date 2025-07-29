
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// New tour data to replace existing tours
const newTourData = [
  {
    name: "1 Day / Ephesus Tour from Kuşadası / Selçuk",
    price: 110,
    duration: 8,
    tour_type: "one_day" as const,
    difficulty: "easy" as const,
    image_url: "https://images.unsplash.com/photo-1539650116574-75c0c6d1d0b8?auto=format&fit=crop&w=800&q=80",
    description: "Discover the ancient city of Ephesus, one of the best-preserved Roman ruins in the world. Walk through history on the marble streets where Mark Antony and Cleopatra once strolled.",
    highlights: [
      "Library of Celsus",
      "Great Theatre of Ephesus",
      "Temple of Artemis (one of the Seven Wonders)",
      "House of Virgin Mary",
      "Terrace Houses",
      "Marble Street"
    ],
    included: [
      "Professional licensed guide",
      "Air-conditioned transportation",
      "Entrance fees to all sites",
      "Hotel pickup and drop-off"
    ],
    excluded: [
      "Lunch",
      "Personal expenses",
      "Tips for guide and driver"
    ],
    location: "Kuşadası / Selçuk",
    benefits: ["Small Group", "Expert Guide", "Skip the Line"]
  },
  {
    name: "6-Days / Best of Türkiye",
    price: 1200,
    duration: 6,
    tour_type: "multiple_day" as const,
    difficulty: "moderate" as const,
    image_url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
    description: "Experience the best of Turkey in 6 amazing days. Visit Istanbul, Cappadocia, Pamukkale, and Ephesus in this comprehensive tour that showcases Turkey's rich history and natural wonders.",
    highlights: [
      "Blue Mosque & Hagia Sophia in Istanbul",
      "Hot Air Balloon flight in Cappadocia",
      "Pamukkale Cotton Castle and thermal pools",
      "Ancient city of Ephesus",
      "Bosphorus Cruise",
      "Underground cities of Cappadocia"
    ],
    included: [
      "5 nights accommodation",
      "Daily breakfast",
      "Professional English-speaking guide",
      "All transportation",
      "Domestic flights",
      "Entrance fees to all attractions"
    ],
    excluded: [
      "International flights",
      "Lunches and dinners",
      "Personal expenses",
      "Travel insurance"
    ],
    location: "Istanbul, Cappadocia, Pamukkale, Ephesus",
    benefits: ["Most Popular", "Best Value", "Complete Experience"],
    itinerary: [
      { day: 1, title: "Istanbul Arrival", description: "Arrive in Istanbul, check-in to hotel, evening Bosphorus cruise" },
      { day: 2, title: "Istanbul City Tour", description: "Visit Blue Mosque, Hagia Sophia, Topkapi Palace, Grand Bazaar" },
      { day: 3, title: "Cappadocia", description: "Fly to Cappadocia, explore Göreme Open Air Museum, sunset at Love Valley" },
      { day: 4, title: "Cappadocia Full Day", description: "Hot air balloon ride, underground city tour, pottery workshop" },
      { day: 5, title: "Pamukkale", description: "Travel to Pamukkale, explore Cotton Castle and Hierapolis" },
      { day: 6, title: "Ephesus & Departure", description: "Visit Ephesus ancient city, House of Virgin Mary, departure" }
    ]
  },
  {
    name: "4-Days / Cappadocia, Pamukkale, Ephesus",
    price: 980,
    duration: 4,
    tour_type: "multiple_day" as const,
    difficulty: "moderate" as const,
    image_url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80",
    description: "Explore three of Turkey's most iconic destinations: the fairy chimneys of Cappadocia, the white terraces of Pamukkale, and the ancient ruins of Ephesus in 4 unforgettable days.",
    highlights: [
      "Hot Air Balloon flight over Cappadocia",
      "Underground cities exploration",
      "Pamukkale Cotton Castle",
      "Hierapolis ancient city",
      "Ephesus Library of Celsus",
      "Traditional pottery workshop"
    ],
    included: [
      "3 nights accommodation",
      "Daily breakfast",
      "Professional guide",
      "All transportation",
      "Entrance fees"
    ],
    excluded: [
      "Lunches and dinners",
      "Hot air balloon (optional extra)",
      "Personal expenses"
    ],
    location: "Cappadocia, Pamukkale, Ephesus",
    benefits: ["Great Combination", "Value for Money", "Diverse Experiences"],
    itinerary: [
      { day: 1, title: "Cappadocia Arrival", description: "Arrive in Cappadocia, check-in, sunset tour" },
      { day: 2, title: "Cappadocia Full Day", description: "Optional balloon ride, underground city, Göreme Open Air Museum" },
      { day: 3, title: "Pamukkale", description: "Travel to Pamukkale, explore Cotton Castle and thermal pools" },
      { day: 4, title: "Ephesus & Departure", description: "Visit Ephesus ancient city, House of Virgin Mary" }
    ]
  },
  {
    name: "3-Days / Best of Cappadocia",
    price: 710,
    duration: 3,
    tour_type: "multiple_day" as const,
    difficulty: "easy" as const,
    image_url: "https://images.unsplash.com/photo-1518602164578-cd0074062767?auto=format&fit=crop&w=800&q=80",
    description: "Immerse yourself in the magical landscape of Cappadocia with fairy chimneys, underground cities, and unforgettable hot air balloon experiences over 3 perfect days.",
    highlights: [
      "Hot Air Balloon at sunrise",
      "Göreme Open Air Museum",
      "Underground City exploration",
      "Pottery workshop in Avanos",
      "Sunset at Love Valley",
      "Fairy chimney formations"
    ],
    included: [
      "2 nights cave hotel accommodation",
      "Daily breakfast",
      "Professional guide",
      "All transportation",
      "Entrance fees"
    ],
    excluded: [
      "Hot air balloon (optional extra)",
      "Lunches and dinners",
      "Personal expenses"
    ],
    location: "Cappadocia",
    benefits: ["Perfect Duration", "Cave Hotel", "Magical Experience"],
    itinerary: [
      { day: 1, title: "Arrival & Red Tour", description: "Arrive in Cappadocia, Red Tour including Göreme, Avanos, Pasabag" },
      { day: 2, title: "Green Tour", description: "Underground city, Ihlara Valley hiking, monastery visits" },
      { day: 3, title: "Balloon & Departure", description: "Optional hot air balloon ride, souvenir shopping, departure" }
    ]
  },
  {
    name: "Pamukkale Tour from Kuşadası / Selçuk",
    price: 110,
    duration: 2,
    tour_type: "multiple_day" as const,
    difficulty: "easy" as const,
    image_url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
    description: "Visit the stunning white terraces of Pamukkale and the ancient city of Hierapolis. Experience the natural thermal pools and historical ruins in this amazing 2-day trip with accommodation.",
    highlights: [
      "Cotton Castle white terraces",
      "Thermal pool swimming",
      "Hierapolis ancient theatre",
      "Necropolis walking tour",
      "Calcium travertine formations",
      "Sacred Pool (Cleopatra's Pool)"
    ],
    included: [
      "1 night accommodation",
      "Professional guide", 
      "Air-conditioned bus",
      "Entrance fees",
      "Hotel pickup and drop-off",
      "Breakfast"
    ],
    excluded: [
      "Lunch and dinner",
      "Thermal pool entrance (optional)",
      "Personal expenses"
    ],
    location: "Pamukkale",
    benefits: ["Natural Wonder", "Relaxing", "Photo Perfect"],
    itinerary: [
      { day: 1, title: "Pamukkale Arrival", description: "Arrive in Pamukkale, check-in to hotel, explore Cotton Castle white terraces and thermal pools" },
      { day: 2, title: "Hierapolis & Departure", description: "Visit Hierapolis ancient city, Sacred Pool (Cleopatra's Pool), and departure" }
    ]
  },
  {
    name: "Bosphorus Dinner Cruise & Turkish Night Show",
    price: 65,
    duration: 6,
    tour_type: "one_day" as const,
    difficulty: "easy" as const,
    image_url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
    description: "Enjoy a magical evening on the Bosphorus with dinner, traditional Turkish entertainment, and stunning views of Istanbul's illuminated skyline and historic landmarks.",
    highlights: [
      "Bosphorus Strait cruise",
      "Traditional Turkish dinner",
      "Folk dance performance",
      "Belly dance show",
      "Istanbul night views",
      "Live Turkish music"
    ],
    included: [
      "Bosphorus cruise",
      "Traditional Turkish dinner",
      "Live entertainment shows",
      "Hotel pickup and drop-off",
      "Welcome drink"
    ],
    excluded: [
      "Additional beverages",
      "Tips for performers",
      "Personal expenses"
    ],
    location: "Istanbul Bosphorus",
    benefits: ["Evening Entertainment", "Cultural Experience", "Romantic Setting"]
  }
];

export const updateExistingTours = async () => {
  console.log('Starting complete tour replacement...');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  try {
    // Call a backend API to delete all existing tours and then create new ones
    console.log('Sending request to backend to replace all tours...');
    const response = await axios.post(`${API_BASE_URL}/api/admin/tours/replace-all`, { newTourData }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });

    if (response.status === 200) {
      console.log('All tours replaced successfully via backend!');
    } else {
      console.error('Backend tour replacement failed with status:', response.status);
      throw new Error(`Backend tour replacement failed: ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Error in updateExistingTours:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to replace tours');
  }
};
