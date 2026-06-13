import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { formatNaira } from '@/lib/paystack';
import { formatDate } from '@/lib/utils';

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

    // Re-generate the PDF on demand
    const qrDataUrl = await QRCode.toDataURL(registration.qrCodeData, {
      width: 200,
      margin: 2,
      color: { dark: '#0a1628', light: '#fdf6e3' },
    });

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [148, 210] });

    doc.setFillColor(10, 22, 40);
    doc.rect(0, 0, 210, 148, 'F');
    doc.setFillColor(212, 168, 50);
    doc.rect(0, 0, 8, 148, 'F');
    doc.setTextColor(212, 168, 50);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SEZC 2026', 20, 22);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(168, 189, 224);
    doc.text('South East Zonal Convention', 20, 30);
    doc.text('Redefining Legal Practice | Owerri', 20, 36);
    doc.setDrawColor(212, 168, 50);
    doc.setLineWidth(0.3);
    doc.line(20, 42, 135, 42);
    doc.setTextColor(212, 168, 50);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(registration.ticketTier.name.toUpperCase(), 20, 54);
    doc.setTextColor(240, 244, 255);
    doc.setFontSize(20);
    doc.text(registration.fullName, 20, 66);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(168, 189, 224);
    doc.text(registration.institution, 20, 74);
    const detailsY = 86;
    doc.setFontSize(8);
    doc.setTextColor(100, 122, 168);
    doc.text('TICKET NUMBER', 20, detailsY);
    doc.text('AMOUNT PAID', 70, detailsY);
    doc.text('ISSUED', 120, detailsY);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(240, 244, 255);
    doc.text(registration.ticketNumber, 20, detailsY + 6);
    doc.text(formatNaira(registration.ticketTier.price), 70, detailsY + 6);
    doc.text(formatDate(registration.createdAt), 120, detailsY + 6);
    doc.addImage(qrDataUrl, 'PNG', 155, 20, 40, 40);
    doc.setFontSize(7);
    doc.setTextColor(100, 122, 168);
    doc.setFont('helvetica', 'normal');
    doc.text('Scan for verification', 157, 63);
    doc.setFillColor(15, 32, 64);
    doc.rect(0, 132, 210, 16, 'F');
    doc.setTextColor(100, 122, 168);
    doc.setFontSize(8);
    doc.text('This ticket is your entry pass to SEZC 2026. Please present it at the registration desk.', 20, 141);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

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
