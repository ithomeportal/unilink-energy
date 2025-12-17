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
  RefreshCw
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
