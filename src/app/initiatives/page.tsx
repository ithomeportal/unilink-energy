'use client';

import Link from 'next/link';
import {
  Leaf,
  Droplets,
  Clock,
  Target,
  CheckCircle,
  TrendingDown,
  Calendar,
  Award,
  Shield,
  Users,
  Truck,
  BarChart3,
  ArrowRight
} from 'lucide-react';

const policies = [
  {
    title: 'B20 Biodiesel Requirement',
    description: 'All carriers must use B20 biodiesel (20% biodiesel, 80% petroleum diesel) for US operations.',
    icon: Droplets,
    color: 'green',
    stats: [
      { label: 'CO2 Reduction', value: '~17%' },
      { label: 'Compliance', value: '100%' },
    ],
    benefits: [
      'Reduces lifecycle carbon emissions',
      'Compatible with existing diesel engines',
      'Supports renewable fuel industry',
      'Cleaner burning than petroleum diesel',
    ],
    effectiveDate: 'March 2025',
  },
  {
    title: 'Modern Fleet Standard',
    description: 'All contracted carriers must operate power units manufactured in 2016 or later (less than 9 years old).',
    icon: Clock,
    color: 'blue',
    stats: [
      { label: 'Efficiency Gain', value: '~12%' },
      { label: 'Max Age', value: '9 Years' },
    ],
    benefits: [
      'Better fuel efficiency from modern engines',
      'Lower emissions per mile',
      'Improved safety features',
      'More reliable performance',
    ],
    effectiveDate: 'March 2025',
  },
];

const timeline = [
  {
    date: 'Q4 2024',
    title: 'Policy Development',
    description: 'Research and development of sustainability requirements for carrier partners.',
    status: 'completed',
  },
  {
    date: 'Q1 2025',
    title: 'Carrier Notification',
    description: 'All existing carriers informed of new B20 and fleet age requirements.',
    status: 'completed',
  },
  {
    date: 'March 2025',
    title: 'Policy Implementation',
    description: '100% carrier compliance achieved with B20 biodiesel and modern fleet requirements.',
    status: 'completed',
  },
  {
    date: 'Q2 2025',
    title: 'Monitoring & Reporting',
    description: 'Launch of real-time emissions tracking dashboard and public reporting.',
    status: 'completed',
  },
  {
    date: 'Q4 2025',
    title: 'First Annual Report',
    description: 'Publication of comprehensive annual sustainability report with verified data.',
    status: 'upcoming',
  },
  {
    date: '2026',
    title: 'Enhanced Standards',
    description: 'Evaluate potential expansion to B50 biodiesel and 7-year fleet age maximum.',
    status: 'planned',
  },
];

const impactMetrics = [
  { icon: TrendingDown, value: '27%', label: 'Combined CO2 Reduction', color: 'text-green-600' },
  { icon: Truck, value: '100%', label: 'Carrier Compliance', color: 'text-blue-600' },
  { icon: Calendar, value: 'March 2025', label: 'Since Implementation', color: 'text-purple-600' },
  { icon: Target, value: '48', label: 'States Covered', color: 'text-orange-600' },
];

export default function InitiativesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-eco py-20">
        <div className="container-custom text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-6">
              <Leaf size={18} className="text-green-400" />
              <span className="text-green-300 text-sm font-medium">Our Commitment to Sustainability</span>
            </div>
            <h1 className="heading-1 mb-6">
              Leading the Change in <span className="text-green-400">Green Logistics</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              As a 3PL company, we leverage our position to drive sustainability across the supply chain.
              We don&apos;t own trucks, but we set the standards for every carrier we work with.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="container-custom -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {impactMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="text-center">
                <Icon size={32} className={`mx-auto mb-3 ${metric.color}`} />
                <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                <p className="text-gray-500 text-sm">{metric.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Policies */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">Our Green Carrier Policies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every carrier contracted by Unilink Transportation must meet these mandatory sustainability requirements.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {policies.map((policy) => {
              const Icon = policy.icon;
              const colorClasses = policy.color === 'green'
                ? { bg: 'bg-green-100', icon: 'text-green-600', border: 'border-green-500', badge: 'bg-green-500' }
                : { bg: 'bg-blue-100', icon: 'text-blue-600', border: 'border-blue-500', badge: 'bg-blue-500' };

              return (
                <div key={policy.title} className={`card p-8 border-t-4 ${colorClasses.border}`}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl ${colorClasses.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={32} className={colorClasses.icon} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{policy.title}</h3>
                      <p className="text-gray-600 mt-1">{policy.description}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {policy.stats.map((stat, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className={`text-2xl font-bold ${colorClasses.icon}`}>{stat.value}</p>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6">
                    {policy.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle size={18} className={colorClasses.icon} />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Effective Date */}
                  <div className={`inline-flex items-center gap-2 ${colorClasses.badge} text-white px-4 py-2 rounded-full text-sm`}>
                    <Calendar size={16} />
                    Effective: {policy.effectiveDate}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="bg-white section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 text-gray-900 mb-6">Why This Matters</h2>
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  As a third-party logistics provider, Unilink Transportation operates in a unique position within the supply chain.
                  While we don&apos;t own trucks directly, we contract with hundreds of carriers across 48 states.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  This gives us significant leverage to influence industry practices. By requiring all our carrier partners
                  to meet strict sustainability standards, we&apos;re not just reducing our own carbon footprint -
                  we&apos;re driving change across the entire logistics industry.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our commitment to B20 biodiesel and modern fleet requirements demonstrates that sustainability
                  and business success go hand in hand. Every shipment through our network represents a cleaner,
                  more efficient choice.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Carrier Partnership</h3>
                  <p className="text-gray-600 text-sm">Working with carriers who share our commitment to sustainability and environmental responsibility.</p>
                </div>
              </div>

              <div className="card p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Verified Compliance</h3>
                  <p className="text-gray-600 text-sm">All carriers must provide documentation of fuel type and equipment age before contracting.</p>
                </div>
              </div>

              <div className="card p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Award size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Industry Leadership</h3>
                  <p className="text-gray-600 text-sm">Setting new standards for environmental responsibility in the 3PL logistics sector.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">Our Sustainability Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From policy development to full implementation and beyond.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => {
              const isCompleted = item.status === 'completed';
              const isUpcoming = item.status === 'upcoming';

              return (
                <div key={index} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isUpcoming ? 'bg-blue-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={24} />
                      ) : (
                        <Calendar size={24} />
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 h-full mt-2 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        isCompleted ? 'bg-green-100 text-green-700' :
                        isUpcoming ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {item.date}
                      </span>
                      {isCompleted && <span className="text-green-600 text-sm">Completed</span>}
                      {isUpcoming && <span className="text-blue-600 text-sm">Upcoming</span>}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-eco section-padding">
        <div className="container-custom text-center text-white">
          <h2 className="heading-2 mb-4">See Our Impact in Numbers</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore our real-time dashboard to see exactly how much CO2 we&apos;ve saved through our green carrier policies.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard" className="btn-green flex items-center gap-2">
              <BarChart3 size={20} />
              View Dashboard
            </Link>
            <Link href="/methodology" className="btn-secondary flex items-center gap-2">
              How We Calculate
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
