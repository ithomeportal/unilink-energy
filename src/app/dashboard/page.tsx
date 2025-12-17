'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  RefreshCw,
  Truck,
  Route,
  Search,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { EmissionsSummary, StateEmissions, TopRoute } from '@/lib/types';
import { formatNumber, formatTons, US_STATES } from '@/lib/emissions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EmissionsData {
  summary: EmissionsSummary;
  stateEmissions: StateEmissions[];
  topRoutes: TopRoute[];
}

type SortKey = 'state' | 'orderCount' | 'totalMiles' | 'co2Saved';
type SortDirection = 'asc' | 'desc';

export default function DashboardPage() {
  const [data, setData] = useState<EmissionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('co2Saved');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [activeTab, setActiveTab] = useState<'states' | 'routes'>('states');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/emissions');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const filteredStates = data?.stateEmissions
    .filter(state =>
      state.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.stateName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier;
      }
      return ((aVal as number) - (bVal as number)) * modifier;
    }) || [];

  // Get emission intensity for color coding
  const getEmissionIntensity = (co2Saved: number, maxCO2: number): string => {
    const ratio = co2Saved / maxCO2;
    if (ratio > 0.6) return 'bg-green-500';
    if (ratio > 0.3) return 'bg-green-400';
    if (ratio > 0.1) return 'bg-green-300';
    return 'bg-green-200';
  };

  const maxCO2Saved = data ? Math.max(...data.stateEmissions.map(s => s.co2Saved)) : 0;

  const stateChartData = data ? {
    labels: data.stateEmissions.slice(0, 12).map(s => s.state),
    datasets: [
      {
        label: 'Standard Emissions',
        data: data.stateEmissions.slice(0, 12).map(s => s.standardEmissions),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Actual Emissions',
        data: data.stateEmissions.slice(0, 12).map(s => s.actualEmissions),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32">
        <div className="text-center">
          <RefreshCw size={48} className="animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-xl text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32">
        <div className="text-center">
          <p className="text-xl text-gray-600">Unable to load data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      {/* Header */}
      <div className="bg-gradient-eco py-16">
        <div className="container-custom text-white">
          <h1 className="heading-2 mb-4">Geographic Emissions Analysis</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            State-by-state breakdown of our carbon footprint savings from sustainable carrier policies.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="container-custom -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-6 border-l-4 border-green-500">
            <p className="metric-label">Total CO2 Saved</p>
            <p className="metric-value text-green-600">{formatTons(data.summary.totalCO2Saved)}</p>
            <p className="text-sm text-gray-500">tCO2e</p>
          </div>
          <div className="card p-6 border-l-4 border-blue-500">
            <p className="metric-label">States Covered</p>
            <p className="metric-value text-blue-600">{data.summary.stateCount}</p>
            <p className="text-sm text-gray-500">US States</p>
          </div>
          <div className="card p-6 border-l-4 border-purple-500">
            <p className="metric-label">Total Miles</p>
            <p className="metric-value text-purple-600">{formatNumber(data.summary.totalMiles)}</p>
            <p className="text-sm text-gray-500">Green Miles</p>
          </div>
          <div className="card p-6 border-l-4 border-orange-500">
            <p className="metric-label">Total Orders</p>
            <p className="metric-value text-orange-600">{formatNumber(data.summary.totalOrders)}</p>
            <p className="text-sm text-gray-500">Shipments</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container-custom mt-8">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            className={`pb-4 px-4 font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'states'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('states')}
          >
            <MapPin size={20} />
            State Emissions
          </button>
          <button
            className={`pb-4 px-4 font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'routes'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('routes')}
          >
            <Route size={20} />
            Top Routes
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom mt-8">
        {activeTab === 'states' && (
          <div className="space-y-8">
            {/* Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top States: Standard vs Actual Emissions</h3>
              <div className="h-80">
                {stateChartData && (
                  <Bar
                    data={stateChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' },
                      },
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            {/* Search and Table */}
            <div className="card p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">All States</h3>
                <div className="relative w-full md:w-64">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search states..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left">
                        <button
                          onClick={() => handleSort('state')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-green-600"
                        >
                          State
                          {sortKey === 'state' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </button>
                      </th>
                      <th className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSort('orderCount')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-green-600 ml-auto"
                        >
                          Orders
                          {sortKey === 'orderCount' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </button>
                      </th>
                      <th className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSort('totalMiles')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-green-600 ml-auto"
                        >
                          Miles
                          {sortKey === 'totalMiles' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </button>
                      </th>
                      <th className="py-3 px-4 text-right">In/Out Routes</th>
                      <th className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSort('co2Saved')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-green-600 ml-auto"
                        >
                          CO2 Saved
                          {sortKey === 'co2Saved' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </button>
                      </th>
                      <th className="py-3 px-4 text-right">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStates.map((state) => (
                      <tr key={state.state} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{state.state}</span>
                            <span className="text-gray-500 text-sm">{state.stateName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="flex items-center justify-end gap-1">
                            <Truck size={14} className="text-gray-400" />
                            {formatNumber(state.orderCount)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-gray-600">
                          {formatNumber(state.totalMiles)}
                        </td>
                        <td className="py-4 px-4 text-right text-gray-600">
                          <span className="text-green-600">{state.inboundRoutes}</span> / <span className="text-blue-600">{state.outboundRoutes}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="font-semibold text-green-600">{formatTons(state.co2Saved)} t</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${getEmissionIntensity(state.co2Saved, maxCO2Saved)}`}
                              style={{ width: `${(state.co2Saved / maxCO2Saved) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStates.length === 0 && (
                <p className="text-center text-gray-500 py-8">No states found matching &quot;{searchTerm}&quot;</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 10 Routes by Volume</h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Route</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-700">Orders</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-700">Total Miles</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-700">Avg Miles</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-700">Standard CO2</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-700">Actual CO2</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-700">CO2 Saved</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topRoutes.map((route, index) => (
                    <tr key={`${route.originState}-${route.destinationState}`} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-gray-900">{route.originState}</span>
                          <ArrowRight size={16} className="text-gray-400" />
                          <span className="font-semibold text-gray-900">{route.destinationState}</span>
                          <span className="text-gray-400 text-sm hidden md:inline">
                            ({US_STATES[route.originState]} to {US_STATES[route.destinationState]})
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">{formatNumber(route.orderCount)}</td>
                      <td className="py-4 px-4 text-right text-gray-600">{formatNumber(route.totalMiles)}</td>
                      <td className="py-4 px-4 text-right text-gray-600">{formatNumber(route.avgMiles)}</td>
                      <td className="py-4 px-4 text-right text-red-500">{formatTons(route.standardEmissions)} t</td>
                      <td className="py-4 px-4 text-right text-gray-600">{formatTons(route.actualEmissions)} t</td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                          <TrendingDown size={16} />
                          {formatTons(route.co2Saved)} t
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Legend / Methodology link */}
      <div className="container-custom mt-8">
        <div className="bg-green-50 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <TrendingUp size={24} className="text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-green-800">Understanding the Numbers</p>
              <p className="text-green-700 text-sm">
                CO2 savings calculated using EPA emission factors. B20 biodiesel reduces emissions by ~17%, modern fleet (&lt;9 years) improves efficiency by ~12%.
              </p>
            </div>
          </div>
          <Link href="/methodology" className="btn-green whitespace-nowrap">
            View Methodology
          </Link>
        </div>
      </div>
    </div>
  );
}
