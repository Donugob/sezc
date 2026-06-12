import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SEZC 2026 — Redefining Legal Practice | Owerri',
    template: '%s | SEZC 2026',
  },
  description:
    'South East Zonal Convention 2026 by LAWSAN South East Zonal Directorate. Join us in Owerri for a 3-day event redefining the future of legal practice.',
  keywords: [
    'LAWSAN',
    'South East Zonal Convention',
    'SEZC 2026',
    'Law Students Nigeria',
    'Owerri',
    'Legal Conference',
    'Redefining Legal Practice',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'SEZC 2026',
    title: 'SEZC 2026 — Redefining Legal Practice',
    description:
      'Join LAWSAN South East for the most electrifying zonal convention yet. 3 days. Owerri. 2026.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEZC 2026 — Redefining Legal Practice',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
