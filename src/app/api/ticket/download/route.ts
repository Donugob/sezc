import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import { generatePdfTicket } from '@/lib/ticket';

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

    if (!registration || registration.paymentStatus !== 'SUCCESS') {
      return NextResponse.json({ error: 'Ticket not available' }, { status: 404 });
    }

    // 1. Generate QR code as high-res data URL pointing to verification page
    const verificationUrl = `${req.nextUrl.origin}/verify?ticket=${registration.ticketNumber}`;
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 1000, // High-res for crisp printing
      margin: 2,
      color: {
        dark: '#0a1628',
        light: '#ffffff',
      },
    });

    // 2. Generate PDF
    const pdfBytes = await generatePdfTicket(registration, qrDataUrl);

    // 3. Return as PDF file
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="SEZC-2026-Ticket-${registration.ticketNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Ticket download error:', error);
    return NextResponse.json({ error: 'Failed to generate ticket' }, { status: 500 });
  }
}
