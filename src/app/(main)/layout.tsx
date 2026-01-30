import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Force dynamic rendering to ensure middleware authentication runs
export const dynamic = 'force-dynamic';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
