// Database record types
export interface BudgetReportRecord {
  id: number;
  order_date: Date;
  order_number: string;
  payee_name: string;
  carrier_dot: string;
  carrier_mc: string;
  equipment_type: string;
  equipment_type_id: string;
  equipment_type_descr: string;
  origin_city: string;
  origin_state: string;
  origin_zip: string;
  origin_lat: number;
  origin_lon: number;
  destination_city: string;
  destination_state: string;
  destination_zip: string;
  dest_lat: number;
  dest_lon: number;
  total_carrier_cost: number;
  linehaul_cost: number;
  fuel_surcharge: number;
  accessorial_charges: number;
  miles?: number;
  created_at: Date;
}

// Aggregated emissions data by state
export interface StateEmissions {
  state: string;
  stateName: string;
  totalMiles: number;
  orderCount: number;
  standardEmissions: number;
  actualEmissions: number;
  co2Saved: number;
  inboundRoutes: number;
  outboundRoutes: number;
}

// Summary metrics
export interface EmissionsSummary {
  totalOrders: number;
  totalMiles: number;
  totalStandardEmissions: number;
  totalActualEmissions: number;
  totalCO2Saved: number;
  percentReduction: number;
  b20Savings: number;
  fleetSavings: number;
  avgMilesPerOrder: number;
  avgEmissionsPerOrder: number;
  stateCount: number;
  lastUpdated: string;
}

// Monthly trend data
export interface MonthlyTrend {
  month: string;
  year: number;
  orderCount: number;
  totalMiles: number;
  standardEmissions: number;
  actualEmissions: number;
  co2Saved: number;
}

// Top routes data
export interface TopRoute {
  originState: string;
  destinationState: string;
  orderCount: number;
  totalMiles: number;
  avgMiles: number;
  standardEmissions: number;
  actualEmissions: number;
  co2Saved: number;
}

// API response types
export interface EmissionsApiResponse {
  success: boolean;
  data: {
    summary: EmissionsSummary;
    stateEmissions: StateEmissions[];
    monthlyTrends: MonthlyTrend[];
    topRoutes: TopRoute[];
  };
  error?: string;
}

// Chart data types for Chart.js
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}
