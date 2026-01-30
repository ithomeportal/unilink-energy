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
  ExternalLink,
  Building2,
  Zap,
  GitBranch,
  Info
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
import dynamic from 'next/dynamic';
import type { EmissionsSummary, MonthlyTrend, StateEmissions } from '@/lib/types';
import { formatNumber, formatPercent, formatTons } from '@/lib/emissions';

// Dynamic import for USMap to avoid SSR issues
const USMap = dynamic(() => import('@/components/USMap'), { ssr: false });

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

type TimePeriod = 'last12' | 'ytd' | 'currentYear';

export default function HomePage() {
  const [data, setData] = useState<EmissionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('last12');

  // Calculate period-specific data
  const periodData = data ? (() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let filteredTrends = data.monthlyTrends;

    if (timePeriod === 'last12') {
      // Last 12 months
      filteredTrends = data.monthlyTrends.slice(-12);
    } else if (timePeriod === 'ytd') {
      // Year to date
      filteredTrends = data.monthlyTrends.filter(t => t.year === currentYear);
    } else {
      // Current year vs baseline (all data from current year)
      filteredTrends = data.monthlyTrends.filter(t => t.year === currentYear);
    }

    const totalStandard = filteredTrends.reduce((sum, t) => sum + t.standardEmissions, 0);
    const totalActual = filteredTrends.reduce((sum, t) => sum + t.actualEmissions, 0);
    const totalSaved = filteredTrends.reduce((sum, t) => sum + t.co2Saved, 0);
    const monthCount = filteredTrends.length;

    return {
      standardEmissions: totalStandard,
      actualEmissions: totalActual,
      co2Saved: totalSaved,
      percentReduction: totalStandard > 0 ? ((totalStandard - totalActual) / totalStandard) * 100 : 27,
      monthCount,
      periodLabel: timePeriod === 'last12'
        ? 'Last 12 Months'
        : timePeriod === 'ytd'
          ? `${currentYear} YTD`
          : `${currentYear}`,
    };
  })() : null;

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
                <p className="text-4xl font-bold text-white">100%</p>
                <p className="text-gray-300 text-sm">Green Carrier Compliance</p>
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
              <p className="text-3xl md:text-4xl font-bold">{formatTons(data.summary.totalCO2Saved)}</p>
              <p className="text-green-200 text-sm">Total CO2 Saved</p>
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
              <p className="text-3xl md:text-4xl font-bold">{data.summary.stateCount}</p>
              <p className="text-green-200 text-sm">States Covered</p>
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
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Calendar size={18} className="text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">Environmental Impact Over Time</span>
            </div>
            <h2 className="heading-2 text-gray-900 mb-4">The Difference Our Policies Make</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Compare emissions before implementing green carrier requirements with our current sustainable operations.
            </p>

            {/* Time Period Selector */}
            <div className="inline-flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setTimePeriod('last12')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timePeriod === 'last12'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Last 12 Months
              </button>
              <button
                onClick={() => setTimePeriod('ytd')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timePeriod === 'ytd'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Year to Date
              </button>
              <button
                onClick={() => setTimePeriod('currentYear')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timePeriod === 'currentYear'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {new Date().getFullYear()} vs Baseline
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Industry Baseline */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-300/30 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="text-gray-600 font-medium">Industry Baseline</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Without Green Policies</h3>

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
                    <p className="text-sm text-gray-500 mb-1">Would-Be Emissions</p>
                    <p className="text-2xl font-bold text-gray-800">{periodData ? formatTons(periodData.standardEmissions) : '-'}</p>
                    <p className="text-xs text-gray-500">tCO2e ({periodData?.periodLabel})</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow / Transformation */}
            <div className="flex items-center justify-center">
              <div className="bg-green-500 rounded-2xl p-8 text-white text-center shadow-xl transform hover:scale-105 transition-transform">
                <ArrowUpRight size={48} className="mx-auto mb-4" />
                <p className="text-4xl font-bold mb-2">{periodData ? formatPercent(periodData.percentReduction) : '~27%'}</p>
                <p className="text-green-200 text-sm mb-4">Total Reduction</p>
                <div className="border-t border-green-400/30 pt-4 mt-4">
                  <p className="text-2xl font-bold">{periodData ? formatTons(periodData.co2Saved) : '-'}</p>
                  <p className="text-green-200 text-sm">tCO2e Saved</p>
                </div>
                <div className="mt-6 text-xs text-green-200">
                  <p>{periodData?.periodLabel || 'Selected Period'}</p>
                </div>
              </div>
            </div>

            {/* With Green Policies */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-300" />
                  <span className="text-green-200 font-medium">{periodData?.periodLabel || 'Current'}</span>
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
                    <p className="text-2xl font-bold">{periodData ? formatTons(periodData.actualEmissions) : '-'}</p>
                    <p className="text-xs text-green-200">tCO2e ({periodData?.periodLabel})</p>
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

      {/* SmartWay Partner Section */}
      <section className="section-padding bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-6">
                <Truck size={18} className="text-green-400" />
                <span className="text-green-300 text-sm font-medium">EPA Partnership</span>
              </div>

              <h2 className="heading-2 mb-6">
                EPA <span className="text-green-400">SmartWay</span> Partner
              </h2>

              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Unilink Transportation is a proud participant in the
                <strong className="text-green-400"> EPA SmartWay Transport Partnership</strong> -
                a U.S. government program that helps companies improve freight efficiency
                and reduce environmental impact across their supply chains.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Verified Freight Performance</p>
                    <p className="text-gray-400 text-sm">EPA-verified tracking of emissions, fuel efficiency, and environmental metrics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Carrier Selection Standards</p>
                    <p className="text-gray-400 text-sm">We prioritize SmartWay-registered carriers in our network for cleaner freight operations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">CSR & ESG Reporting</p>
                    <p className="text-gray-400 text-sm">SmartWay data supports GHG Protocol, CDP, and Global Reporting Initiative standards</p>
                  </div>
                </div>
              </div>

              <a
                href="https://www.epa.gov/smartway"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors"
              >
                Learn About SmartWay
                <ExternalLink size={18} />
              </a>
            </div>

            {/* Right content - SmartWay info cards */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Award size={24} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is SmartWay?</h3>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Launched in 2004, EPA SmartWay is a public-private partnership helping nearly 4,000 companies
                  measure, benchmark, and improve supply chain sustainability. Partners have avoided 170 million
                  metric tons of CO2 emissions and saved $55.4 billion in fuel costs.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Program Impact Since 2004</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">170M</p>
                    <p className="text-gray-400 text-xs">Metric Tons CO2 Avoided</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">$55.4B</p>
                    <p className="text-gray-400 text-xs">Fuel Costs Saved</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">397M</p>
                    <p className="text-gray-400 text-xs">Barrels of Oil Saved</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">4,000+</p>
                    <p className="text-gray-400 text-xs">Partner Companies</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 border border-green-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Target size={24} className="text-green-400" />
                  <h3 className="font-semibold text-white">Why SmartWay Matters for 3PLs</h3>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  As a logistics provider, our participation in SmartWay demonstrates commitment to sustainable
                  freight practices. It enables us to track Scope 3 emissions, select efficient carriers, and
                  provide verified environmental data to our shipper partners and their sustainability reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GHG Protocol Scopes Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <Info size={18} className="text-purple-600" />
              <span className="text-purple-700 text-sm font-medium">GHG Protocol Framework</span>
            </div>
            <h2 className="heading-2 text-gray-900 mb-4">Understanding Our Emissions: Scope 1, 2 & 3</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We follow the GHG Protocol Corporate Standard - the world&apos;s most widely used greenhouse gas accounting framework.
              As a 3PL logistics company, our emissions profile is unique.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Scope 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-orange-500 relative">
              <div className="absolute -top-5 left-8">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                  <Building2 size={20} className="text-white" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scope 1</h3>
                <p className="text-sm text-orange-600 font-medium mb-4">Direct Emissions</p>
                <p className="text-gray-600 text-sm mb-4">
                  Emissions from sources owned or controlled by the company, such as company vehicles and on-site fuel combustion.
                </p>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Our Profile</p>
                  <p className="text-sm font-medium text-gray-800">
                    As a 3PL, we don&apos;t own trucks. Our Scope 1 is limited to office facilities and any company-owned vehicles.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-xs text-gray-600">Minimal impact</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-yellow-500 relative">
              <div className="absolute -top-5 left-8">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
                  <Zap size={20} className="text-white" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scope 2</h3>
                <p className="text-sm text-yellow-600 font-medium mb-4">Indirect - Energy</p>
                <p className="text-gray-600 text-sm mb-4">
                  Emissions from purchased electricity, steam, heating, and cooling consumed by the company.
                </p>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Our Profile</p>
                  <p className="text-sm font-medium text-gray-800">
                    Electricity usage in our offices and operations centers. We&apos;re exploring renewable energy options.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-xs text-gray-600">Low-moderate impact</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-green-500 relative">
              <div className="absolute -top-5 left-8">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <GitBranch size={20} className="text-white" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scope 3</h3>
                <p className="text-sm text-green-600 font-medium mb-4">Value Chain Emissions</p>
                <p className="text-gray-600 text-sm mb-4">
                  All other indirect emissions in a company&apos;s value chain, including upstream and downstream activities.
                </p>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Our Profile</p>
                  <p className="text-sm font-medium text-gray-800">
                    <strong>This is our primary focus.</strong> Contracted carrier emissions represent our largest footprint.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-700 font-medium">Major impact - Actively reducing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scope 3 Detailed Breakdown */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Scope 3 Strategy</h3>
                <p className="text-green-100 mb-6">
                  Since we don&apos;t own trucks, we influence emissions through our carrier requirements.
                  By mandating B20 biodiesel and modern fleets, we reduce Scope 3 Category 4 (Upstream Transportation) emissions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-300" />
                    <span>100% carrier compliance with B20 biodiesel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-300" />
                    <span>All power units under 9 years old</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-300" />
                    <span>Real-time emissions tracking & reporting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-300" />
                    <span>Continuous improvement through EcoVadis</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="font-semibold mb-4 text-green-200">Scope 3 Categories We Impact</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Category 4: Upstream Transportation</span>
                      <span className="text-green-300">Primary</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Category 9: Downstream Transportation</span>
                      <span className="text-green-300">Secondary</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Category 6: Business Travel</span>
                      <span className="text-green-300">Minor</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-green-200 mt-4">
                  Based on GHG Protocol Scope 3 Standard categorization
                </p>
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className="mt-8 flex items-start gap-4 bg-blue-50 rounded-xl p-6">
            <Info size={24} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Why Scope 3 Matters for 3PLs</p>
              <p className="text-gray-600 text-sm">
                For logistics companies that don&apos;t own their fleet, Scope 3 emissions typically represent
                <strong> over 90% of total emissions</strong>. By focusing on carrier requirements and tracking,
                we address the largest portion of our environmental impact where we have the most influence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive US Map Section */}
      <section className="section-padding bg-gradient-to-br from-primary-900 via-primary-800 to-green-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-4">
              <MapPin size={18} className="text-green-400" />
              <span className="text-green-300 text-sm font-medium">Geographic Impact</span>
            </div>
            <h2 className="heading-2 text-white mb-4">Where We Make a Difference</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our green carrier network operates across {data.summary.stateCount} states. Explore the map to see CO2 savings by region.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <USMap stateEmissions={data.stateEmissions} />
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-white">{data.summary.stateCount}</p>
              <p className="text-green-300 text-sm">States Covered</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-white">{formatTons(data.summary.totalCO2Saved)}</p>
              <p className="text-green-300 text-sm">Total tCO2e Saved</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-white">{formatTons(data.summary.b20Savings)}</p>
              <p className="text-green-300 text-sm">B20 Savings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-white">{formatTons(data.summary.fleetSavings)}</p>
              <p className="text-green-300 text-sm">Fleet Savings</p>
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
