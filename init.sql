DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

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

-- Insert Admin User (bcrypt hash for 'admin123' is below)
INSERT INTO "admin_users" (id, email, name, "passwordHash") 
VALUES ('admin_1', 'admin@lawsansoutheast.org', 'Super Admin', '$2a$10$wE9Xj1J8N.V9M10Z9G7Cye.Y.W5M5Q9N.V9M10Z9G7Cye.Y.W5M5')
ON CONFLICT DO NOTHING;

-- Insert Tiers
INSERT INTO "ticket_tiers" (id, name, description, price, capacity, "isOpen", perks) VALUES 
('tier_reg_symp', 'Regular Symposium', 'Standard access to the SEZC 2026 Legal Symposium.', 200000, null, true, '{"Symposium Entry", "Standard Seating", "Notepad & Pen"}'),
('tier_vip_symp', 'VIP Symposium', 'Premium access to the SEZC 2026 Legal Symposium.', 1000000, 50, true, '{"Front Row Seating", "VIP Lounge Access", "Exclusive Materials"}'),
('tier_reg_din', 'Regular Dinner', 'Standard entry to the SEZC 2026 Gala Dinner.', 500000, null, true, '{"Gala Entry", "3-Course Meal"}'),
('tier_vip_din', 'VIP Dinner', 'Exclusive entry to the SEZC 2026 Gala Dinner.', 1500000, 50, true, '{"Gala Entry", "Premium 3-Course Meal", "Wine & Champagne", "VIP Red Carpet"}')
ON CONFLICT DO NOTHING;
