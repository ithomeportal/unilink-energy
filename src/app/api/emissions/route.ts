import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  calculateTotalSavings,
  US_STATES,
  formatNumber
} from '@/lib/emissions';
import type {
  StateEmissions,
  EmissionsSummary,
  MonthlyTrend,
  TopRoute,
  EmissionsApiResponse
} from '@/lib/types';

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Cache for emissions data (refreshes every hour)
let cachedData: EmissionsApiResponse['data'] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
      });
    }

    // Query orders from March 2025 onwards (when B20 and fleet age policy started)
    const ordersQuery = `
      SELECT
        order_date,
        origin_state,
        destination_state,
        origin_lat,
        origin_lon,
        dest_lat,
        dest_lon,
        COALESCE(miles, 0) as miles
      FROM mcleod_gld_budget_report_v4
      WHERE order_date >= '2025-03-01'
        AND origin_state IS NOT NULL
        AND destination_state IS NOT NULL
        AND origin_lat IS NOT NULL
        AND origin_lon IS NOT NULL
        AND dest_lat IS NOT NULL
        AND dest_lon IS NOT NULL
      ORDER BY order_date DESC
    `;

    interface OrderRow {
      order_date: Date;
      origin_state: string;
      destination_state: string;
      origin_lat: number;
      origin_lon: number;
      dest_lat: number;
      dest_lon: number;
      miles: number;
    }

    const orders = await query<OrderRow>(ordersQuery);

    // If no data, return demo data for display purposes
    if (orders.length === 0) {
      const demoData = generateDemoData();
      return NextResponse.json({
        success: true,
        data: demoData,
        demo: true,
      });
    }

    // Process orders and calculate emissions
    const stateDataMap = new Map<string, {
      totalMiles: number;
      orderCount: number;
      inboundRoutes: number;
      outboundRoutes: number;
    }>();

    const monthlyDataMap = new Map<string, {
      orderCount: number;
      totalMiles: number;
    }>();

    const routeDataMap = new Map<string, {
      orderCount: number;
      totalMiles: number;
    }>();

    let totalMiles = 0;
    let totalOrders = orders.length;

    for (const order of orders) {
      // Calculate distance if not provided
      let miles = order.miles;
      if (!miles || miles === 0) {
        miles = calculateDistance(
          order.origin_lat,
          order.origin_lon,
          order.dest_lat,
          order.dest_lon
        );
      }

      totalMiles += miles;

      // Aggregate by origin state
      const originState = order.origin_state.trim().toUpperCase();
      const destState = order.destination_state.trim().toUpperCase();

      // Origin state data
      if (!stateDataMap.has(originState)) {
        stateDataMap.set(originState, { totalMiles: 0, orderCount: 0, inboundRoutes: 0, outboundRoutes: 0 });
      }
      const originData = stateDataMap.get(originState)!;
      originData.totalMiles += miles;
      originData.outboundRoutes++;
      originData.orderCount++;

      // Destination state data
      if (!stateDataMap.has(destState)) {
        stateDataMap.set(destState, { totalMiles: 0, orderCount: 0, inboundRoutes: 0, outboundRoutes: 0 });
      }
      const destData = stateDataMap.get(destState)!;
      destData.inboundRoutes++;

      // Monthly data
      const orderDate = new Date(order.order_date);
      const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyDataMap.has(monthKey)) {
        monthlyDataMap.set(monthKey, { orderCount: 0, totalMiles: 0 });
      }
      const monthData = monthlyDataMap.get(monthKey)!;
      monthData.orderCount++;
      monthData.totalMiles += miles;

      // Route data
      const routeKey = `${originState}-${destState}`;
      if (!routeDataMap.has(routeKey)) {
        routeDataMap.set(routeKey, { orderCount: 0, totalMiles: 0 });
      }
      const routeData = routeDataMap.get(routeKey)!;
      routeData.orderCount++;
      routeData.totalMiles += miles;
    }

    // Calculate overall savings
    const overallSavings = calculateTotalSavings(totalMiles);

    // Build state emissions array
    const stateEmissions: StateEmissions[] = [];
    for (const [state, data] of stateDataMap) {
      const savings = calculateTotalSavings(data.totalMiles);
      stateEmissions.push({
        state,
        stateName: US_STATES[state] || state,
        totalMiles: Math.round(data.totalMiles),
        orderCount: data.orderCount,
        standardEmissions: savings.standardEmissions,
        actualEmissions: savings.actualEmissions,
        co2Saved: savings.totalSavings,
        inboundRoutes: data.inboundRoutes,
        outboundRoutes: data.outboundRoutes,
      });
    }
    stateEmissions.sort((a, b) => b.co2Saved - a.co2Saved);

    // Build monthly trends array
    const monthlyTrends: MonthlyTrend[] = [];
    const sortedMonths = Array.from(monthlyDataMap.keys()).sort();
    for (const monthKey of sortedMonths) {
      const data = monthlyDataMap.get(monthKey)!;
      const [year, month] = monthKey.split('-');
      const savings = calculateTotalSavings(data.totalMiles);
      monthlyTrends.push({
        month: new Date(parseInt(year), parseInt(month) - 1).toLocaleString('en-US', { month: 'short' }),
        year: parseInt(year),
        orderCount: data.orderCount,
        totalMiles: Math.round(data.totalMiles),
        standardEmissions: savings.standardEmissions,
        actualEmissions: savings.actualEmissions,
        co2Saved: savings.totalSavings,
      });
    }

    // Build top routes array
    const topRoutes: TopRoute[] = [];
    const sortedRoutes = Array.from(routeDataMap.entries())
      .sort((a, b) => b[1].orderCount - a[1].orderCount)
      .slice(0, 10);

    for (const [routeKey, data] of sortedRoutes) {
      const [originState, destinationState] = routeKey.split('-');
      const savings = calculateTotalSavings(data.totalMiles);
      topRoutes.push({
        originState,
        destinationState,
        orderCount: data.orderCount,
        totalMiles: Math.round(data.totalMiles),
        avgMiles: Math.round(data.totalMiles / data.orderCount),
        standardEmissions: savings.standardEmissions,
        actualEmissions: savings.actualEmissions,
        co2Saved: savings.totalSavings,
      });
    }

    // Build summary
    const summary: EmissionsSummary = {
      totalOrders,
      totalMiles: Math.round(totalMiles),
      totalStandardEmissions: overallSavings.standardEmissions,
      totalActualEmissions: overallSavings.actualEmissions,
      totalCO2Saved: overallSavings.totalSavings,
      percentReduction: overallSavings.percentReduction,
      b20Savings: overallSavings.b20Savings,
      fleetSavings: overallSavings.fleetSavings,
      avgMilesPerOrder: totalOrders > 0 ? Math.round(totalMiles / totalOrders) : 0,
      avgEmissionsPerOrder: totalOrders > 0 ? overallSavings.actualEmissions / totalOrders : 0,
      stateCount: stateEmissions.length,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the result
    cachedData = { summary, stateEmissions, monthlyTrends, topRoutes };
    cacheTimestamp = now;

    return NextResponse.json({
      success: true,
      data: cachedData,
    });

  } catch (error) {
    console.error('Emissions API error:', error);

    // Return demo data on error
    const demoData = generateDemoData();
    return NextResponse.json({
      success: true,
      data: demoData,
      demo: true,
      error: error instanceof Error ? error.message : 'Database connection failed',
    });
  }
}

