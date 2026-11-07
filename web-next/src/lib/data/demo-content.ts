import type { Destination } from "@/hooks/useDestinations";

export interface DemoTour {
  id: string;
  title: string;
  name: string;
  description: string;
  destination_id: string;
  destination_name: string;
  city: string;
  country: string;
  location: string;
  price_adult: number;
  price_child: number;
  price: number;
  duration: number;
  duration_hours: number;
  max_participants: number;
  max_group_size: number;
  difficulty: "easy" | "moderate" | "challenging";
  tour_type: "one_day" | "multiple_day" | "date_range";
  image_url: string;
  images: string[];
  includes: string[];
  included: string[];
  excluded: string[];
  highlights: string[];
  benefits: string[];
  departure_location: string;
  departure_time: string;
  return_time: string;
  is_active: boolean;
  destinations: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
}

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  location: string;
  region: string;
  category: "architecture" | "landscapes" | "coastline" | "craft";
}

export const DEMO_DESTINATIONS: Destination[] = [
  {
    id: "dest-istanbul",
    name: "İstanbul & The Bosphorus",
    city: "İstanbul",
    country: "Türkiye",
    coords: "41.0082° N, 28.9784° E",
    best_time: "April – June, September – November",
    activities:
      "Byzantine & Ottoman architecture, Bosphorus ferry crossings, historic neighborhood walks, spice market tastings",
    description:
      "Straddling Europe and Asia across the deep current of the Bosphorus, İstanbul layers fifteen centuries of imperial stone, timber-framed quarters, and neighborhood lokantas.",
    image_url:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=85",
    gallery_images: [
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80",
    ],
    extra_info:
      "Private historian-led walks depart from Sultanahmet and Karaköy piers. Museum Pass Türkiye is included on multi-day itineraries.",
    is_active: true,
    created_at: "2025-01-10T09:00:00.000Z",
    updated_at: "2025-01-10T09:00:00.000Z",
    _count: { tours: 2 },
  },
  {
    id: "dest-cappadocia",
    name: "Cappadocia & Göreme Valleys",
    city: "Nevşehir",
    country: "Türkiye",
    coords: "38.6431° N, 34.8289° E",
    best_time: "April – June, September – October",
    activities:
      "Volcanic valley hikes, rock-cut monastic churches, Avanos pottery workshops, sunrise ballooning",
    description:
      "Wind-carved tuff valleys, subterranean settlements, and eleventh-century frescoed chapels across the high plateau of Central Anatolia.",
    image_url:
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1400&q=85",
    gallery_images: [
      "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1000&q=80",
    ],
    extra_info:
      "High-altitude plateau climate brings cool mornings even in summer; layered walking attire is recommended.",
    is_active: true,
    created_at: "2025-01-10T09:00:00.000Z",
    updated_at: "2025-01-10T09:00:00.000Z",
    _count: { tours: 2 },
  },
  {
    id: "dest-ephesus",
    name: "Ephesus & The Aegean Hinterland",
    city: "İzmir / Selçuk",
    country: "Türkiye",
    coords: "37.9395° N, 27.3417° E",
    best_time: "March – May, September – November",
    activities:
      "Classical archaeology, Terrace Houses conservation visit, olive oil mill tastings in Şirince",
    description:
      "Marble colonnades of the Roman provincial capital, hillside villas with intact mosaics, and fertile Aegean olive groves around Selçuk and Urla.",
    image_url:
      "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1400&q=85",
    gallery_images: [],
    extra_info:
      "Early-morning entry to the Celsus Library and Terrace Houses avoids cruise-ship midday crowds.",
    is_active: true,
    created_at: "2025-01-10T09:00:00.000Z",
    updated_at: "2025-01-10T09:00:00.000Z",
    _count: { tours: 1 },
  },
  {
    id: "dest-lycia",
    name: "Kaş & The Lycian Coast",
    city: "Antalya",
    country: "Türkiye",
    coords: "36.2000° N, 29.6377° E",
    best_time: "May – October",
    activities:
      "Lycian Way coastal trekking, Kekova sunken ruins by wooden gulet, Xanthos & Patara sanctuaries",
    description:
      "Limestone cliffs plunging into turquoise coves, Lycian rock tombs, and pine-shaded footpaths tracing antiquity's southern maritime frontier.",
    image_url:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=85",
    gallery_images: [],
    extra_info:
      "Coastal walks combine footpath segments of the Lycian Way with private boat support between Kekova and Üçağız.",
    is_active: true,
    created_at: "2025-01-10T09:00:00.000Z",
    updated_at: "2025-01-10T09:00:00.000Z",
    _count: { tours: 1 },
  },
  {
    id: "dest-pamukkale",
    name: "Hierapolis & Pamukkale Travertines",
    city: "Denizli",
    country: "Türkiye",
    coords: "37.9250° N, 29.1258° E",
    best_time: "April – June, September – November",
    activities:
      "Thermal calcium terraces, Roman theatre of Hierapolis, Laodicea archaeological excavation",
    description:
      "Mineral-rich thermal springs cascading over white travertine terraces beneath the colonnaded streets and necropolis of ancient Hierapolis.",
    image_url:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1400&q=85",
    gallery_images: [],
    extra_info:
      "Footwear is removed on the protected travertine pools; upper Hierapolis trails require comfortable walking shoes.",
    is_active: true,
    created_at: "2025-01-10T09:00:00.000Z",
    updated_at: "2025-01-10T09:00:00.000Z",
    _count: { tours: 1 },
  },
  {
    id: "dest-mardin",
    name: "Mardin & Upper Mesopotamia",
    city: "Mardin",
    country: "Türkiye",
    coords: "37.3129° N, 40.7350° E",
    best_time: "March – May, October – November",
    activities:
      "Honey-stone Artuqid architecture, Deyrulzafaran Monastery, Dara Roman cisterns, Göbeklitepe excursion",
    description:
      "Carved limestone courtyard houses overlooking the Mesopotamian plain, Syriac monasteries, and the Neolithic enclosures of Taş Tepeler.",
    image_url:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=85",
    gallery_images: [],
    extra_info:
      "Routes connect Mardin, Midyat, and Şanlıurfa with specialist archaeological lecturers.",
    is_active: true,
    created_at: "2025-01-10T09:00:00.000Z",
    updated_at: "2025-01-10T09:00:00.000Z",
    _count: { tours: 1 },
  },
];

