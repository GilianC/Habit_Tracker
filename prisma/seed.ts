import prisma from '@/app/lib/prisma';

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Insertion des badges par défaut
    console.log('📛 Creating default badges...');
    const badges = await prisma.badge.createMany({
      data: [
        {
          title: 'Premier pas',
          description: 'Première habitude créée',
          conditionType: 'activities_created',
          conditionValue: 1,
          icon: '🌟',
        },
        {
          title: 'Régularité',
          description: '7 jours consécutifs',
          conditionType: 'streak',
          conditionValue: 7,
          icon: '🔥',
        },
        {
          title: 'Persévérance',
          description: '30 jours consécutifs',
          conditionType: 'streak',
          conditionValue: 30,
          icon: '💪',
        },
        {
          title: 'Champion',
          description: '100 habitudes complétées',
          conditionType: 'total_completed',
          conditionValue: 100,
          icon: '🏆',
        },
        {
          title: 'Marathonien',
          description: "365 jours d'activité",
          conditionType: 'days_active',
          conditionValue: 365,
          icon: '🎯',
        },
      ],
      skipDuplicates: true,
    });
    console.log(`✅ Created ${badges.count} badges`);

    // Création d'un utilisateur admin par défaut
    console.log('👤 Creating default admin user...');
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@habittracker.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@habittracker.com',
        // Password: admin123 (hashed with bcrypt)
        passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'admin',
      },
    });
    console.log(`✅ Admin user created: ${adminUser.email}`);

    // Création d'un utilisateur de test
    console.log('👤 Creating test user...');
    const testUser = await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        name: 'Test User',
        email: 'user@test.com',
        // Password: password123
        passwordHash: '$2b$10$YourHashedPasswordHere',
        role: 'user',
      },
    });
    console.log(`✅ Test user created: ${testUser.email}`);

    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
