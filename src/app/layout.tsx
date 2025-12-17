import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const siteUrl = 'https://energy.unilinktransportation.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Unilink Energy & Sustainability | Carbon Footprint Dashboard',
    template: '%s | Unilink Energy',
  },
  description: 'Real-time sustainability metrics and carbon footprint tracking for Unilink Transportation. See how our B20 biodiesel and modern fleet policies reduce CO2 emissions across 48 states.',
  keywords: 'carbon footprint, sustainability, CO2 emissions, biodiesel, B20, green logistics, transportation emissions, environmental impact, Unilink Transportation',
  authors: [{ name: 'Unilink Transportation' }],
  creator: 'Unilink Transportation',
  publisher: 'Unilink Transportation',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Unilink Energy & Sustainability Dashboard',
    description: 'Track our real-time CO2 savings from sustainable logistics policies. B20 biodiesel and modern fleet requirements reducing emissions by 27%.',
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Unilink Energy & Sustainability',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Unilink Energy & Sustainability Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unilink Energy & Sustainability Dashboard',
    description: 'Real-time CO2 savings from our green carrier policies.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