// Generate demo data when database is unavailable
function generateDemoData(): EmissionsApiResponse['data'] {
  const stateEmissions: StateEmissions[] = [
    { state: 'TX', stateName: 'Texas', totalMiles: 2850000, orderCount: 4200, standardEmissions: 4845, actualEmissions: 3373, co2Saved: 1472, inboundRoutes: 38, outboundRoutes: 42 },
    { state: 'CA', stateName: 'California', totalMiles: 1950000, orderCount: 3500, standardEmissions: 3315, actualEmissions: 2307, co2Saved: 1008, inboundRoutes: 32, outboundRoutes: 35 },
    { state: 'IL', stateName: 'Illinois', totalMiles: 1450000, orderCount: 2800, standardEmissions: 2465, actualEmissions: 1715, co2Saved: 750, inboundRoutes: 25, outboundRoutes: 28 },
    { state: 'OH', stateName: 'Ohio', totalMiles: 1250000, orderCount: 2500, standardEmissions: 2125, actualEmissions: 1479, co2Saved: 646, inboundRoutes: 22, outboundRoutes: 25 },
    { state: 'PA', stateName: 'Pennsylvania', totalMiles: 1150000, orderCount: 2300, standardEmissions: 1955, actualEmissions: 1361, co2Saved: 594, inboundRoutes: 20, outboundRoutes: 23 },
    { state: 'GA', stateName: 'Georgia', totalMiles: 950000, orderCount: 2000, standardEmissions: 1615, actualEmissions: 1124, co2Saved: 491, inboundRoutes: 18, outboundRoutes: 20 },
    { state: 'FL', stateName: 'Florida', totalMiles: 850000, orderCount: 1800, standardEmissions: 1445, actualEmissions: 1006, co2Saved: 439, inboundRoutes: 16, outboundRoutes: 18 },
    { state: 'MI', stateName: 'Michigan', totalMiles: 750000, orderCount: 1600, standardEmissions: 1275, actualEmissions: 888, co2Saved: 387, inboundRoutes: 14, outboundRoutes: 16 },
    { state: 'NY', stateName: 'New York', totalMiles: 650000, orderCount: 1400, standardEmissions: 1105, actualEmissions: 769, co2Saved: 336, inboundRoutes: 12, outboundRoutes: 14 },
    { state: 'NC', stateName: 'North Carolina', totalMiles: 550000, orderCount: 1200, standardEmissions: 935, actualEmissions: 651, co2Saved: 284, inboundRoutes: 10, outboundRoutes: 12 },
  ];

  const monthlyTrends: MonthlyTrend[] = [
    { month: 'Mar', year: 2025, orderCount: 6800, totalMiles: 4800000, standardEmissions: 8160, actualEmissions: 5679, co2Saved: 2481 },
    { month: 'Apr', year: 2025, orderCount: 7200, totalMiles: 5100000, standardEmissions: 8670, actualEmissions: 6034, co2Saved: 2636 },
    { month: 'May', year: 2025, orderCount: 7500, totalMiles: 5350000, standardEmissions: 9095, actualEmissions: 6330, co2Saved: 2765 },
    { month: 'Jun', year: 2025, orderCount: 7800, totalMiles: 5550000, standardEmissions: 9435, actualEmissions: 6567, co2Saved: 2868 },
    { month: 'Jul', year: 2025, orderCount: 8100, totalMiles: 5800000, standardEmissions: 9860, actualEmissions: 6863, co2Saved: 2997 },
    { month: 'Aug', year: 2025, orderCount: 8400, totalMiles: 6050000, standardEmissions: 10285, actualEmissions: 7159, co2Saved: 3126 },
    { month: 'Sep', year: 2025, orderCount: 8200, totalMiles: 5900000, standardEmissions: 10030, actualEmissions: 6981, co2Saved: 3049 },
    { month: 'Oct', year: 2025, orderCount: 8500, totalMiles: 6100000, standardEmissions: 10370, actualEmissions: 7217, co2Saved: 3153 },
    { month: 'Nov', year: 2025, orderCount: 8300, totalMiles: 5950000, standardEmissions: 10115, actualEmissions: 7040, co2Saved: 3075 },
    { month: 'Dec', year: 2025, orderCount: 7900, totalMiles: 5650000, standardEmissions: 9605, actualEmissions: 6685, co2Saved: 2920 },
  ];

  const topRoutes: TopRoute[] = [
    { originState: 'TX', destinationState: 'CA', orderCount: 1250, totalMiles: 1875000, avgMiles: 1500, standardEmissions: 3188, actualEmissions: 2219, co2Saved: 969 },
    { originState: 'CA', destinationState: 'TX', orderCount: 1180, totalMiles: 1770000, avgMiles: 1500, standardEmissions: 3009, actualEmissions: 2094, co2Saved: 915 },
    { originState: 'TX', destinationState: 'IL', orderCount: 980, totalMiles: 1176000, avgMiles: 1200, standardEmissions: 1999, actualEmissions: 1391, co2Saved: 608 },
    { originState: 'IL', destinationState: 'TX', orderCount: 920, totalMiles: 1104000, avgMiles: 1200, standardEmissions: 1877, actualEmissions: 1306, co2Saved: 571 },
    { originState: 'TX', destinationState: 'GA', orderCount: 780, totalMiles: 702000, avgMiles: 900, standardEmissions: 1193, actualEmissions: 830, co2Saved: 363 },
    { originState: 'GA', destinationState: 'TX', orderCount: 750, totalMiles: 675000, avgMiles: 900, standardEmissions: 1148, actualEmissions: 799, co2Saved: 349 },
    { originState: 'CA', destinationState: 'IL', orderCount: 680, totalMiles: 1360000, avgMiles: 2000, standardEmissions: 2312, actualEmissions: 1609, co2Saved: 703 },
    { originState: 'IL', destinationState: 'CA', orderCount: 650, totalMiles: 1300000, avgMiles: 2000, standardEmissions: 2210, actualEmissions: 1538, co2Saved: 672 },
    { originState: 'TX', destinationState: 'FL', orderCount: 620, totalMiles: 744000, avgMiles: 1200, standardEmissions: 1265, actualEmissions: 880, co2Saved: 385 },
    { originState: 'FL', destinationState: 'TX', orderCount: 580, totalMiles: 696000, avgMiles: 1200, standardEmissions: 1183, actualEmissions: 823, co2Saved: 360 },
  ];

  const totalMiles = 56250000;
  const totalOrders = 78700;
  const overallSavings = calculateTotalSavings(totalMiles);

  const summary: EmissionsSummary = {
    totalOrders,
    totalMiles,
    totalStandardEmissions: overallSavings.standardEmissions,
    totalActualEmissions: overallSavings.actualEmissions,
    totalCO2Saved: overallSavings.totalSavings,
    percentReduction: overallSavings.percentReduction,
    b20Savings: overallSavings.b20Savings,
    fleetSavings: overallSavings.fleetSavings,
    avgMilesPerOrder: Math.round(totalMiles / totalOrders),
    avgEmissionsPerOrder: overallSavings.actualEmissions / totalOrders,
    stateCount: 48,
    lastUpdated: new Date().toISOString(),
  };

  return { summary, stateEmissions, monthlyTrends, topRoutes };
}

// Revalidate every hour
export const revalidate = 3600;
