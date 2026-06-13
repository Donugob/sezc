// Force Node.js to globally accept self-signed certificates for this pooler connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Parse the DATABASE_URL and strip any SSL-related query params
const url = new URL(process.env.DATABASE_URL || '');
url.searchParams.delete('sslmode');
url.searchParams.delete('sslaccept');

// Explicitly configure pg Pool with rejectUnauthorized: false and limit connections
const pool = new Pool({
  connectionString: url.toString(),
  max: 1, // Strict limit of 1 connection per serverless lambda to prevent Supabase free tier exhaustion
  connectionTimeoutMillis: 5000, // Fail fast on hanging connections
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool);

// Use a brand new cache key to force Next.js to drop any old broken connection pools
const globalForPrisma = globalThis as unknown as { prisma_v5: PrismaClient };

export const prisma = globalForPrisma.prisma_v5 || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_v5 = prisma;
