// ============================================================
// General utility helpers
// ============================================================

/**
 * Generate a sequential, human-readable ticket number.
 * e.g. SEZC-2026-0001
 */
export function generateTicketNumber(sequenceNumber: number): string {
  const padded = String(sequenceNumber).padStart(4, '0');
  return `SEZC-2026-${padded}`;
}

/**
 * Generate the QR code payload for a registration.
 * This data is embedded in the QR code on the PDF ticket.
 */
export function generateQrCodePayload(data: {
  ticketNumber: string;
  fullName: string;
  ticketTierName: string;
  registrationId: string;
}): string {
  return JSON.stringify({
    id: data.registrationId,
    ticket: data.ticketNumber,
    name: data.fullName,
    tier: data.ticketTierName,
    event: 'SEZC-2026',
    issued: new Date().toISOString(),
  });
}

/**
 * Format a date for display.
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

/**
 * Delay utility for async flows.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a ticket tier is sold out.
 */
export function isSoldOut(capacity: number | null, sold: number): boolean {
  if (capacity === null) return false;
  return sold >= capacity;
}

/**
 * Get remaining tickets for a tier.
 */
export function getRemainingTickets(
  capacity: number | null,
  sold: number
): number | null {
  if (capacity === null) return null;
  return Math.max(0, capacity - sold);
}
