import type { Metadata, Viewport } from 'next';
import { Lora, Outfit } from 'next/font/google';
import '@/app/globals.css';

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-sans', 
  display: 'swap',
  preload: true 
});

const lora = Lora({ 
  subsets: ['latin'], 
  variable: '--font-serif', 
  display: 'swap',
  preload: true 
});

export const viewport: Viewport = {
  themeColor: '#0B192C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents iOS input auto-zoom
  viewportFit: 'cover',
};

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
    <html lang="en" className={`${outfit.variable} ${lora.variable}`}>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
