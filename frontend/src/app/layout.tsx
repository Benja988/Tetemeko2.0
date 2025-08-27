import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';


const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), 
  title: 'Tetemeko Media Group',
  description: 'Streaming | News | Marketplace | Podcasts',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/logo.jpg', sizes: '60x63', type: 'image/jpg' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'Tetemeko Media Group',
    description: 'Streaming | News | Marketplace | Podcasts',
    url: '/', 
    siteName: 'Tetemeko Media Group',
    images: [
      {
        url: '/logo.jpg', 
        width: 60,
        height: 63,
        alt: 'Tetemeko Media Group',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tetemeko Media Group',
    description: 'Streaming | News | Marketplace | Podcasts',
    images: ['/logo.jpg'], 
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning className="bg-primary font-sans h-full overflow-x-hidden">
        
        {children}
      </body>
    </html>
  );
}