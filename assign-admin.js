import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignAdminRole() {
  console.log('🔧 Assigning admin role to existing user...');

  try {
    // Find the admin role
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' }
    });

    if (!adminRole) {
      console.error('❌ Admin role not found');
      return;
    }

    // Find the existing user
    const user = await prisma.user.findUnique({
      where: { email: 'hazarvolga@gmail.com' }
    });

    if (!user) {
      console.error('❌ User not found');
      return;
    }

    // Check if user already has admin role
    const existingUserRole = await prisma.userRole.findFirst({
      where: {
        user_id: user.id,
        role_id: adminRole.id
      }
    });

    if (existingUserRole) {
      console.log('⏭️  User already has admin role');
      return;
    }

    // Assign admin role
    await prisma.userRole.create({
      data: {
        user_id: user.id,
        role_id: adminRole.id
      }
    });

    console.log('✅ Admin role assigned successfully!');
  } catch (error) {
    console.error('❌ Error assigning admin role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignAdminRole();
