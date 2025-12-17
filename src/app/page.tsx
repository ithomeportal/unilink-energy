'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  TrendingDown,
  Truck,
  MapPin,
  ArrowRight,
  Droplets,
  Clock,
  Award,
  Target,
  BarChart3,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  Shield,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import type { EmissionsSummary, MonthlyTrend, StateEmissions } from '@/lib/types';
import { formatNumber, formatPercent, formatTons } from '@/lib/emissions';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface EmissionsData {
  summary: EmissionsSummary;
  stateEmissions: StateEmissions[];
  monthlyTrends: MonthlyTrend[];
}

export default function HomePage() {
  const [data, setData] = useState<EmissionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/emissions');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load data');
        }
      } catch {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Chart configurations
  const emissionsChartData = data ? {
    labels: data.monthlyTrends.map(t => `${t.month} ${t.year}`),
    datasets: [
      {
        label: 'Standard Emissions (without policies)',
        data: data.monthlyTrends.map(t => t.standardEmissions),
        borderColor: 'rgba(239, 68, 68, 0.8)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Actual Emissions (with B20 & Modern Fleet)',
        data: data.monthlyTrends.map(t => t.actualEmissions),
        borderColor: 'rgba(34, 197, 94, 0.8)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  } : null;

  const savingsChartData = data ? {
    labels: ['B20 Biodiesel Savings', 'Modern Fleet Savings', 'Remaining Emissions'],
    datasets: [{
      data: [
        data.summary.b20Savings,
        data.summary.fleetSavings,
        data.summary.totalActualEmissions,
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(156, 163, 175, 0.5)',
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(156, 163, 175, 1)',
      ],
      borderWidth: 2,
    }],
  } : null;

  const topStatesChartData = data ? {
    labels: data.stateEmissions.slice(0, 8).map(s => s.state),
    datasets: [{
      label: 'CO2 Saved (tCO2e)',
      data: data.stateEmissions.slice(0, 8).map(s => s.co2Saved),
      backgroundColor: 'rgba(34, 197, 94, 0.7)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-eco flex items-center justify-center">
        <div className="text-center text-white">
          <RefreshCw size={48} className="animate-spin mx-auto mb-4" />
          <p className="text-xl">Loading sustainability data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-eco flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">Unable to load data</p>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-eco min-h-screen flex items-center pt-32 pb-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
                <Leaf size={18} className="text-green-400" />
                <span className="text-green-300 text-sm font-medium">100% Carrier Compliance Since March 2025</span>
              </div>

              <h1 className="heading-1">
                Driving <span className="text-green-400">Sustainable</span> Logistics
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                As a 3PL logistics company, we don&apos;t own trucks - but we lead change. Since March 2025,
                100% of our contracted carriers use <strong className="text-green-400">B20 biodiesel</strong> and
                power units <strong className="text-green-400">less than 9 years old</strong>.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard" className="btn-green flex items-center gap-2">
                  <BarChart3 size={20} />
                  View Full Dashboard
                </Link>
                <Link href="/initiatives" className="btn-secondary flex items-center gap-2">
                  Our Initiatives
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Right content - Key metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <TrendingDown size={32} className="text-green-400 mb-3" />
                <p className="text-4xl font-bold text-white">{formatPercent(data.summary.percentReduction)}</p>
                <p className="text-gray-300 text-sm">CO2 Reduction</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Leaf size={32} className="text-green-400 mb-3" />
                <p className="text-4xl font-bold text-white">{formatTons(data.summary.totalCO2Saved)}</p>
                <p className="text-gray-300 text-sm">tCO2e Saved</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Truck size={32} className="text-green-400 mb-3" />
                <p className="text-4xl font-bold text-white">{formatNumber(data.summary.totalOrders)}</p>
                <p className="text-gray-300 text-sm">Green Shipments</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <MapPin size={32} className="text-green-400 mb-3" />
                <p className="text-4xl font-bold text-white">{data.summary.stateCount}</p>
                <p className="text-gray-300 text-sm">States Covered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Overlay Section */}
      <section className="relative -mt-20 z-20 px-4">
        <div className="container-custom">
          <div className="bg-green-600 rounded-2xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <p className="text-3xl md:text-4xl font-bold">{formatNumber(data.summary.totalMiles)}</p>
              <p className="text-green-200 text-sm">Total Green Miles</p>
            </div>
            <div className="text-center text-white">
              <p className="text-3xl md:text-4xl font-bold">{formatTons(data.summary.b20Savings)}</p>
              <p className="text-green-200 text-sm">B20 Biodiesel Savings</p>
            </div>
            <div className="text-center text-white">
              <p className="text-3xl md:text-4xl font-bold">{formatTons(data.summary.fleetSavings)}</p>
              <p className="text-green-200 text-sm">Modern Fleet Savings</p>
            </div>
            <div className="text-center text-white">
              <p className="text-3xl md:text-4xl font-bold">{data.summary.avgMilesPerOrder}</p>
              <p className="text-green-200 text-sm">Avg Miles/Shipment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Policies Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">Our Green Carrier Requirements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Since March 2025, every carrier we contract must meet these sustainability standards - no exceptions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* B20 Biodiesel Card */}
            <div className="card p-8 border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Droplets size={32} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">B20 Biodiesel Required</h3>
                  <p className="text-gray-600 mb-4">
                    All US operations must use B20 biodiesel - a blend of 20% biodiesel and 80% petroleum diesel.
                    This reduces lifecycle CO2 emissions by approximately <strong>17%</strong> compared to standard diesel.
                  </p>
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <Award size={18} />
                    <span>~17% CO2 Reduction</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Fleet Card */}
            <div className="card p-8 border-l-4 border-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock size={32} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Power Units Under 9 Years</h3>
                  <p className="text-gray-600 mb-4">
                    We only contract carriers with trucks manufactured in 2016 or later.
                    Modern engines are significantly more fuel-efficient and produce fewer emissions.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <Target size={18} />
                    <span>~12% Better Fuel Efficiency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-green-50 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <Leaf size={24} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Combined Impact</p>
              <p className="text-green-700">
                Together, these policies reduce our carbon footprint by approximately <strong>{formatPercent(data.summary.percentReduction)}</strong> compared to industry standard operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Year-over-Year Comparison Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Calendar size={18} className="text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">Year-over-Year Impact</span>
            </div>
            <h2 className="heading-2 text-gray-900 mb-4">2024 vs 2025: The Difference Our Policies Make</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compare our emissions before implementing green carrier requirements (2024) with our current sustainable operations (2025).
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 2024 Baseline */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-300/30 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="text-gray-600 font-medium">2024 Baseline</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Before Green Policies</h3>

                <div className="space-y-4">
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Standard Diesel</p>
                    <p className="text-2xl font-bold text-gray-800">100%</p>
                    <p className="text-xs text-gray-500">Petroleum diesel usage</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Fleet Age</p>
                    <p className="text-2xl font-bold text-gray-800">Mixed</p>
                    <p className="text-xs text-gray-500">Units up to 15+ years old</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Estimated Emissions</p>
                    <p className="text-2xl font-bold text-gray-800">{formatTons(data.summary.totalStandardEmissions)}</p>
                    <p className="text-xs text-gray-500">tCO2e (industry standard)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow / Transformation */}
            <div className="flex items-center justify-center">
              <div className="bg-green-500 rounded-2xl p-8 text-white text-center shadow-xl transform hover:scale-105 transition-transform">
                <ArrowUpRight size={48} className="mx-auto mb-4" />
                <p className="text-4xl font-bold mb-2">{formatPercent(data.summary.percentReduction)}</p>
                <p className="text-green-200 text-sm mb-4">Total Reduction</p>
                <div className="border-t border-green-400/30 pt-4 mt-4">
                  <p className="text-2xl font-bold">{formatTons(data.summary.totalCO2Saved)}</p>
                  <p className="text-green-200 text-sm">tCO2e Saved</p>
                </div>
                <div className="mt-6 text-xs text-green-200">
                  <p>Since March 2025</p>
                </div>
              </div>
            </div>

            {/* 2025 Current */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-300" />
                  <span className="text-green-200 font-medium">2025 Current</span>
                </div>
                <h3 className="text-lg font-semibold mb-6">With Green Policies</h3>

                <div className="space-y-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm text-green-200 mb-1">B20 Biodiesel</p>
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-xs text-green-200">20% biodiesel blend</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm text-green-200 mb-1">Fleet Age</p>
                    <p className="text-2xl font-bold">&lt; 9 Years</p>
                    <p className="text-xs text-green-200">All units 2016 or newer</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm text-green-200 mb-1">Actual Emissions</p>
                    <p className="text-2xl font-bold">{formatTons(data.summary.totalActualEmissions)}</p>
                    <p className="text-xs text-green-200">tCO2e (with policies)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Policy breakdown */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-green-50 rounded-xl p-6">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Droplets size={28} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">B20 Biodiesel Impact</p>
                <p className="text-2xl font-bold text-green-600">{formatTons(data.summary.b20Savings)} tCO2e saved</p>
                <p className="text-sm text-gray-500">~17% reduction from standard diesel</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-6">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Truck size={28} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Modern Fleet Impact</p>
                <p className="text-2xl font-bold text-blue-600">{formatTons(data.summary.fleetSavings)} tCO2e saved</p>
                <p className="text-sm text-gray-500">~12% efficiency improvement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EcoVadis Certification Section */}
      <section className="section-padding bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full mb-6">
                <Shield size={18} className="text-yellow-400" />
                <span className="text-yellow-300 text-sm font-medium">Sustainability Commitment</span>
              </div>

              <h2 className="heading-2 mb-6">
                EcoVadis <span className="text-yellow-400">Certified</span>
              </h2>

              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                As part of our commitment to sustainable logistics, Unilink Transportation participates in the
                <strong className="text-yellow-400"> EcoVadis Business Sustainability Ratings</strong> program.
                EcoVadis is the world&apos;s most trusted provider of business sustainability ratings.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Logistics Industry Program</p>
                    <p className="text-gray-400 text-sm">Part of EcoVadis&apos;s specialized logistics and transportation sustainability program</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Independent Assessment</p>
                    <p className="text-gray-400 text-sm">Third-party verification of our environmental, labor, and ethical practices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Continuous Improvement</p>
                    <p className="text-gray-400 text-sm">Regular assessments driving our sustainability roadmap</p>
                  </div>
                </div>
              </div>

              <a
                href="https://ecovadis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-yellow-500 text-slate-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Learn About EcoVadis
                <ExternalLink size={18} />
              </a>
            </div>

            {/* Right content - EcoVadis info cards */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Award size={24} className="text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is EcoVadis?</h3>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  EcoVadis provides holistic sustainability ratings that cover Environment, Labor & Human Rights,
                  Ethics, and Sustainable Procurement. Over 130,000+ companies worldwide are rated, including
                  the world&apos;s largest brands and their supply chains.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Truck size={24} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Logistics Industry Focus</h3>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The transportation and logistics sector has unique environmental challenges. EcoVadis&apos;s
                  logistics program assesses companies on industry-specific criteria including fleet emissions,
                  fuel efficiency, and sustainable supply chain management.
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-green-500/20 rounded-2xl p-6 border border-yellow-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Target size={24} className="text-yellow-400" />
                  <h3 className="font-semibold text-white">Our Commitment</h3>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Participation in EcoVadis demonstrates our commitment to transparency and continuous improvement
                  in sustainability. Our B20 biodiesel and modern fleet requirements are key initiatives that
                  contribute to our sustainability performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">Real-Time Emissions Data</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track our sustainability progress with live data from our operations database, updated daily.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Emissions Trend Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Emissions Comparison</h3>
              <p className="text-sm text-gray-500 mb-4">Standard vs Actual emissions (tCO2e)</p>
              <div className="chart-container">
                {emissionsChartData && <Line data={emissionsChartData} options={chartOptions} />}
              </div>
            </div>

            {/* Savings Breakdown */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions Breakdown</h3>
              <p className="text-sm text-gray-500 mb-4">CO2 saved by policy type (tCO2e)</p>
              <div className="chart-container flex items-center justify-center">
                {savingsChartData && (
                  <Doughnut
                    data={savingsChartData}
                    options={{
                      ...chartOptions,
                      cutout: '60%',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Top States Bar Chart */}
            <div className="card p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top States by CO2 Saved</h3>
              <p className="text-sm text-gray-500 mb-4">States with highest emission reductions (tCO2e)</p>
              <div className="chart-container">
                {topStatesChartData && <Bar data={topStatesChartData} options={chartOptions} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-eco section-padding">
        <div className="container-custom text-center text-white">
          <h2 className="heading-2 mb-4">Explore Our Full Impact</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Dive deeper into state-by-state analysis, route efficiency data, and our complete sustainability roadmap.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard" className="btn-green flex items-center gap-2">
              <BarChart3 size={20} />
              State Analysis Dashboard
            </Link>
            <Link href="/initiatives" className="btn-secondary flex items-center gap-2">
              <Leaf size={20} />
              View All Initiatives
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-400">
            Last updated: {new Date(data.summary.lastUpdated).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>
      </section>
    </div>
  );
}
