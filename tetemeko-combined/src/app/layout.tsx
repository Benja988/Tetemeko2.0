// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tetemekomediagroup.org'), 
  title: 'Tetemeko Media Group',
  description: 'Streaming | News | Marketplace | Podcasts',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/logo.jpg', sizes: '60x63', type: 'image/jpg' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  openGraph: {
    title: 'Tetemeko Media Group',
    description: 'Streaming | News | Marketplace | Podcasts',
    url: 'https://www.tetemekomediagroup.org',
    siteName: 'Tetemeko Media Group',
    images: [
      {
        url: '/og-image.jpg', // recommended banner in /public (1200x630)
        width: 1200,
        height: 630,
        alt: 'Tetemeko Media Group Banner',
      },
      {
        url: '/logo.jpg',
        width: 60,
        height: 63,
        alt: 'Tetemeko Media Group Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tetemeko Media Group',
    description: 'Streaming | News | Marketplace | Podcasts',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning className="bg-primary font-sans h-full overflow-x-hidden">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
