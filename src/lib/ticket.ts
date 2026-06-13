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
export async function generateAndSendTicket(registrationId: string, origin: string): Promise<void> {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { ticketTier: true },
  });

  if (!registration || registration.paymentStatus !== 'SUCCESS') {
    throw new Error(`Cannot generate ticket for registration ${registrationId} — not yet successful.`);
  }

  // 1. Generate QR code as high-res data URL pointing to verification page
  const verificationUrl = `${origin}/verify?ticket=${registration.ticketNumber}`;
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

  // 3. Send email with PDF attachment
  await sendTicketEmail(registration, pdfBytes);
}

export async function generatePdfTicket(
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
  // A5 Landscape Boarding Pass Aesthetic
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [148, 210] });

  // ----------------------------------------------------
  // LEFT ZONE (Attendee Info) - 70% Width
  // ----------------------------------------------------
  doc.setFillColor(255, 255, 255); // Crisp White
  doc.rect(0, 0, 140, 148, 'F');

  // Brand Header
  doc.setTextColor(10, 22, 40); // Navy 900
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('SEZC 2026', 15, 25);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('SOUTH EAST ZONAL CONVENTION', 16, 32);
  doc.text('REDEFINING LEGAL PRACTICE', 16, 36);

  // Divider Line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(15, 45, 125, 45);

  // Attendee Info
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text('DELEGATE NAME', 15, 60);
  
  doc.setTextColor(10, 22, 40);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(registration.fullName.toUpperCase(), 15, 70);

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('INSTITUTION', 15, 82);

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(registration.institution.toUpperCase(), 15, 88);

  // Ticket Data Grid
  const gridY = 110;
  
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('TICKET TIER', 15, gridY);
  doc.text('ISSUE DATE', 60, gridY);
  doc.text('AMOUNT PAID', 95, gridY);

  doc.setTextColor(10, 22, 40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(registration.ticketTier.name.toUpperCase(), 15, gridY + 6);
  doc.text(formatDate(registration.createdAt).split('T')[0], 60, gridY + 6);
  
  // Use NGN instead of ₦ because jsPDF default helvetica font doesn't support unicode
  const amountStr = `NGN ${(registration.ticketTier.price / 100).toLocaleString()}`;
  doc.text(amountStr, 95, gridY + 6);

  // ----------------------------------------------------
  // RIGHT ZONE (Verification) - 30% Width
  // ----------------------------------------------------
  doc.setFillColor(10, 22, 40); // Navy 900
  doc.rect(140, 0, 70, 148, 'F');

  // Gold accent strip separating the zones
  doc.setFillColor(212, 168, 50); // Gold
  doc.rect(139, 0, 2, 148, 'F');

  // Add QR Code
  // Size: 50x50 mm
  doc.addImage(qrDataUrl, 'PNG', 150, 30, 50, 50);

  // Verification text below QR
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(registration.ticketNumber, 175, 90, { align: 'center' });

  doc.setTextColor(168, 189, 224);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('AUTHORIZATION MATRIX', 175, 100, { align: 'center' });
  doc.text('SCAN FOR ENTRY', 175, 105, { align: 'center' });

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

  // Professional, strictly tabular HTML template for bulletproof email client rendering
  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SEZC 2026 Registration</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F9FC; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F9FC; padding: 40px 0;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #0A1628; padding: 40px 20px;">
              <h1 style="color: #D4A832; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">SEZC 2026</h1>
              <p style="color: #A8BDE0; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 0.5px;">SOUTH EAST ZONAL CONVENTION</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <h2 style="color: #0A1628; font-size: 22px; font-weight: 600; margin: 0 0 16px 0;">Registration Confirmed, ${firstName}.</h2>
              <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Your attendance for the South East Zonal Convention 2026 in Owerri is officially secured. Please find your delegate pass attached to this email.
              </p>

              <!-- Ticket Details Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 8px 0; color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">DELEGATE DETAILS</p>
                    <p style="margin: 0 0 16px 0; color: #1A202C; font-size: 18px; font-weight: 700;">${registration.fullName}</p>
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="50%">
                          <p style="margin: 0 0 4px 0; color: #718096; font-size: 12px; text-transform: uppercase;">TICKET NUMBER</p>
                          <p style="margin: 0; color: #1A202C; font-size: 15px; font-weight: 600;">${registration.ticketNumber}</p>
                        </td>
                        <td width="50%">
                          <p style="margin: 0 0 4px 0; color: #718096; font-size: 12px; text-transform: uppercase;">TIER</p>
                          <p style="margin: 0; color: #1A202C; font-size: 15px; font-weight: 600;">${registration.ticketTier.name}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #4A5568; font-size: 15px; line-height: 1.6; margin: 32px 0 0 0;">
                <strong>Instructions for Entry:</strong><br>
                Please download and present the attached PDF ticket upon arrival at the venue. The QR code must be scanned by security personnel for admission.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #F7F9FC; border-top: 1px solid #EDF2F7;">
              <p style="color: #A0AEC0; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                LAWSAN South East Zonal Directorate<br>
                Owerri, Nigeria<br><br>
                For support, reply to this email or contact <a href="mailto:support@lawsansoutheast.org" style="color: #3182CE; text-decoration: none;">support@lawsansoutheast.org</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: registration.email,
    subject: `SEZC 2026 Delegate Pass — ${registration.ticketNumber}`,
    html: emailHtml,
    attachments: [
      {
        filename: `SEZC-2026-Ticket-${registration.ticketNumber}.pdf`,
        content: Buffer.from(pdfBytes),
      },
    ],
  });
}
