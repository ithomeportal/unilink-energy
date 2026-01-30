import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Shield, Award, FileCheck } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Simple Header for Login */}
      <header className="fixed w-full z-50 bg-primary-900/95 backdrop-blur-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/login" className="flex items-center gap-3">
              <Image
                src="/unilink-logo-green.png"
                alt="Unilink Energy & Sustainability"
                width={160}
                height={50}
                className="h-10 w-auto"
                priority
              />
              <span className="text-xs font-medium text-green-300">
                Energy & Sustainability
              </span>
            </Link>

            {/* Main website link only */}
            <a
              href="https://unilinktransportation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-300 text-sm font-medium transition-colors"
            >
              Main Website →
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Simple Footer for Login */}
      <footer className="bg-primary-900 text-white">
        {/* Certifications bar */}
        <div className="border-t border-primary-800">
          <div className="container-custom py-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Award size={18} className="text-yellow-500" />
                </div>
                <span className="font-medium">EcoVadis Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={24} className="text-green-500" />
                <span>EPA Standards Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={24} className="text-green-500" />
                <span>B20 Biodiesel Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck size={24} className="text-green-500" />
                <span>SmartWay Partner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-800">
          <div className="container-custom py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Unilink Transportation. All rights reserved.</p>
              <p className="flex items-center gap-2">
                <Leaf size={16} className="text-green-500" />
                Sustainability Report Portal
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
