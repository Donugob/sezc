// ============================================================
// SEZC 2026 — Core Types
// ============================================================

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface TicketTier {
  id: string;
  name: string;
  description: string;
  price: number; // in Kobo (Paystack unit)
  capacity: number | null; // null = unlimited
  sold: number;
  isOpen: boolean;
  perks: string[]; // e.g. ["Arrival Party", "Grand Law Dinner"]
  createdAt: Date;
  updatedAt: Date;
}

export interface Registration {
  id: string;
  ticketNumber: string; // e.g. SEZC-2026-0001
  fullName: string;
  email: string;
  phone: string;
  institution: string; // University/Chapter name
  ticketTierId: string;
  ticketTier?: TicketTier;
  paymentStatus: PaymentStatus;
  paystackReference: string;
  paystackAmount: number; // amount paid in Kobo
  qrCodeData: string; // JSON encoded verification data
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ── Form Schemas ─────────────────────────────────────────── //

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  ticketTierId: string;
}

export interface TicketTierFormData {
  name: string;
  description: string;
  price: number;
  capacity: number | null;
  perks: string[];
  isOpen: boolean;
}

// ── API Response Types ───────────────────────────────────── //

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaystackInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface DashboardStats {
  totalRevenue: number; // in Kobo
  totalRegistrations: number;
  byTier: Array<{
    tierName: string;
    count: number;
    revenue: number;
  }>;
  recentRegistrations: Registration[];
}
