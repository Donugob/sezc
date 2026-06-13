import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Default Admin User
  const adminEmail = 'admin@lawsansoutheast.org';
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        passwordHash,
      },
    });
    console.log('✅ Admin user created: admin@lawsansoutheast.org / admin123');
  } else {
    console.log('ℹ️ Admin user already exists.');
  }

  // 2. Create Initial Ticket Tiers
  const defaultTiers = [
    {
      name: 'Regular Symposium',
      description: 'Standard access to the SEZC 2026 Legal Symposium.',
      price: 200000, // Kobo = N2,000
      capacity: null,
      isOpen: true,
      perks: ['Symposium Entry', 'Standard Seating', 'Notepad & Pen'],
    },
    {
      name: 'VIP Symposium',
      description: 'Premium access to the SEZC 2026 Legal Symposium.',
      price: 1000000, // Kobo = N10,000
      capacity: 50,
      isOpen: true,
      perks: ['Front Row Seating', 'VIP Lounge Access', 'Exclusive Materials'],
    },
    {
      name: 'Regular Dinner',
      description: 'Standard entry to the SEZC 2026 Gala Dinner.',
      price: 500000, // N5,000
      capacity: null,
      isOpen: true,
      perks: ['Gala Entry', '3-Course Meal'],
    },
    {
      name: 'VIP Dinner',
      description: 'Exclusive entry to the SEZC 2026 Gala Dinner.',
      price: 1500000, // N15,000
      capacity: 50,
      isOpen: true,
      perks: ['Gala Entry', 'Premium 3-Course Meal', 'Wine & Champagne', 'VIP Red Carpet'],
    },
  ];

  for (const tier of defaultTiers) {
    const exists = await prisma.ticketTier.findFirst({ where: { name: tier.name } });
    if (!exists) {
      await prisma.ticketTier.create({ data: tier });
      console.log(`✅ Tier created: ${tier.name}`);
    }
  }

  console.log('🎉 Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
