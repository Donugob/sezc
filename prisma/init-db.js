import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('Connecting to Supabase via PG pool...');
  const client = await pool.connect();

  try {
    console.log('Creating ENUMs...');
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('Creating Tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ticket_tiers" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "price" INTEGER NOT NULL,
        "capacity" INTEGER,
        "sold" INTEGER NOT NULL DEFAULT 0,
        "isOpen" BOOLEAN NOT NULL DEFAULT false,
        "perks" TEXT[],
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ticket_tiers_pkey" PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "registrations" (
        "id" TEXT NOT NULL,
        "ticketNumber" TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "institution" TEXT NOT NULL,
        "ticketTierId" TEXT NOT NULL,
        "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
        "paystackReference" TEXT NOT NULL,
        "paystackAmount" INTEGER NOT NULL,
        "qrCodeData" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
      );

      DO $$ BEGIN
        ALTER TABLE "registrations" ADD CONSTRAINT "registrations_ticketTierId_fkey" FOREIGN KEY ("ticketTierId") REFERENCES "ticket_tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      CREATE UNIQUE INDEX IF NOT EXISTS "registrations_ticketNumber_key" ON "registrations"("ticketNumber");
      CREATE UNIQUE INDEX IF NOT EXISTS "registrations_paystackReference_key" ON "registrations"("paystackReference");
      CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_email_key" ON "admin_users"("email");
    `);

    console.log('Seeding Database...');

    // Seed Admin
    const adminEmail = 'admin@lawsansoutheast.org';
    const adminRes = await client.query('SELECT * FROM "admin_users" WHERE email = $1', [adminEmail]);
    if (adminRes.rows.length === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO "admin_users" (id, email, name, "passwordHash") VALUES ($1, $2, $3, $4)',
        ['admin_1', adminEmail, 'Super Admin', passwordHash]
      );
      console.log('✅ Admin user created');
    }

    // Seed Tiers
    const defaultTiers = [
      {
        id: 'tier_reg_symp',
        name: 'Regular Symposium',
        description: 'Standard access to the SEZC 2026 Legal Symposium.',
        price: 200000,
        capacity: null,
        isOpen: true,
        perks: ['Symposium Entry', 'Standard Seating', 'Notepad & Pen'],
      },
      {
        id: 'tier_vip_symp',
        name: 'VIP Symposium',
        description: 'Premium access to the SEZC 2026 Legal Symposium.',
        price: 1000000,
        capacity: 50,
        isOpen: true,
        perks: ['Front Row Seating', 'VIP Lounge Access', 'Exclusive Materials'],
      },
      {
        id: 'tier_reg_din',
        name: 'Regular Dinner',
        description: 'Standard entry to the SEZC 2026 Gala Dinner.',
        price: 500000,
        capacity: null,
        isOpen: true,
        perks: ['Gala Entry', '3-Course Meal'],
      },
      {
        id: 'tier_vip_din',
        name: 'VIP Dinner',
        description: 'Exclusive entry to the SEZC 2026 Gala Dinner.',
        price: 1500000,
        capacity: 50,
        isOpen: true,
        perks: ['Gala Entry', 'Premium 3-Course Meal', 'Wine & Champagne', 'VIP Red Carpet'],
      },
    ];

    for (const tier of defaultTiers) {
      const exists = await client.query('SELECT * FROM "ticket_tiers" WHERE name = $1', [tier.name]);
      if (exists.rows.length === 0) {
        await client.query(
          'INSERT INTO "ticket_tiers" (id, name, description, price, capacity, "isOpen", perks) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [tier.id, tier.name, tier.description, tier.price, tier.capacity, tier.isOpen, tier.perks]
        );
        console.log(`✅ Tier created: ${tier.name}`);
      }
    }

    console.log('🎉 Setup finished.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
