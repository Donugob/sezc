import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref');

  if (!ref) {
    return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
  }

  try {
    const registration = await prisma.registration.findUnique({
      where: { paystackReference: ref },
      include: { ticketTier: true },
    });

    if (!registration) {
      return NextResponse.json({ status: 'NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({
      status: registration.paymentStatus,
      registration: {
        fullName: registration.fullName,
        ticketNumber: registration.ticketNumber,
        email: registration.email,
        tierName: registration.ticketTier.name,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
