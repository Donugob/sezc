import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const { email } = parsed.data;

    const existingRegistrations = await prisma.registration.findMany({
      where: { email },
      include: { ticketTier: true },
      orderBy: { createdAt: 'desc' }
    });

    if (existingRegistrations.length === 0) {
      return NextResponse.json({ status: 'NONE' });
    }

    // Check if any are successful
    const successful = existingRegistrations.find(r => r.paymentStatus === 'SUCCESS');
    if (successful) {
      return NextResponse.json({ status: 'SUCCESS', name: successful.fullName, tierName: successful.ticketTier.name });
    }

    // Otherwise, there is a pending registration
    const pending = existingRegistrations.find(r => r.paymentStatus === 'PENDING');
    if (pending) {
      return NextResponse.json({ 
        status: 'PENDING', 
        id: pending.id,
        name: pending.fullName, 
        tierName: pending.ticketTier.name 
      });
    }

    return NextResponse.json({ status: 'NONE' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