export const DEMO_TOURS: DemoTour[] = [
  {
    id: "tour-istanbul-strata",
    title: "Imperial Strata: Byzantium, Ottoman Courts & The Bosphorus",
    name: "Imperial Strata: Byzantium, Ottoman Courts & The Bosphorus",
    description:
      "An architectural and culinary walk through Old İstanbul—from Hagia Sophia's upper gallery and the Chora mosaics to spice merchants in Eminönü and an evening Bosphorus crossing.",
    destination_id: "dest-istanbul",
    destination_name: "İstanbul & The Bosphorus",
    city: "İstanbul",
    country: "Türkiye",
    location: "İstanbul, Türkiye",
    price_adult: 185,
    price_child: 110,
    price: 185,
    duration: 8,
    duration_hours: 8,
    max_participants: 10,
    max_group_size: 10,
    difficulty: "easy",
    tour_type: "one_day",
    image_url:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=85",
    ],
    includes: [
      "Licensed architectural historian guide",
      "Timed entry to Hagia Sophia & Topkapı Palace Harem",
      "Traditional lunch at a historic Guild Hans lokanta",
      "Private wooden launch across the Golden Horn & Bosphorus",
    ],
    included: [
      "Licensed architectural historian guide",
      "Timed entry to Hagia Sophia & Topkapı Palace Harem",
      "Traditional lunch at a historic Guild Hans lokanta",
      "Private wooden launch across the Golden Horn & Bosphorus",
    ],
    excluded: [
      "Personal expenses and evening dining",
      "Hotel airport transfers outside central districts",
    ],
    highlights: [
      "Hagia Sophia Upper Gallery",
      "Topkapı Imperial Council & Harem",
      "Grand Bazaar & Artisans' Hans",
      "Golden Horn to Kuzguncuk Boat Crossing",
    ],
    benefits: [
      "Capped at 10 guests for quiet interior study",
      "Skip-the-line archaeological entry",
      "Whisper audio receivers included",
    ],
    departure_location: "Sultanahmet German Fountain, İstanbul",
    departure_time: "08:30",
    return_time: "17:00",
    is_active: true,
    destinations: {
      id: "dest-istanbul",
      name: "İstanbul & The Bosphorus",
      city: "İstanbul",
      country: "Türkiye",
    },
    itinerary: [
      {
        day: 1,
        title: "Sultanahmet Sanctuary, Guild Courtyards & Bosphorus Timber Shores",
        description:
          "Begin at 08:30 inside the Hagia Sophia gallery before peak crowds, continue through Topkapı's kitchens and Harem courtyards, break for wood-fired dishes near the Spice Bazaar, and board a private launch from Eminönü along the Asian shoreline to Kuzguncuk.",
      },
    ],
  },
  {
    id: "tour-cappadocia-tuff",
    title: "Cappadocia Monastic Valleys & Volcanic Plateau (3 Days)",
    name: "Cappadocia Monastic Valleys & Volcanic Plateau (3 Days)",
    description:
      "Three days on foot through Rose Valley, Kızılçukur, and the rock-hewn churches of Göreme, paired with Kaymaklı's subterranean levels and clay-wheel studios along the Kızılırmak River.",
    destination_id: "dest-cappadocia",
    destination_name: "Cappadocia & Göreme Valleys",
    city: "Nevşehir",
    country: "Türkiye",
    location: "Göreme & Ürgüp, Türkiye",
    price_adult: 640,
    price_child: 420,
    price: 640,
    duration: 3,
    duration_hours: 72,
    max_participants: 12,
    max_group_size: 12,
    difficulty: "moderate",
    tour_type: "multiple_day",
    image_url:
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=80",
    ],
    includes: [
      "2 nights in a restored stone cave-house in Ürgüp",
      "All valley hikes with licensed Cappadocia specialist",
      "Göreme Dark Church (Karanlık Kilise) conservation ticket",
      "Regional Anatolian dinners & vineyard tasting",
    ],
    included: [
      "2 nights in a restored stone cave-house in Ürgüp",
      "All valley hikes with licensed Cappadocia specialist",
      "Göreme Dark Church (Karanlık Kilise) conservation ticket",
      "Regional Anatolian dinners & vineyard tasting",
    ],
    excluded: [
      "Optional dawn hot-air balloon flight (available on request)",
      "Domestic flights to Kayseri (ASR) or Nevşehir (NAV)",
    ],
    highlights: [
      "Karanlık Kilise Byzantine Frescoes",
      "Rose & Red Valley Ridge Walk",
      "Kaymaklı Underground Settlement",
      "Avanos Red-Clay Workshop",
    ],
    benefits: [
      "Off-trail valley routes timed for late-afternoon light",
      "Boutique stone accommodation with terrace views",
      "Flexible pacing for photography",
    ],
    departure_location: "Ürgüp / Nevşehir Airport Transfer",
    departure_time: "09:00",
    return_time: "18:00",
    is_active: true,
    destinations: {
      id: "dest-cappadocia",
      name: "Cappadocia & Göreme Valleys",
      city: "Nevşehir",
      country: "Türkiye",
    },
    itinerary: [
      {
        day: 1,
        title: "Göreme Open-Air Monasteries & Karanlık Kilise",
        description:
          "Study tenth- and eleventh-century fresco cycles in Tokalı and Karanlık churches, followed by a ridge walk through Zemi Valley into Ortahisar.",
      },
      {
        day: 2,
        title: "Dawn Over Kızılçukur & Kaymaklı Subterranean City",
        description:
          "Morning hike through the Rose and Red valleys, lunch in Çavuşin village, and afternoon descent into the ventilation shafts and wine presses of Kaymaklı.",
      },
      {
        day: 3,
        title: "Soğanlı Valley & Kızılırmak Pottery Tradition",
        description:
          "Explore the quiet rock-cut domes of Soğanlı and visit a family workshop in Avanos working clay drawn from the Red River.",
      },
    ],
  },
  {
    id: "tour-ephesus-ionia",
    title: "Ephesus, Terrace Houses & The Ionian Olive Press",
    name: "Ephesus, Terrace Houses & The Ionian Olive Press",
    description:
      "Walk the Curetes Way, the Library of Celsus, and the glass-roofed Terrace Houses with an archaeologist before ascending to Şirince and an organic olive press in the hills above Selçuk.",
    destination_id: "dest-ephesus",
    destination_name: "Ephesus & The Aegean Hinterland",
    city: "İzmir / Selçuk",
    country: "Türkiye",
    location: "Selçuk, İzmir, Türkiye",
    price_adult: 165,
    price_child: 95,
    price: 165,
    duration: 7,
    duration_hours: 7,
    max_participants: 10,
    max_group_size: 10,
    difficulty: "easy",
    tour_type: "one_day",
    image_url:
      "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1200&q=85",
    ],
    includes: [
      "Archaeologist guide throughout Ephesus & Ephesus Museum",
      "Terrace Houses (Yamaç Evler) special entry ticket",
      "Cold-pressed Aegean olive oil tasting & orchard lunch",
      "Private climate-controlled vehicle from İzmir or Selçuk",
    ],
    included: [
      "Archaeologist guide throughout Ephesus & Ephesus Museum",
      "Terrace Houses (Yamaç Evler) special entry ticket",
      "Cold-pressed Aegean olive oil tasting & orchard lunch",
      "Private climate-controlled vehicle from İzmir or Selçuk",
    ],
    excluded: ["Personal purchases", "Gratuities"],
    highlights: [
      "Library of Celsus & Great Theatre",
      "Roman Terrace Houses Mosaics",
      "Basilica of St. John on Ayasuluk Hill",
      "Aegean Olive Mill Tasting",
    ],
    benefits: [
      "Early 08:00 entry ahead of large tour buses",
      "Includes Terrace Houses conservation enclosure",
    ],
    departure_location: "Selçuk Town Square or İzmir Konak Pier",
    departure_time: "08:00",
    return_time: "15:30",
    is_active: true,
    destinations: {
      id: "dest-ephesus",
      name: "Ephesus & The Aegean Hinterland",
      city: "İzmir / Selçuk",
      country: "Türkiye",
    },
    itinerary: [
      {
        day: 1,
        title: "Magnesia Gate, Terrace Houses, Selçuk Museum & Olive Groves",
        description:
          "Enter Ephesus via the upper Magnesia Gate for a downhill walk along marble avenues, spend an hour inside the Roman Terrace Houses, visit the Artemis sculptures in Selçuk Museum, and conclude with lunch under century-old olive trees.",
      },
    ],
  },
  {
    id: "tour-lycian-way",
    title: "Lycian Way Footpaths & Kekova Sunken Coast (4 Days)",
    name: "Lycian Way Footpaths & Kekova Sunken Coast (4 Days)",
    description:
      "Follow coastal cedar and limestone paths between Kaş, Aperlae, and Simena, combining daily 10–14 km hikes with a traditional wooden gulet across the sunken Lycian harbour of Kekova.",
    destination_id: "dest-lycia",
    destination_name: "Kaş & The Lycian Coast",
    city: "Antalya",
    country: "Türkiye",
    location: "Kaş & Kekova, Türkiye",
    price_adult: 820,
    price_child: 580,
    price: 820,
    duration: 4,
    duration_hours: 96,
    max_participants: 8,
    max_group_size: 8,
    difficulty: "moderate",
    tour_type: "multiple_day",
    image_url:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=85",
    ],
    includes: [
      "3 nights in coastal pension and gulet cabin",
      "Luggage transfers between trailheads",
      "Full-board Mediterranean meals prepared with local catch",
      "Archaeological admission to Patara, Xanthos & Simena Castle",
    ],
    included: [
      "3 nights in coastal pension and gulet cabin",
      "Luggage transfers between trailheads",
      "Full-board Mediterranean meals prepared with local catch",
      "Archaeological admission to Patara, Xanthos & Simena Castle",
    ],
    excluded: ["Travel insurance", "Dalaman (DLM) or Antalya (AYT) flights"],
    highlights: [
      "Patara League Parliament Building",
      "Aperlae Purple-Dye Harbour Trail",
      "Simena Sarcophagi & Kekova Sound",
      "Kaş Antiphellos Theatre at Sunset",
    ],
    benefits: [
      "Luggage transported ahead so you walk with a daypack only",
      "Direct swim stops in boat-access-only coves",
    ],
    departure_location: "Kaş Old Harbour, Antalya",
    departure_time: "09:00",
    return_time: "16:30",
    is_active: true,
    destinations: {
      id: "dest-lycia",
      name: "Kaş & The Lycian Coast",
      city: "Antalya",
      country: "Türkiye",
    },
    itinerary: [
      {
        day: 1,
        title: "Xanthos Acropolis & Patara Dunes",
        description:
          "Explore the UNESCO-listed Lycian capital of Xanthos and walk the ancient lighthouse mole and restored bouleuterion at Patara.",
      },
      {
        day: 2,
        title: "Kaş to Limanağzı & Uluburun Ridge",
        description:
          "Walk rock-cut tombs and olive terraces above Kaş, returning by fishing boat from Limanağzı bay.",
      },
      {
        day: 3,
        title: "Aperlae Isthmus to Simena (Kaleköy)",
        description:
          "Hike across the remote peninsula of Aperlae and board our wooden boat to the car-free village of Simena.",
      },
      {
        day: 4,
        title: "Kekova Sunken Foundations & Andriake Granarium",
        description:
          "Morning sea kayaking or cruising along Kekova Island before visiting the Roman granary museum at Andriake.",
      },
    ],
  },
  {
    id: "tour-pamukkale-hierapolis",
    title: "Hierapolis Necropolis, Travertine Springs & Laodicea",
    name: "Hierapolis Necropolis, Travertine Springs & Laodicea",
    description:
      "A full-day geological and classical study of the Phrygian valley: the white calcium cascades of Pamukkale, the Martyrium of St. Philip, and the newly excavated colonnades of Laodicea.",
    destination_id: "dest-pamukkale",
    destination_name: "Hierapolis & Pamukkale Travertines",
    city: "Denizli",
    country: "Türkiye",
    location: "Pamukkale, Denizli, Türkiye",
    price_adult: 145,
    price_child: 90,
    price: 145,
    duration: 7,
    duration_hours: 7,
    max_participants: 12,
    max_group_size: 12,
    difficulty: "easy",
    tour_type: "one_day",
    image_url:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=85",
    ],
    includes: [
      "Entry to Hierapolis, Pamukkale Travertines & Laodicea",
      "Specialist classical guide",
      "Regional Denizli tandır lunch",
    ],
    included: [
      "Entry to Hierapolis, Pamukkale Travertines & Laodicea",
      "Specialist classical guide",
      "Regional Denizli tandır lunch",
    ],
    excluded: ["Cleopatra Antique Pool swim ticket (optional on site)"],
    highlights: [
      "Frontinus Gate & Northern Necropolis",
      "Severan Theatre of Hierapolis",
      "Thermal Calcium Terraces",
      "Laodicea Syria Street & Sacred Agora",
    ],
    benefits: [
      "North-gate approach walks downhill through the necropolis first",
    ],
    departure_location: "Denizli / Pamukkale North Gate",
    departure_time: "08:30",
    return_time: "16:00",
    is_active: true,
    destinations: {
      id: "dest-pamukkale",
      name: "Hierapolis & Pamukkale Travertines",
      city: "Denizli",
      country: "Türkiye",
    },
    itinerary: [
      {
        day: 1,
        title: "Laodicea Excavations, Hierapolis Theatre & Travertine Walk",
        description:
          "Morning visit to Laodicea's restored temples, midday walk through the Hierapolis necropolis and Roman theatre, and afternoon barefoot descent along the thermal travertine channels.",
      },
    ],
  },
  {
    id: "tour-mardin-gobeklitepe",
    title: "Stone & Sanctuary: Mardin, Dara & Göbeklitepe (3 Days)",
    name: "Stone & Sanctuary: Mardin, Dara & Göbeklitepe (3 Days)",
    description:
      "Journey across Southeastern Anatolia's limestone escarpments—from Artuqid madrasas and Syriac monasteries in Mardin to the 11,500-year-old T-pillars of Göbeklitepe and Karahantepe.",
    destination_id: "dest-mardin",
    destination_name: "Mardin & Upper Mesopotamia",
    city: "Mardin",
    country: "Türkiye",
    location: "Mardin & Şanlıurfa, Türkiye",
    price_adult: 710,
    price_child: 490,
    price: 710,
    duration: 3,
    duration_hours: 72,
    max_participants: 10,
    max_group_size: 10,
    difficulty: "easy",
    tour_type: "multiple_day",
    image_url:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=85",
    ],
    includes: [
      "2 nights in a heritage stone mansion in Old Mardin",
      "Prehistoric archaeologist lecturer for Göbeklitepe & Karahantepe",
      "All museum admissions and private intercity transport",
      "Assyrian & Mardin culinary tastings",
    ],
    included: [
      "2 nights in a heritage stone mansion in Old Mardin",
      "Prehistoric archaeologist lecturer for Göbeklitepe & Karahantepe",
      "All museum admissions and private intercity transport",
      "Assyrian & Mardin culinary tastings",
    ],
    excluded: ["Domestic flights to Mardin (MQM) / from Şanlıurfa (GNY)"],
    highlights: [
      "Göbeklitepe & Karahantepe Neolithic Enclosures",
      "Kasimiye Madrasa & Old Mardin Rooftops",
      "Dara Late-Roman Underground Cisterns",
      "Mor Gabriel & Deyrulzafaran Monasteries",
    ],
    benefits: [
      "Includes both Göbeklitepe and the newer Karahantepe excavation",
    ],
    departure_location: "Mardin Old Town (Artuklu)",
    departure_time: "09:00",
    return_time: "18:00",
    is_active: true,
    destinations: {
      id: "dest-mardin",
      name: "Mardin & Upper Mesopotamia",
      city: "Mardin",
      country: "Türkiye",
    },
    itinerary: [
      {
        day: 1,
        title: "Old Mardin Escarpment, Kasimiye Madrasa & Deyrulzafaran",
        description:
          "Walk the stepped stone alleys (abbaras) of Mardin, visit the fifteenth-century Kasimiye Madrasa, and take afternoon tea at Deyrulzafaran Monastery.",
      },
      {
        day: 2,
        title: "Dara Roman Garrison & Tur Abdin Plateau",
        description:
          "Explore the rock-cut necropolis and cavernous cisterns of Anastasiopolis (Dara), continuing to Midyat and Mor Gabriel Monastery.",
      },
      {
        day: 3,
        title: "Taş Tepeler: Karahantepe, Göbeklitepe & Şanlıurfa Museum",
        description:
          "Cross the Harran plain to study the Pre-Pottery Neolithic enclosures of Karahantepe and Göbeklitepe alongside the Şanlıurfa Archaeological Museum.",
      },
    ],
  },
];

