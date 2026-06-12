import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { initializePaystackTransaction, generatePaystackReference } from '@/lib/paystack';
import { generateTicketNumber, generateQrCodePayload, isSoldOut } from '@/lib/utils';
import { z } from 'zod';

const registrationSchema = z.object({
  fullName:     z.string().min(3, 'Full name must be at least 3 characters'),
  email:        z.string().email('Invalid email address'),
  phone:        z.string().regex(/^(\+234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone number'),
  institution:  z.string().min(2, 'Institution is required'),
  ticketTierId: z.string().cuid('Invalid ticket tier'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate input
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { fullName, email, phone, institution, ticketTierId } = parsed.data;

    // 2. Fetch and validate ticket tier
    const tier = await prisma.ticketTier.findUnique({ where: { id: ticketTierId } });

    if (!tier || !tier.isOpen) {
      return NextResponse.json({ error: 'This ticket tier is not available.' }, { status: 400 });
    }

    if (isSoldOut(tier.capacity, tier.sold)) {
      return NextResponse.json({ error: 'Sorry, this ticket tier is sold out.' }, { status: 400 });
    }

    // 3. Generate ticket number
    const totalRegistrations = await prisma.registration.count();
    const ticketNumber = generateTicketNumber(totalRegistrations + 1);

    // 4. Generate Paystack reference
    const paystackReference = generatePaystackReference(ticketNumber);

    // 5. Generate QR code data payload
    const qrCodeData = generateQrCodePayload({
      ticketNumber,
      fullName,
      ticketTierName: tier.name,
      registrationId: 'pending', // will be updated after creation
    });

    // 6. Create pending registration record
    const registration = await prisma.registration.create({
      data: {
        ticketNumber,
        fullName,
        email,
        phone,
        institution,
        ticketTierId,
        paymentStatus: 'PENDING',
        paystackReference,
        paystackAmount: tier.price,
        qrCodeData,
      },
    });

    // 7. Initialize Paystack transaction
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/register/success?ref=${paystackReference}`;

    const paystack = await initializePaystackTransaction({
      email,
      amount: tier.price,
      reference: paystackReference,
      callbackUrl,
      metadata: {
        registrationId: registration.id,
        ticketNumber,
        fullName,
        institution,
        tierName: tier.name,
      },
    });

    return NextResponse.json({ authorizationUrl: paystack.authorization_url });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
