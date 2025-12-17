'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Leaf, BarChart3, Target, BookOpen } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'State Analysis', href: '/dashboard', icon: Target },
  { name: 'Our Initiatives', href: '/initiatives', icon: Leaf },
  { name: 'Methodology', href: '/methodology', icon: BookOpen },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      {/* Top bar */}
      <div className={`hidden md:block transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden' : 'bg-green-900'}`}>
        <div className="container-custom py-2">
          <div className="flex justify-between items-center text-sm text-white">
            <div className="flex items-center gap-2">
              <Leaf size={14} className="text-green-400" />
              <span>Unilink Transportation Sustainability Report</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Real-time Carbon Footprint Data</span>
              <span className="text-green-400 font-semibold">|</span>
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className={`flex items-center gap-2 transition-colors ${scrolled ? 'text-green-700' : 'text-white'}`}>
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Leaf size={24} className="text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">UNILINK</span>
                <span className={`block text-xs ${scrolled ? 'text-gray-500' : 'text-green-300'}`}>Energy & Sustainability</span>
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 font-medium transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-300'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
            <a
              href="https://unilinktransportation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-green text-sm py-2 px-4"
            >
              Main Website
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={28} className={scrolled ? 'text-gray-800' : 'text-white'} />
            ) : (
              <Menu size={28} className={scrolled ? 'text-gray-800' : 'text-white'} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden bg-white shadow-xl transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="container-custom py-4 space-y-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 py-2 text-gray-700 font-medium hover:text-green-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
          <a
            href="https://unilinktransportation.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green block text-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Main Website
          </a>
        </div>
      </div>
    </header>
  );
}
