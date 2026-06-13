import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { initializePaystackTransaction, generatePaystackReference } from '@/lib/paystack';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { registrationId } = body;

    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID required' }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { ticketTier: true },
    });

    if (!registration || registration.paymentStatus === 'SUCCESS') {
      return NextResponse.json({ error: 'Valid pending registration not found' }, { status: 404 });
    }

    // Generate a fresh Paystack Reference just in case the old one is stale
    const freshReference = generatePaystackReference(registration.ticketNumber);

    // Update the record with the new reference
    await prisma.registration.update({
      where: { id: registration.id },
      data: { paystackReference: freshReference }
    });

    // Re-initialize Paystack
    const callbackUrl = `${req.nextUrl.origin}/register/success?ref=${freshReference}`;

    const paystack = await initializePaystackTransaction({
      email: registration.email,
      amount: registration.ticketTier.price,
      reference: freshReference,
      callbackUrl,
      metadata: {
        registrationId: registration.id,
        ticketNumber: registration.ticketNumber,
        fullName: registration.fullName,
        institution: registration.institution,
        tierName: registration.ticketTier.name,
      },
    });

    return NextResponse.json({ authorizationUrl: paystack.authorization_url });
  } catch (error) {
    console.error('Resume error:', error);
    return NextResponse.json({ error: 'Failed to resume payment' }, { status: 500 });
  }
}
