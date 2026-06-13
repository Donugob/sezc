import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Parse the DATABASE_URL and strip any SSL-related query params
const url = new URL(process.env.DATABASE_URL || '');
url.searchParams.delete('sslmode');
url.searchParams.delete('sslaccept');

// Explicitly configure pg Pool with rejectUnauthorized: false
const pool = new Pool({
  connectionString: url.toString(),
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool);

// Use a brand new cache key to force Next.js to drop any old broken connection pools
const globalForPrisma = globalThis as unknown as { prisma_v5: PrismaClient };

export const prisma = globalForPrisma.prisma_v5 || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_v5 = prisma;
