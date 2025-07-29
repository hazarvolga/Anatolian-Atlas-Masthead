import { Pool } from 'pg';
import dotenv from 'dotenv';

console.log('Loading environment variables...');
dotenv.config({ path: '.env' });

console.log('Environment loaded. Creating database pool...');

const pool = new Pool({
  connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

console.log('Database pool created.');

const destinations = [
  {
    name: 'Istanbul',
    country: 'Turkey',
    city: 'Istanbul',
    description: 'The city that straddles two continents, offering a rich history, vibrant culture, and stunning architecture.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    featured: true
  },
  {
    name: 'Cappadocia',
    country: 'Turkey',
    city: 'Nevşehir',
    description: 'Famous for its unique "fairy chimneys," ancient cave dwellings, and breathtaking hot air balloon rides at sunrise.',
    image_url: 'https://images.unsplash.com/photo-1568150469384-33a23dd6ceb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    featured: true
  },
  {
    name: 'Pamukkale',
    country: 'Turkey',
    city: 'Denizli',
    description: 'Home to the "Cotton Castle," a surreal landscape of white travertine terraces and mineral-rich thermal waters.',
    image_url: 'https://images.unsplash.com/photo-1614232213911-e39343853f3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    featured: true
  },
  {
    name: 'Ephesus & Kusadasi',
    country: 'Turkey',
    city: 'İzmir',
    description: 'Explore the ancient city of Ephesus, one of the best-preserved Roman ruins, and relax in the coastal town of Kusadasi.',
    image_url: 'https://images.unsplash.com/photo-1627895439379-59338b3e4a6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    featured: false
  },
  {
    name: 'Antalya',
    country: 'Turkey',
    city: 'Antalya',
    description: 'A resort city on the Turquoise Coast with a beautiful old harbor, stunning beaches, and waterfalls.',
    image_url: 'https://images.unsplash.com/photo-1611080299392-782c14d454c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    featured: true
  }
];

const tours = [
  {
    destination_name: 'Istanbul',
    title: 'Istanbul Classics: Full-Day Tour',
    description: 'Discover the timeless sights of Istanbul in one day. Visit the Blue Mosque, Hagia Sophia, Topkapi Palace, and the Grand Bazaar.',
    price: '95.00',
    duration: 8,
    includes: ['Professional guide', 'Entrance fees', 'Lunch', 'Hotel pickup and drop-off'],
    excludes: ['Drinks', 'Personal expenses', 'Tips'],
    itinerary: [
        { time: '09:00', description: 'Hotel Pickup' },
        { time: '10:00', description: 'Visit Blue Mosque' },
        { time: '11:30', description: 'Explore Hagia Sophia' },
        { time: '13:00', description: 'Lunch at a local restaurant' },
        { time: '14:30', description: 'Tour Topkapi Palace' },
        { time: '16:00', description: 'Free time at the Grand Bazaar' },
        { time: '17:30', description: 'Return to hotel' }
    ],
    image_url: 'https://images.unsplash.com/photo-1583422409516-2895a7dba5f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    destination_name: 'Istanbul',
    title: 'Bosphorus Cruise & Two Continents Tour',
    description: 'Enjoy a scenic cruise on the Bosphorus, visit the Spice Bazaar, and cross over to the Asian side to see the Beylerbeyi Palace.',
    price: '70.00',
    duration: 6,
    includes: ['Bosphorus cruise ticket', 'Professional guide', 'Hotel pickup and drop-off', 'Entrance fees'],
    excludes: ['Lunch', 'Drinks', 'Personal expenses'],
    itinerary: [
        { time: '13:00', description: 'Hotel Pickup' },
        { time: '14:00', description: 'Visit Spice Bazaar' },
        { time: '15:30', description: 'Embark on Bosphorus Cruise' },
        { time: '17:30', description: 'Visit Beylerbeyi Palace (from outside)' },
        { time: '19:00', description: 'Return to hotel' }
    ],
    image_url: 'https://images.unsplash.com/photo-1568315299423-330198a801cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    destination_name: 'Cappadocia',
    title: 'Sunrise Hot Air Balloon Flight',
    description: 'Experience the magic of Cappadocia from above with a one-hour hot air balloon flight at sunrise. Includes a champagne toast upon landing.',
    price: '250.00',
    duration: 3,
    includes: ['1-hour balloon flight', 'Hotel pickup and drop-off', 'Champagne toast', 'Flight certificate'],
    excludes: ['Breakfast'],
    itinerary: [
        { time: '04:30', description: 'Hotel Pickup' },
        { time: '05:30', description: 'Balloon take-off' },
        { time: '06:30', description: 'Landing and champagne celebration' },
        { time: '07:30', description: 'Return to hotel' }
    ],
    image_url: 'https://images.unsplash.com/photo-1532403431143-9ab41e2134a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    destination_name: 'Cappadocia',
    title: 'Cappadocia Red Tour (North)',
    description: 'Explore the northern part of Cappadocia, including Goreme Open-Air Museum, Uchisar Castle, and the fairy chimneys of Pasabag.',
    price: '60.00',
    duration: 7,
    includes: ['Professional guide', 'Entrance fees', 'Lunch', 'Hotel pickup and drop-off'],
    excludes: ['Drinks', 'Personal expenses'],
    itinerary: [
        { time: '09:00', description: 'Hotel Pickup' },
        { time: '09:30', description: 'Visit Goreme Open-Air Museum' },
        { time: '11:00', description: 'Explore Uchisar Castle' },
        { time: '12:30', description: 'Lunch at local restaurant' },
        { time: '14:00', description: 'Visit Pasabag (Monks Valley)' },
        { time: '15:30', description: 'Pottery workshop in Avanos' },
        { time: '16:30', description: 'Return to hotel' }
    ],
    image_url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    destination_name: 'Pamukkale',
    title: 'Pamukkale & Hierapolis Full-Day Tour',
    description: 'Visit the Cotton Castle of Pamukkale and explore the ancient city of Hierapolis. Walk on the travertine terraces and enjoy the thermal pools.',
    price: '85.00',
    duration: 8,
    includes: ['Professional guide', 'Entrance fees', 'Lunch', 'Hotel pickup and drop-off'],
    excludes: ['Drinks', 'Personal expenses'],
    itinerary: [
        { time: '08:00', description: 'Hotel Pickup' },
        { time: '10:00', description: 'Arrive at Pamukkale' },
        { time: '10:30', description: 'Walk on travertine terraces' },
        { time: '12:00', description: 'Explore Hierapolis ancient city' },
        { time: '13:00', description: 'Lunch at local restaurant' },
        { time: '14:30', description: 'Free time at thermal pools' },
        { time: '16:00', description: 'Return journey' },
        { time: '18:00', description: 'Return to hotel' }
    ],
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }
];

const cleanDatabase = async () => {
  console.log('Cleaning existing data...');
  try {
    await pool.query('DELETE FROM tours');
    await pool.query('DELETE FROM destinations');
    console.log('Database cleaned!');
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  }
};

const seedDestinations = async () => {
  console.log('Seeding destinations...');
  try {
    for (const dest of destinations) {
      await pool.query(
        'INSERT INTO destinations (name, country, city, description, image_url, featured) VALUES ($1, $2, $3, $4, $5, $6)',
        [dest.name, dest.country, dest.city, dest.description, dest.image_url, dest.featured]
      );
      console.log(`✅ Inserted destination: ${dest.name}`);
    }
    console.log('Destinations seeded successfully!');
  } catch (error) {
    console.error('Error seeding destinations:', error);
    throw error;
  }
};

const seedTours = async () => {
  console.log('Seeding tours...');
  try {
    const destRes = await pool.query('SELECT id, name FROM destinations');
    const destMap = destRes.rows.reduce((acc, row) => {
      acc[row.name] = row.id;
      return acc;
    }, {});
    
    console.log('Available destinations:', Object.keys(destMap));

    for (const tour of tours) {
      const destination_id = destMap[tour.destination_name];
      if (destination_id) {
        await pool.query(
          `INSERT INTO tours (destination_id, title, description, price, duration, includes, excludes, itinerary, image_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [destination_id, tour.title, tour.description, tour.price, tour.duration, tour.includes, tour.excludes, JSON.stringify(tour.itinerary), tour.image_url]
        );
        console.log(`✅ Inserted tour: ${tour.title}`);
      } else {
        console.log(`❌ No destination found for tour: ${tour.title} (${tour.destination_name})`);
      }
    }
    console.log('Tours seeded successfully!');
  } catch (error) {
    console.error('Error seeding tours:', error);
    throw error;
  }
};

const seedAll = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    await cleanDatabase();
    await seedDestinations();
    await seedTours();
    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('Connection closed.');
  }
};

console.log('🔧 Script started...');
seedAll().then(() => {
  console.log('🎉 Script finished successfully.');
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
