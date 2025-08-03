import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create basic roles
  const roles = [
    { name: 'admin', description: 'Full system access', permissions: JSON.stringify(['*']) },
    { name: 'guide', description: 'Tour guide access', permissions: JSON.stringify(['tours:read', 'reservations:read']) },
    { name: 'user', description: 'Regular user access', permissions: JSON.stringify(['profile:read', 'profile:write', 'reservations:read']) },
  ];

  for (const roleData of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: roleData.name }
    });

    if (!existingRole) {
      await prisma.role.create({
        data: roleData
      });
      console.log(`✅ Created role: ${roleData.name}`);
    } else {
      console.log(`⏭️  Role already exists: ${roleData.name}`);
    }
  }

  // Create sample categories
  const categories = [
    { name: 'Historical Tours', slug: 'historical-tours', description: 'Explore ancient history and cultural heritage' },
    { name: 'Adventure Tours', slug: 'adventure-tours', description: 'Exciting outdoor activities and sports' },
    { name: 'City Tours', slug: 'city-tours', description: 'Urban exploration and city highlights' },
    { name: 'Nature Tours', slug: 'nature-tours', description: 'Beautiful landscapes and natural wonders' },
  ];

  for (const categoryData of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: categoryData.slug }
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: categoryData
      });
      console.log(`✅ Created category: ${categoryData.name}`);
    } else {
      console.log(`⏭️  Category already exists: ${categoryData.name}`);
    }
  }

  // Create sample destinations
  const destinations = [
    {
      name: 'Istanbul',
      slug: 'istanbul',
      country_id: 'TR',
      country: 'Turkey',
      city: 'Istanbul',
      description: 'The cultural and historical heart of Turkey',
      short_description: 'Historic city bridging Europe and Asia',
      featured: true,
      is_active: true,
    },
    {
      name: 'Cappadocia',
      slug: 'cappadocia',
      country_id: 'TR',
      country: 'Turkey',
      city: 'Nevşehir',
      description: 'Famous for fairy chimneys, cave dwellings, and hot air balloons',
      short_description: 'Unique landscape with fairy chimneys',
      featured: true,
      is_active: true,
    },
    {
      name: 'Pamukkale',
      slug: 'pamukkale',
      country_id: 'TR',
      country: 'Turkey',
      city: 'Denizli',
      description: 'Natural thermal pools and ancient Hierapolis ruins',
      short_description: 'Cotton castle with thermal pools',
      featured: true,
      is_active: true,
    },
  ];

  for (const destinationData of destinations) {
    const existingDestination = await prisma.destination.findUnique({
      where: { slug: destinationData.slug }
    });

    if (!existingDestination) {
      await prisma.destination.create({
        data: destinationData
      });
      console.log(`✅ Created destination: ${destinationData.name}`);
    } else {
      console.log(`⏭️  Destination already exists: ${destinationData.name}`);
    }
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
