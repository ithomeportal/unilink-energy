// EPA Standards for CO2 Emissions Calculations
// Source: EPA Emission Factors Hub

// Constants
export const CO2_PER_GALLON_DIESEL = 10.21; // kg CO2 per gallon of diesel
export const TRUCK_MPG = 6; // Average fuel economy for heavy-duty trucks
export const B20_REDUCTION_PERCENT = 0.17; // B20 biodiesel reduces CO2 by ~17%
export const MODERN_FLEET_EFFICIENCY_GAIN = 0.12; // Trucks <9 years old are ~12% more efficient

// Calculate CO2 emissions for a given distance in miles
export function calculateCO2(miles: number): number {
  // Gallons needed = miles / mpg
  // CO2 = gallons * CO2_per_gallon
  const gallons = miles / TRUCK_MPG;
  const co2Kg = gallons * CO2_PER_GALLON_DIESEL;
  return co2Kg / 1000; // Convert to metric tons (tCO2e)
}

// Calculate CO2 savings from B20 biodiesel vs regular diesel
export function calculateB20Savings(miles: number): number {
  const standardCO2 = calculateCO2(miles);
  const b20CO2 = standardCO2 * (1 - B20_REDUCTION_PERCENT);
  return standardCO2 - b20CO2; // Savings in tCO2e
}

// Calculate CO2 savings from using newer fleet (< 9 years old)
export function calculateModernFleetSavings(miles: number): number {
  const standardCO2 = calculateCO2(miles);
  const modernCO2 = standardCO2 * (1 - MODERN_FLEET_EFFICIENCY_GAIN);
  return standardCO2 - modernCO2; // Savings in tCO2e
}

// Calculate total CO2 savings from both policies
export function calculateTotalSavings(miles: number): {
  standardEmissions: number;
  actualEmissions: number;
  b20Savings: number;
  fleetSavings: number;
  totalSavings: number;
  percentReduction: number;
} {
  const standardEmissions = calculateCO2(miles);
  const b20Savings = calculateB20Savings(miles);
  const fleetSavings = calculateModernFleetSavings(miles);

  // Combined savings (avoiding double counting)
  const combinedReduction = 1 - ((1 - B20_REDUCTION_PERCENT) * (1 - MODERN_FLEET_EFFICIENCY_GAIN));
  const actualEmissions = standardEmissions * (1 - combinedReduction);
  const totalSavings = standardEmissions - actualEmissions;
  const percentReduction = (totalSavings / standardEmissions) * 100;

  return {
    standardEmissions,
    actualEmissions,
    b20Savings,
    fleetSavings,
    totalSavings,
    percentReduction,
  };
}

// Format number with commas
export function formatNumber(num: number | null | undefined, decimals: number = 0): string {
  if (num == null) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Format as percentage
export function formatPercent(num: number | null | undefined, decimals: number = 1): string {
  if (num == null) return '0%';
  return `${num.toFixed(decimals)}%`;
}

// Format as metric tons
export function formatTons(num: number | null | undefined): string {
  if (num == null) return '0';
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(1);
}

// US States data for mapping
export const US_STATES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
};
