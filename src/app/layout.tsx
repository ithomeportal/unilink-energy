import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unilink Energy & Sustainability | Carbon Footprint Dashboard',
  description: 'Real-time sustainability metrics and carbon footprint tracking for Unilink Transportation. See how our B20 biodiesel and modern fleet policies reduce CO2 emissions across 48 states.',
  keywords: 'carbon footprint, sustainability, CO2 emissions, biodiesel, B20, green logistics, transportation emissions, environmental impact',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Unilink Energy & Sustainability Dashboard',
    description: 'Track our real-time CO2 savings from sustainable logistics policies. B20 biodiesel and modern fleet requirements reducing emissions by 27%.',
    type: 'website',
    locale: 'en_US',
    images: ['/opengraph-image.png'],
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
