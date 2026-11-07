import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Anatolian Atlas database seeding...');

  console.log('🧹 Cleaning existing data...');
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.tourPricing.deleteMany({});
  await prisma.timeSlot.deleteMany({});
  await prisma.seasonalPricing.deleteMany({});
  await prisma.groupDiscount.deleteMany({});
  await prisma.tour.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Database cleaned!');

  const hashedPassword = await bcrypt.hash('1872017', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'hazarvolga@gmail.com',
      password_hash: hashedPassword,
      role: 'admin',
      first_name: 'Hazar',
      last_name: 'Ekiz',
      email_verified: true,
      is_active: true,
    },
  });
  console.log(`✅ Admin user created: ${adminUser.email}`);

  const cultural = await prisma.category.create({
    data: { name: 'Archaeology & Architecture', slug: 'cultural' },
  });
  const coastal = await prisma.category.create({
    data: { name: 'Maritime & Coastal', slug: 'coastal' },
  });
  const culinary = await prisma.category.create({
    data: { name: 'Culinary & Craft', slug: 'culinary' },
  });

  // 6 Curated Anatolian Atlas Regions
  const istanbul = await prisma.destination.create({
    data: {
      name: 'İstanbul & The Bosphorus',
      slug: 'dest-istanbul',
      country_id: 'TR',
      city_id: '34',
      country: 'Türkiye',
      city: 'İstanbul',
      coords: '41.0082° N, 28.9784° E',
      best_time: 'April – June, September – November',
      short_description: 'Imperial strata, Bosphorus ferry crossings, and historic quarters.',
      description:
        'Straddling Europe and Asia across the deep current of the Bosphorus, İstanbul layers fifteen centuries of imperial stone, timber-framed quarters, and neighborhood lokantas.',
      featured: true,
      is_active: true,
      activities: [
        'Byzantine & Ottoman architecture',
        'Bosphorus ferry crossings',
        'Historic neighborhood walks',
        'Spice market tastings',
      ],
      gallery_images: [
        'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80',
      ],
      extra_info: {
        note: 'Private historian-led walks depart from Sultanahmet and Karaköy piers. Museum Pass Türkiye is included on multi-day itineraries.',
        image_url:
          'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=85',
      },
    },
  });

  const cappadocia = await prisma.destination.create({
    data: {
      name: 'Cappadocia & Göreme Valleys',
      slug: 'dest-cappadocia',
      country_id: 'TR',
      city_id: '50',
      country: 'Türkiye',
      city: 'Nevşehir',
      coords: '38.6431° N, 34.8289° E',
      best_time: 'April – June, September – October',
      short_description: 'Volcanic tuff valleys, subterranean settlements, and monastic frescoes.',
      description:
        'Wind-carved tuff valleys, subterranean settlements, and eleventh-century frescoed chapels across the high plateau of Central Anatolia.',
      featured: true,
      is_active: true,
      activities: [
        'Volcanic valley hikes',
        'Rock-cut monastic churches',
        'Avanos pottery workshops',
        'Sunrise ballooning',
      ],
      gallery_images: [
        'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1400&q=85',
      ],
      extra_info: {
        note: 'High-altitude plateau climate brings cool mornings even in summer; layered walking attire is recommended.',
        image_url:
          'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1400&q=85',
      },
    },
  });

  const ephesus = await prisma.destination.create({
    data: {
      name: 'Ephesus & Ionian Coast',
      slug: 'dest-ephesus',
      country_id: 'TR',
      city_id: '35',
      country: 'Türkiye',
      city: 'İzmir / Selçuk',
      coords: '37.9395° N, 27.3417° E',
      best_time: 'March – June, September – November',
      short_description: 'Hellenistic port cities, marble colonnades, and Aegean olive groves.',
      description:
        'From the marble street of Curetes and the Terrace Houses of Ephesus to old stone villages in Şirince and the vineyards of Urla.',
      featured: true,
      is_active: true,
      activities: [
        'Classical archaeology',
        'Terrace House conservation walk',
        'Urla vineyard table',
        'Aegean olive oil mills',
      ],
      gallery_images: [
        'https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1400&q=85',
      ],
      extra_info: {
        note: 'Morning 08:00 entry at the Magnesia Gate avoids cruise coach congestion.',
        image_url:
          'https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1400&q=85',
      },
    },
  });

  const lycia = await prisma.destination.create({
    data: {
      name: 'Lycian Coast, Kaş & Kekova',
      slug: 'dest-lycia',
      country_id: 'TR',
      city_id: '07',
      country: 'Türkiye',
      city: 'Antalya',
      coords: '36.1993° N, 29.6397° E',
      best_time: 'May – October',
      short_description: 'Limestone headlands, sunken Lycian cities, and wooden gulet anchorages.',
      description:
        'Pine-clad headlands dropping into clear Mediterranean coves, rock-cut Lycian sarcophagi, and coastal trails linking Patara, Kaş, and sunken Simena.',
      featured: true,
      is_active: true,
      activities: [
        'Wooden gulet coastal crossings',
        'Lycian Way ridge walks',
        'Kekova sunken ruins kayaking',
        'Patara & Xanthos excavations',
      ],
      gallery_images: [
        'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=1400&q=85',
      ],
      extra_info: {
        note: 'Gulet charters depart from Kaş and Fethiye harbors with licensed coastal skippers.',
        image_url:
          'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=1400&q=85',
      },
    },
  });

  const pamukkale = await prisma.destination.create({
    data: {
      name: 'Pamukkale & Hierapolis',
      slug: 'dest-pamukkale',
      country_id: 'TR',
      city_id: '20',
      country: 'Türkiye',
      city: 'Denizli',
      coords: '37.9250° N, 29.1258° E',
      best_time: 'March – June, September – November',
      short_description: 'Calcium travertine terraces, Roman thermal baths, and Aphrodisias.',
      description:
        'Mineral-rich thermal springs cascading over white calcium travertines below the colonnaded streets, theater, and vast necropolis of ancient Hierapolis.',
      featured: false,
      is_active: true,
      activities: [
        'Hierapolis Roman theater & Martyrium',
        'Aphrodisias marble stadium & Sebasteion',
        'Travertine thermal walk',
      ],
      gallery_images: [
        'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1400&q=85',
      ],
      extra_info: {
        note: 'Paired with nearby Aphrodisias, one of the best-preserved sculptural schools of antiquity.',
        image_url:
          'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1400&q=85',
      },
    },
  });

  const mardin = await prisma.destination.create({
    data: {
      name: 'Southeastern Anatolia: Mardin & Göbeklitepe',
      slug: 'dest-mardin',
      country_id: 'TR',
      city_id: '47',
      country: 'Türkiye',
      city: 'Mardin',
      coords: '37.3129° N, 40.7339° E',
      best_time: 'March – May, September – November',
      short_description: 'Pre-pottery Neolithic enclosures, Syriac monasteries, and limestone ridges.',
      description:
        'Honey-colored limestone mansions overlooking the Mesopotamian plain, Syriac stone monasteries in Tur Abdin, and the 11,500-year-old T-pillars of Göbeklitepe and Karahantepe.',
      featured: true,
      is_active: true,
      activities: [
        'Göbeklitepe & Karahantepe Neolithic sites',
        'Deyrulzafaran & Mor Gabriel monasteries',
        'Old Mardin stone architecture',
        'Southeastern spice & copper bazaars',
      ],
      gallery_images: [
        'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=85',
      ],
      extra_info: {
        note: 'Led by Pre-Pottery Neolithic specialists across Şanlıurfa and Mardin.',
        image_url:
          'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=85',
      },
    },
  });

  console.log('✅ 6 Anatolian Atlas destinations created!');

  // 6 Curated Anatolian Atlas Tours
  const toursToSeed = [
    {
      title: 'Imperial Strata: Byzantium, Ottoman Courts & The Bosphorus',
      slug: 'tour-istanbul-strata',
      description:
        'A three-day architectural and culinary study of İstanbul across Sultanahmet, the Zeyrek cisterns, Fener-Balat, and a private timber boat crossing of the Bosphorus.',
      short_description:
        'Three-day historian-led study of Byzantine and Ottoman İstanbul.',
      status: 'active',
      duration_hours: 72,
      max_participants: 10,
      min_participants: 2,
      price_adult: 1180,
      price_child: 820,
      price_currency: 'EUR',
      difficulty_level: 1,
      featured: true,
      includes: [
        'Hagia Sophia upper gallery & Chora (Kariye) mosaics with Byzantine art historian',
        'Topkapı Palace Imperial Treasury & Harem timed entry',
        'Private timber launch along the European and Asian shores of the Bosphorus',
        'Spice Bazaar & Karaköy guild tastings',
      ],
      excludes: [
        'International airfare',
        'Personal travel insurance',
      ],
      images: [
        'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=85',
      ],
      metadata: {
        city: 'İstanbul',
        tour_type: 'multiple_day',
        departure_location: 'Karaköy Pier / Galata, İstanbul',
        departure_time: '08:30',
        return_time: '18:00',
        itinerary: [
          {
            day: 1,
            title: 'The First Hill: Hagia Sophia, Topkapı Courts & Basilica Cistern',
            description:
              'Early morning entry to Hagia Sophia before coach groups arrive, followed by the Fourth Court pavilions of Topkapı Palace and lunch at a historic Sultanahmet esnaf lokantası.',
          },
          {
            day: 2,
            title: 'Golden Horn Ridges: Süleymaniye, Zeyrek & Fener-Balat',
            description:
              'Walk the stone terraces of Mimar Sinan’s Süleymaniye complex, descend through the Pantokrator monastery quarter in Zeyrek, and inspect the mosaic cycles of Kariye.',
          },
          {
            day: 3,
            title: 'The Straits: Bosphorus Wooden Launch & Asian Shore Markets',
            description:
              'Board a private mahogany motor-launch from Karaköy along wooden yalı mansions to Anadolu Kavağı, concluding with a market tasting in Kadıköy.',
          },
        ],
      },
      category_id: cultural.id,
      destination_id: istanbul.id,
      guide_id: adminUser.id,
    },
    {
      title: 'Cappadocia Monastic Valleys, Tuff Architecture & Underground Cities',
      slug: 'tour-cappadocia-tuff',
      description:
        'Four days walking the volcanic canyons of Göreme, Kızılçukur, and Soganlı, pairing eleventh-century rock-cut church frescoes with Kaymaklı subterranean levels and Avanos clay studios.',
      short_description:
        'Four-day geological and monastic valley walk across Cappadocia.',
      status: 'active',
      duration_hours: 96,
      max_participants: 10,
      min_participants: 2,
      price_adult: 1490,
      price_child: 990,
      price_currency: 'EUR',
      difficulty_level: 2,
      featured: true,
      includes: [
        'Tokalı, Karanlık & Elmalı rock-cut church conservation access',
        'Dawn hot-air balloon flight over Göreme & Love Valley (weather permitting)',
        'Kaymaklı subterranean settlement deep-level traversal',
        'Red & Rose Valley ridge hike with vineyard table lunch',
      ],
      excludes: ['Domestic flights to Kayseri (ASR) / Nevşehir (NAV)'],
      images: [
        'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1400&q=85',
      ],
      metadata: {
        city: 'Nevşehir',
        tour_type: 'multiple_day',
        departure_location: 'Ürgüp & Göreme, Nevşehir',
        departure_time: '05:30 / 08:30',
        return_time: '17:30',
        itinerary: [
          {
            day: 1,
            title: 'Göreme Open-Air Monastic Complex & Karanlık Kilise',
            description:
              'Study the tenth- and eleventh-century Middle Byzantine fresco programs at Tokalı and Karanlık churches with a conservation specialist.',
          },
          {
            day: 2,
            title: 'Dawn Flight & Meskendir – Rose Valley Trail',
            description:
              'Optional sunrise balloon ascent over the tuff cones, followed by a 7 km walk through Meskendir and Kızılçukur valleys to Çavuşin village.',
          },
          {
            day: 3,
            title: 'Kaymaklı Subterranean City & Soğanlı Valley',
            description:
              'Descend four ventilated stories into the volcanic bedrock at Kaymaklı, then continue south to the quiet monastic gorge of Soğanlı.',
          },
          {
            day: 4,
            title: 'Kızılırmak Red Clay Workshops & Uçhisar Citadel',
            description:
              'Visit a fifth-generation potter in Avanos working with iron-rich Kızılırmak river clay before ascending Uçhisar rock fortress.',
          },
        ],
      },
      category_id: cultural.id,
      destination_id: cappadocia.id,
      guide_id: adminUser.id,
    },
    {
      title: 'Ionian Polis: Ephesus Terrace Houses, Priene & Urla Vineyards',
      slug: 'tour-ephesus-ionian',
      description:
        'Explore the classical urban planning of Ephesus, Priene, Miletus, and Didyma alongside contemporary Aegean gastronomy along the Urla Wine Route.',
      short_description:
        'Classical Ionian cities and Urla vineyard gastronomy.',
      status: 'active',
      duration_hours: 72,
      max_participants: 12,
      min_participants: 2,
      price_adult: 1240,
      price_child: 890,
      price_currency: 'EUR',
      difficulty_level: 1,
      featured: true,
      includes: [
        'Ephesus Terrace Houses (Yamaç Evler) & Library of Celsus early access',
        'Hellenistic grid of Priene, Theater of Miletus & Temple of Apollo at Didyma',
        'Urla vineyard tasting & olive oil mill pressings',
      ],
      excludes: ['Domestic flights to İzmir (ADB)'],
      images: [
        'https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1400&q=85',
      ],
      metadata: {
        city: 'İzmir / Selçuk',
        tour_type: 'multiple_day',
        departure_location: 'Selçuk / İzmir',
        departure_time: '08:00',
        return_time: '18:00',
        itinerary: [
          {
            day: 1,
            title: 'Ephesus Upper Gate, Terrace Houses & Basilica of St. John',
            description:
              'Enter via the Magnesia Gate at 08:00 to examine the Roman peristyle villas of the Terrace Houses and the Artemision precinct.',
          },
          {
            day: 2,
            title: 'The Ionian League: Priene, Miletus & Didyma',
            description:
              'Trace the ancient coastline of the Maeander valley across the hillside grid of Priene and the colossal oracle sanctuary of Didyma.',
          },
          {
            day: 3,
            title: 'Urla Peninsula Olive Groves & Estate Cellars',
            description:
              'Spend the final day on the Çeşme-Urla peninsula visiting cold-press olive mills and boutique wineries reviving indigenous Bornova Misketi and Foça Karası grapes.',
          },
        ],
      },
      category_id: culinary.id,
      destination_id: ephesus.id,
      guide_id: adminUser.id,
    },
    {
      title: 'Lycian Way & Sunken Kekova: Coastal Trail & Gulet Passage',
      slug: 'tour-lycian-gulet',
      description:
        'Five days combining cliffside sections of the Lycian Way between Patara, Xanthos, and Kaş with a private wooden gulet voyage across the Kekova archipelago.',
      short_description:
        'Five-day Lycian coast trail walk and private wooden gulet charter.',
      status: 'active',
      duration_hours: 120,
      max_participants: 10,
      min_participants: 2,
      price_adult: 1860,
      price_child: 1320,
      price_currency: 'EUR',
      difficulty_level: 2,
      featured: true,
      includes: [
        'Patara Bouleuterion & sand dunes + Xanthos-Letoon UNESCO sites',
        'Private timber gulet cruise across Kekova, Simena & Gökkaya Bay',
        'Guided sea-kayaking over the submerged Lycian harbor walls of Dolchiste',
      ],
      excludes: ['Flights to Dalaman (DLM) or Antalya (AYT)'],
      images: [
        'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=1400&q=85',
      ],
      metadata: {
        city: 'Antalya / Kaş',
        tour_type: 'multiple_day',
        departure_location: 'Kaş Harbor, Antalya',
        departure_time: '09:00',
        return_time: '17:00',
        itinerary: [
          {
            day: 1,
            title: 'Xanthos Capital & Patara Maritime Assembly',
            description:
              'Walk the acropolis of Xanthos and the restored parliament building (Bouleuterion) of the Lycian League at Patara before sunset over the dunes.',
          },
          {
            day: 2,
            title: 'Delikkemer Roman Siphon & antiphellos Coastal Trail',
            description:
              'Hike the pine-shaded coastal ridge past the inverted stone siphon of Delikkemer into the harbor town of Kaş.',
          },
          {
            day: 3,
            title: 'Boarding the Gulet: Kaş to Aperlae & Kekova Sound',
            description:
              'Set sail eastward to the secluded bay of Aperlae, swimming above submerged masonry quays before anchoring in Kekova Sound.',
          },
          {
            day: 4,
            title: 'Simena Castle, Sunken Dolchiste & Gökkaya Anchorage',
            description:
              'Morning sea-kayak passage along the sunken Lycian rooms of Kekova Island and climb to the rock-cut theater inside Simena crusader castle.',
          },
          {
            day: 5,
            title: 'Myra Rock Tombs, St. Nicholas Basilica & Return to Kaş',
            description:
              'Disembark at Çayağzı to inspect the painted house-tombs of Myra and the sixth-century basilica of St. Nicholas in Demre.',
          },
        ],
      },
      category_id: coastal.id,
      destination_id: lycia.id,
      guide_id: adminUser.id,
    },
    {
      title: 'Hierapolis, Pamukkale Travertines & Aphrodisias Sculptural School',
      slug: 'tour-pamukkale-hierapolis',
      description:
        'A two-day archaeological study pairing the thermal travertines and Roman necropolis of Hierapolis with the marble stadium and Sebasteion reliefs of Aphrodisias.',
      short_description:
        'Two-day classical study of Hierapolis, Pamukkale, and Aphrodisias.',
      status: 'active',
      duration_hours: 48,
      max_participants: 12,
      min_participants: 2,
      price_adult: 780,
      price_child: 540,
      price_currency: 'EUR',
      difficulty_level: 1,
      featured: false,
      includes: [
        'Hierapolis Frontinus Gate, Roman Theater & Martyrium of St. Philip',
        'Pamukkale thermal calcium terraces walk',
        'Aphrodisias Stadium, Tetrapylon & Museum of Sebasteion Reliefs',
      ],
      excludes: ['Domestic flights to Denizli Çardak (DNZ)'],
      images: [
        'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1400&q=85',
      ],
      metadata: {
        city: 'Denizli',
        tour_type: 'multiple_day',
        departure_location: 'Pamukkale / Denizli',
        departure_time: '08:00',
        return_time: '18:30',
        itinerary: [
          {
            day: 1,
            title: 'Hierapolis Northern Necropolis, Theater & Travertine Terraces',
            description:
              'Enter via the northern monumental tombs at 08:00, ascend to the third-century Roman theater and Martyrium, and walk the warm mineral travertine shelves.',
          },
          {
            day: 2,
            title: 'Aphrodisias: Marble Quarries, Stadium & Sebasteion',
            description:
              'Cross the Morsynus valley to Aphrodisias to study the 30,000-seat stadium, the Bouleuterion, and the imperial reliefs of the Sebasteion.',
          },
        ],
      },
      category_id: cultural.id,
      destination_id: pamukkale.id,
      guide_id: adminUser.id,
    },
    {
      title: 'Upper Mesopotamia: Göbeklitepe, Karahantepe & Old Mardin Stone Ridge',
      slug: 'tour-mardin-mesopotamia',
      description:
        'Four days across Şanlıurfa and Mardin examining the 9600 BCE enclosures of Göbeklitepe and Karahantepe alongside the Syriac monasteries of Tur Abdin.',
      short_description:
        'Neolithic sanctuaries of Taş Tepeler and limestone architecture of Mardin.',
      status: 'active',
      duration_hours: 96,
      max_participants: 10,
      min_participants: 2,
      price_adult: 1580,
      price_child: 1120,
      price_currency: 'EUR',
      difficulty_level: 2,
      featured: true,
      includes: [
        'Göbeklitepe & Karahantepe Pre-Pottery Neolithic sanctuaries with archaeologist',
        'Şanlıurfa Haleplibahçe Mosaic Museum & Balıklıgöl Bazaar',
        'Dara Roman frontier cisterns, Deyrulzafaran & Mor Gabriel monasteries',
      ],
      excludes: ['Domestic flights to Şanlıurfa (GNY) and from Mardin (MQM)'],
      images: [
        'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=85',
      ],
      metadata: {
        city: 'Mardin / Şanlıurfa',
        tour_type: 'multiple_day',
        departure_location: 'Şanlıurfa / Mardin',
        departure_time: '08:00',
        return_time: '18:00',
        itinerary: [
          {
            day: 1,
            title: 'Göbeklitepe Enclosures A–D & Şanlıurfa Archaeological Museum',
            description:
              'Morning study of the T-shaped limestone pillars and carved reliefs at Göbeklitepe, paired with the Urfa Man statue and Haleplibahçe Amazon mosaics.',
          },
          {
            day: 2,
            title: 'Karahantepe Excavations & Harran Steppe',
            description:
              'Traverse the TekTek Mountains to Karahantepe to inspect the rock-cut pillar chambers before driving east toward the basalt plateau.',
          },
          {
            day: 3,
            title: 'Dara Anastasiopolis Cisterns & Old Mardin Abbaras',
            description:
              'Explore the sixth-century Byzantine frontier dungeons and rock necropolis of Dara, then walk the vaulted stone passageways (abbaras) of Old Mardin.',
          },
          {
            day: 4,
            title: 'Tur Abdin Plateau: Deyrulzafaran, Midyat & Mor Gabriel',
            description:
              'Visit the fifth-century Syriac Orthodox monastery of Mor Gabriel and traditional filigree (telkari) silversmith studios in Midyat.',
          },
        ],
      },
      category_id: cultural.id,
      destination_id: mardin.id,
      guide_id: adminUser.id,
    },
  ];

  for (const tourData of toursToSeed) {
    await prisma.tour.create({ data: tourData });
  }
  console.log('✅ 6 Anatolian Atlas tours created!');

  // Seed CMS Pages (about, terms, privacy)
  await prisma.page.createMany({
    data: [
      {
        title: 'Curatorial Field Methodology & Galata Planning Office',
        slug: 'about',
        status: 'published',
        template_type: 'default',
        is_homepage: false,
        meta_title: 'About NextStopTurkey — Anatolian Atlas & Galata Planning Office',
        meta_description:
          'Founded in Galata, İstanbul in 2019 (TÜRSAB License A-14892), NextStopTurkey designs historian-led small-group and private field journeys across six regions of Türkiye.',
        content: [
          {
            id: 'about-1',
            type: 'text',
            title: 'The Anatolian Monograph Premise',
            content:
              '<p>Founded in Galata, İstanbul in 2019 (TÜRSAB Group A License No. A-14892), <strong>NextStopTurkey</strong> operates as an editorial planning bureau and field operator. Every scheduled departure is capped at 8 to 12 guests and led by licensed archaeologists, architectural historians, or regional culinary specialists.</p><p>Rather than high-volume coach circuits, our itineraries time site admissions for 08:00 gate openings and pair monumental antiquity with working artisan studios, neighborhood lokantas, and coastal timber gulets.</p>',
          },
        ],
      },
      {
        title: 'Conditions of Expedition Booking & Cancellation Policy',
        slug: 'terms',
        status: 'published',
        template_type: 'default',
        is_homepage: false,
        meta_title: 'Booking Terms & Cancellation Conditions | NextStopTurkey',
        meta_description:
          'Review deposit schedules, cancellation windows, small-group guarantees, and TÜRSAB statutory protections for NextStopTurkey itineraries.',
        content: [
          {
            id: 'terms-1',
            type: 'text',
            title: 'Reservation Deposit, Balance & Cancellation Windows',
            content:
              '<h2>1. Reservation & Deposit</h2><p>A 25% deposit confirms your berth on any scheduled small-group departure or private charter. Final balance is due 30 days prior to departure.</p><h2>2. Cancellation & Refund Schedule</h2><p>Cancellations received 30 or more days before departure receive a 100% refund of all payments made, less external non-refundable domestic flight tickets if issued. Cancellations between 15 and 29 days prior to departure are eligible for a 50% refund or 100% date-transfer credit valid for 24 months.</p>',
          },
        ],
      },
      {
        title: 'Privacy Notice & KVKK / GDPR Data Stewardship',
        slug: 'privacy',
        status: 'published',
        template_type: 'default',
        is_homepage: false,
        meta_title: 'Privacy Policy & KVKK / GDPR Data Protection | NextStopTurkey',
        meta_description:
          'How NextStopTurkey protects traveller passport, dietary, and reservation records under KVKK No. 6698 and EU GDPR.',
        content: [
          {
            id: 'privacy-1',
            type: 'text',
            title: 'Data Controller & Traveller Record Protection',
            content:
              '<h2>1. Data Controller</h2><p>NextStopTurkey Turizm A.Ş. (Serdar-ı Ekrem Caddesi No. 28/4, Galata, Beyoğlu 34421, İstanbul) acts as the data controller under Turkish Personal Data Protection Law (KVKK No. 6698) and the EU General Data Protection Regulation (GDPR).</p><h2>2. Purpose of Processing</h2><p>Traveller names, contact details, and passport/ID numbers are collected strictly to issue museum passes, domestic aviation manifests, maritime harbor clearances, and hotel registrations.</p>',
          },
        ],
      },
    ],
  });
  console.log('✅ CMS pages (about, terms, privacy) created!');

  console.log('🎉 Anatolian Atlas database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('💥 Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
