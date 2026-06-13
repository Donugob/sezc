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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://lawsan-se.com.ng'),
  title: {
    default: 'SEZC 2026 — South East Zonal Convention',
    template: '%s | SEZC 2026',
  },
  description:
    'Join LAWSAN South East for the most electrifying zonal convention. 3 days of high-level conversations, career-defining networking, and cultural celebration in Owerri.',
  keywords: [
    'LAWSAN',
    'South East Zonal Convention',
    'SEZC 2026',
    'Law Students Association of Nigeria',
    'Owerri',
    'Legal Conference',
    'Law Students',
    'Nigerian Law'
  ],
  authors: [{ name: 'LAWSAN South East' }],
  creator: 'LAWSAN South East Zonal Directorate',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'SEZC 2026',
    url: '/',
    title: 'SEZC 2026 — South East Zonal Convention',
    description:
      'Join LAWSAN South East for the most electrifying zonal convention yet. 3 days. Owerri. 2026.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEZC 2026 Official Poster',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEZC 2026 — South East Zonal Convention',
    description: 'Join LAWSAN South East for the most electrifying zonal convention yet. 3 days. Owerri. 2026.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