export const DEMO_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
    alt: "Morning ferry crossing the Bosphorus toward Ortaköy Mosque, İstanbul",
    location: "Ortaköy & Bosphorus Strait",
    region: "İstanbul",
    category: "architecture",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1200&q=85",
    alt: "Tuff rock formations and dawn light across Göreme valley, Cappadocia",
    location: "Göreme National Park",
    region: "Central Anatolia",
    category: "landscapes",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1200&q=85",
    alt: "Two-story marble facade of the Library of Celsus at Ephesus",
    location: "Ephesus, Selçuk",
    region: "Aegean",
    category: "architecture",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=85",
    alt: "Turquoise limestone cove along the Lycian Way near Kaş",
    location: "Kaş & Kaputaş Coast",
    region: "Mediterranean",
    category: "coastline",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=85",
    alt: "Mineral-rich thermal pools on the white travertine terraces of Pamukkale",
    location: "Pamukkale & Hierapolis",
    region: "Inner Aegean",
    category: "landscapes",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=85",
    alt: "Domes and minarets along the Golden Horn at dusk, İstanbul",
    location: "Süleymaniye & Golden Horn",
    region: "İstanbul",
    category: "architecture",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=85",
    alt: "Hand-woven Anatolian kilims and copperwork in a historic caravanserai",
    location: "Ürgüp & Avanos",
    region: "Central Anatolia",
    category: "craft",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=85",
    alt: "Galata Tower overlooking the Karaköy waterfront and Bosphorus",
    location: "Galata, Beyoğlu",
    region: "İstanbul",
    category: "architecture",
  },
];
