import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
  console.log('Testing DB connection...');
  const users = await prisma.adminUser.findMany();
  console.log('Users found:', users.length);
  console.log(users[0]?.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
