import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tiers = await prisma.ticketTier.findMany({
      where: { isOpen: true },
      orderBy: { price: 'asc' },
    });
    return NextResponse.json({ tiers });
  } catch (error) {
    console.error('Failed to fetch ticket tiers:', error);
    return NextResponse.json({ tiers: [] });
  }
}
