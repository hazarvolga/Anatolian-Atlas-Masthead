import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database seeding...');

  // 1. Clean the database
  console.log('🧹 Cleaning existing data...');
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.tour.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Database cleaned!');

  // 2. Create Admin User
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('1872017', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'hazarvolga@gmail.com',
      password_hash: hashedPassword,
      role: 'admin',
      first_name: 'Hazar',
      last_name: 'Admin',
      email_verified: true,
      is_active: true,
    },
  });
  console.log(`✅ Admin user created: ${adminUser.email}`);

  // 3. Create Categories
  console.log('📚 Creating categories...');
  const cultural = await prisma.category.create({ data: { name: 'Cultural', slug: 'cultural' } });
  const adventure = await prisma.category.create({ data: { name: 'Adventure', slug: 'adventure' } });
  const culinary = await prisma.category.create({ data: { name: 'Culinary', slug: 'culinary' } });
  console.log('✅ Categories created!');

  // 4. Create Destinations
  console.log('🌍 Creating destinations...');
  const istanbul = await prisma.destination.create({
    data: {
      name: 'Istanbul',
      slug: 'istanbul',
      country_id: 'TR', // Assuming a convention for country codes
      city_id: '34',
      description: 'The city that straddles two continents, offering a rich history, vibrant culture, and stunning architecture.',
      featured: true,
    },
  });
  const cappadocia = await prisma.destination.create({
    data: {
      name: 'Cappadocia',
      slug: 'cappadocia',
      country_id: 'TR',
      city_id: '50',
      description: 'Famous for its unique "fairy chimneys," ancient cave dwellings, and breathtaking hot air balloon rides at sunrise.',
      featured: true,
    },
  });
  console.log('✅ Destinations created!');

  // 5. Create Tours
  console.log('✈️ Creating tours...');
  await prisma.tour.create({
    data: {
      title: 'Istanbul Classics: Full-Day Tour',
      slug: 'istanbul-classics-full-day-tour',
      description: 'Discover the timeless sights of Istanbul in one day. Visit the Blue Mosque, Hagia Sophia, Topkapi Palace, and the Grand Bazaar.',
      short_description: 'A whirlwind tour of Istanbul\'s most iconic landmarks.',
      status: 'active',
      duration_hours: 8,
      max_participants: 15,
      price_adult: 95.00,
      price_child: 45.00,
      includes: ['Professional guide', 'Entrance fees', 'Lunch', 'Hotel pickup and drop-off'],
      excludes: ['Drinks', 'Personal expenses', 'Tips'],
      images: ['https://images.unsplash.com/photo-1583422409516-2895a7dba5f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
      category: { connect: { id: cultural.id } },
      destination: { connect: { id: istanbul.id } },
      guide: { connect: { id: adminUser.id } },
    },
  });

  await prisma.tour.create({
    data: {
      title: 'Sunrise Hot Air Balloon Flight',
      slug: 'cappadocia-sunrise-hot-air-balloon-flight',
      description: 'Experience the magic of Cappadocia from above with a one-hour hot air balloon flight at sunrise. Includes a champagne toast upon landing.',
      short_description: 'An unforgettable ballooning adventure over fairy chimneys.',
      status: 'active',
      duration_hours: 3,
      max_participants: 20,
      price_adult: 250.00,
      price_child: 150.00,
      includes: ['1-hour balloon flight', 'Hotel pickup and drop-off', 'Champagne toast', 'Flight certificate'],
      excludes: ['Breakfast'],
      images: ['https://images.unsplash.com/photo-1532403431143-9ab41e2134a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
      featured: true,
      category: { connect: { id: adventure.id } },
      destination: { connect: { id: cappadocia.id } },
      guide: { connect: { id: adminUser.id } },
    },
  });
  console.log('✅ Tours created!');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('💥 Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
