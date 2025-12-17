import Link from 'next/link';
import { Leaf, Mail, ExternalLink, Shield, Award, FileCheck } from 'lucide-react';

const footerLinks = {
  resources: [
    { name: 'Dashboard', href: '/' },
    { name: 'State Analysis', href: '/dashboard' },
    { name: 'Our Initiatives', href: '/initiatives' },
    { name: 'Methodology', href: '/methodology' },
  ],
  company: [
    { name: 'Unilink Transportation', href: 'https://unilinktransportation.com', external: true },
    { name: 'About Us', href: 'https://unilinktransportation.com/about', external: true },
    { name: 'Careers', href: 'https://unilinktransportation.com/careers', external: true },
    { name: 'Contact', href: 'https://unilinktransportation.com/contact', external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      {/* Main footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Leaf size={24} className="text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">UNILINK</span>
                <span className="block text-xs text-green-400">Energy & Sustainability</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Committed to sustainable logistics through innovative policies and responsible carrier partnerships. Tracking and reducing our carbon footprint one mile at a time.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                    <ExternalLink size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Sustainability Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:sustainability@unilinktransportation.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Mail size={18} className="text-green-500" />
                  sustainability@unilinktransportation.com
                </a>
              </li>
              <li className="text-gray-400 text-sm mt-4">
                <p>Questions about our carbon footprint data or sustainability initiatives? We&apos;d love to hear from you.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Certifications & Standards bar */}
      <div className="border-t border-primary-800">
        <div className="container-custom py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm">
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
              Data updated daily at midnight CT
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
