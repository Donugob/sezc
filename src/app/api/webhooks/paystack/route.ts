import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPaystackWebhookSignature } from '@/lib/paystack';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature') || '';

  // 1. Verify the webhook signature — security critical
  const isValid = await verifyPaystackWebhookSignature(rawBody, signature);
  if (!isValid) {
    console.warn('Invalid Paystack webhook signature received.');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // 2. Only handle charge.success events
  if (event.event !== 'charge.success') {
    return NextResponse.json({ received: true });
  }

  const { reference, amount } = event.data;

  try {
    // 3. Find the registration
    const registration = await prisma.registration.findUnique({
      where: { paystackReference: reference },
      include: { ticketTier: true },
    });

    if (!registration) {
      console.error(`Webhook: No registration found for reference ${reference}`);
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // 4. Avoid double-processing
    if (registration.paymentStatus === 'SUCCESS') {
      return NextResponse.json({ received: true, message: 'Already processed' });
    }

    // 5. Update registration to SUCCESS in a transaction
    await prisma.$transaction([
      prisma.registration.update({
        where: { id: registration.id },
        data: {
          paymentStatus: 'SUCCESS',
          paystackAmount: amount,
        },
      }),
      // Increment sold count on the tier
      prisma.ticketTier.update({
        where: { id: registration.ticketTierId },
        data: { sold: { increment: 1 } },
      }),
    ]);

    // 6. Trigger ticket generation and email (fire-and-forget)
    sendTicketEmail(registration.id).catch(console.error);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function sendTicketEmail(registrationId: string) {
  // Dynamically import to keep the webhook handler lean
  const { generateAndSendTicket } = await import('@/lib/ticket');
  await generateAndSendTicket(registrationId);
}
