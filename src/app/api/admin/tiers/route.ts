import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const tierSchema = z.object({
  name:        z.string().min(1),
  description: z.string().min(1),
  price:       z.number().int().positive(),
  capacity:    z.number().int().positive().nullable(),
  perks:       z.array(z.string()),
  isOpen:      z.boolean(),
});

export async function GET() {
  try {
    const tiers = await prisma.ticketTier.findMany({ orderBy: { price: 'asc' } });
    return NextResponse.json({ tiers });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = tierSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const tier = await prisma.ticketTier.create({ data: parsed.data });
    return NextResponse.json({ tier }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create tier' }, { status: 500 });
  }
}
