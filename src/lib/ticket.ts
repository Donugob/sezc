import { prisma } from '@/lib/prisma';
import { formatNaira } from '@/lib/paystack';
import { formatDate } from '@/lib/utils';
import QRCode from 'qrcode';
import { Resend } from 'resend';
import { jsPDF } from 'jspdf';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Main entry point: generates a PDF ticket and emails it to the attendee.
 */
export async function generateAndSendTicket(registrationId: string): Promise<void> {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { ticketTier: true },
  });

  if (!registration || registration.paymentStatus !== 'SUCCESS') {
    throw new Error(`Cannot generate ticket for registration ${registrationId} — not yet successful.`);
  }

  // 1. Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(registration.qrCodeData, {
    width: 200,
    margin: 2,
    color: {
      dark: '#0a1628',
      light: '#fdf6e3',
    },
  });

  // 2. Generate PDF
  const pdfBytes = await generatePdfTicket(registration, qrDataUrl);

  // 3. Send email with PDF attachment
  await sendTicketEmail(registration, pdfBytes);
}

async function generatePdfTicket(
  registration: {
    ticketNumber: string;
    fullName: string;
    email: string;
    institution: string;
    createdAt: Date;
    ticketTier: { name: string; price: number; perks: string[] };
  },
  qrDataUrl: string
): Promise<Uint8Array> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [148, 210] });

  // Background
  doc.setFillColor(10, 22, 40); // navy-900
  doc.rect(0, 0, 210, 148, 'F');

  // Gold accent bar
  doc.setFillColor(212, 168, 50);
  doc.rect(0, 0, 8, 148, 'F');

  // Event branding
  doc.setTextColor(212, 168, 50);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SEZC 2026', 20, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(168, 189, 224);
  doc.text('South East Zonal Convention', 20, 30);
  doc.text('Redefining Legal Practice | Owerri', 20, 36);

  // Divider
  doc.setDrawColor(212, 168, 50, 0.4);
  doc.setLineWidth(0.3);
  doc.line(20, 42, 135, 42);

  // Ticket tier
  doc.setTextColor(212, 168, 50);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(registration.ticketTier.name.toUpperCase(), 20, 54);

  // Attendee name
  doc.setTextColor(240, 244, 255);
  doc.setFontSize(20);
  doc.text(registration.fullName, 20, 66);

  // Institution
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(168, 189, 224);
  doc.text(registration.institution, 20, 74);

  // Details grid
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

  // QR Code
  doc.addImage(qrDataUrl, 'PNG', 155, 20, 40, 40);
  doc.setFontSize(7);
  doc.setTextColor(100, 122, 168);
  doc.setFont('helvetica', 'normal');
  doc.text('Scan for verification', 157, 63);

  // Footer
  doc.setFillColor(15, 32, 64);
  doc.rect(0, 132, 210, 16, 'F');
  doc.setTextColor(100, 122, 168);
  doc.setFontSize(8);
  doc.text(
    'This ticket is your entry pass to SEZC 2026. Please present it at the registration desk.',
    20,
    141
  );

  return doc.output('arraybuffer') as unknown as Uint8Array;
}

async function sendTicketEmail(
  registration: {
    fullName: string;
    email: string;
    ticketNumber: string;
    ticketTier: { name: string };
  },
  pdfBytes: Uint8Array
): Promise<void> {
  const firstName = registration.fullName.split(' ')[0];

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: registration.email,
    subject: `Your SEZC 2026 Ticket — ${registration.ticketNumber}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #0a1628; color: #f0f4ff; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #d4a832; font-size: 28px; margin: 0;">⚖ SEZC 2026</h1>
          <p style="color: #a8bde0; margin: 8px 0 0;">Redefining Legal Practice | Owerri</p>
        </div>

        <h2 style="color: #f0f4ff; font-size: 22px;">You're registered, ${firstName}! 🎉</h2>
        <p style="color: #a8bde0; line-height: 1.7;">
          Congratulations! Your registration for the <strong style="color: #d4a832;">South East Zonal Convention 2026</strong>
          has been confirmed. Your delegate pass is attached to this email as a PDF.
        </p>

        <div style="background: rgba(21,45,88,0.5); border: 1px solid rgba(212,168,50,0.2); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px; color: #a8bde0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em;">Ticket Details</p>
          <p style="margin: 0 0 6px; font-size: 18px; font-weight: 700; color: #f0f4ff;">${registration.fullName}</p>
          <p style="margin: 0 0 4px; color: #a8bde0; font-size: 14px;">Ticket: <strong style="color: #d4a832;">${registration.ticketNumber}</strong></p>
          <p style="margin: 0; color: #a8bde0; font-size: 14px;">Tier: <strong style="color: #f0f4ff;">${registration.ticketTier.name}</strong></p>
        </div>

        <p style="color: #a8bde0; line-height: 1.7; font-size: 14px;">
          Please bring your PDF ticket (printed or on your phone) to the convention check-in desk. 
          The QR code on your ticket will be scanned for entry.
        </p>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(168,189,224,0.1);">
          <p style="color: #637ba8; font-size: 12px; margin: 0;">
            LAWSAN South East Zonal Directorate | SEZC 2026, Owerri<br/>
            Questions? Reply to this email or contact us at sezc2026@lawsansoutheast.org
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `SEZC-2026-Ticket-${registration.ticketNumber}.pdf`,
        content: Buffer.from(pdfBytes),
      },
    ],
  });
}
