// ============================================================
// Paystack utility helpers
// ============================================================

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * Initialize a Paystack transaction.
 * Returns the authorization URL to redirect the user to.
 */
export async function initializePaystackTransaction({
  email,
  amount, // in Kobo
  reference,
  metadata,
  callbackUrl,
}: {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
  callbackUrl: string;
}) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount,
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Paystack initialization failed: ${error.message}`);
  }

  const data = await response.json();
  return data.data as {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

/**
 * Verify a Paystack transaction by reference.
 */
export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to verify transaction with Paystack');
  }

  const data = await response.json();
  return data.data as {
    status: string; // 'success' | 'failed' | 'abandoned'
    reference: string;
    amount: number;
    customer: { email: string };
  };
}

/**
 * Verify a Paystack webhook signature.
 * Prevents fraudulent webhook calls.
 */
export async function verifyPaystackWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const { createHmac } = await import('crypto');
  const hash = createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');
  return hash === signature;
}

/**
 * Convert Kobo to Naira (for display purposes).
 */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

/**
 * Format a Naira amount for display.
 */
export function formatNaira(kobo: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(koboToNaira(kobo));
}

/**
 * Generate a unique Paystack reference string.
 */
export function generatePaystackReference(ticketNumber: string): string {
  const timestamp = Date.now();
  return `SEZC-2026-${ticketNumber}-${timestamp}`;
}
