'use client';

import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import type { StateEmissions } from '@/lib/types';
import { formatNumber, formatTons } from '@/lib/emissions';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// State FIPS codes to abbreviations
const stateIdToAbbr: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY',
};

interface USMapProps {
  stateEmissions: StateEmissions[];
}

export default function USMap({ stateEmissions }: USMapProps) {
  const [hoveredState, setHoveredState] = useState<StateEmissions | null>(null);

  // Create a map for quick lookup
  const stateDataMap = useMemo(() => {
    const map = new Map<string, StateEmissions>();
    stateEmissions.forEach(state => {
      map.set(state.state, state);
    });
    return map;
  }, [stateEmissions]);

  // Find max CO2 saved for color scaling
  const maxCO2Saved = useMemo(() => {
    return Math.max(...stateEmissions.map(s => s.co2Saved), 1);
  }, [stateEmissions]);

  // Get color based on CO2 saved
  const getStateColor = (abbr: string): string => {
    const data = stateDataMap.get(abbr);
    if (!data) return '#e5e7eb'; // gray for no data

    const intensity = data.co2Saved / maxCO2Saved;
    // Gradient from light green to dark green
    if (intensity > 0.8) return '#15803d';
    if (intensity > 0.6) return '#16a34a';
    if (intensity > 0.4) return '#22c55e';
    if (intensity > 0.2) return '#4ade80';
    if (intensity > 0.1) return '#86efac';
    return '#bbf7d0';
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Map header */}
      <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-xl font-bold text-gray-900">CO2 Savings by State</h3>
        <p className="text-gray-600 text-sm mt-1">Hover over states to see detailed emissions data</p>
      </div>

      {/* Map container */}
      <div className="relative">
        <ComposableMap
          projection="geoAlbersUsa"
          style={{ width: '100%', height: 'auto' }}
          projectionConfig={{
            scale: 1000,
          }}
        >
          <ZoomableGroup center={[-96, 38]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateId = geo.id;
                  const stateAbbr = stateIdToAbbr[stateId] || '';
                  const stateData = stateDataMap.get(stateAbbr);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (stateData) setHoveredState(stateData);
                      }}
                      onMouseLeave={() => setHoveredState(null)}
                      style={{
                        default: {
                          fill: getStateColor(stateAbbr),
                          stroke: '#fff',
                          strokeWidth: 0.5,
                          outline: 'none',
                        },
                        hover: {
                          fill: stateData ? '#059669' : '#d1d5db',
                          stroke: '#fff',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: stateData ? 'pointer' : 'default',
                        },
                        pressed: {
                          fill: '#047857',
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Hover tooltip */}
        {hoveredState && (
          <div className="absolute top-4 right-4 bg-white rounded-xl shadow-xl p-4 border border-gray-200 min-w-[200px] z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="font-bold text-gray-900">{hoveredState.stateName}</span>
              <span className="text-gray-500 text-sm">({hoveredState.state})</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">CO2 Saved:</span>
                <span className="font-semibold text-green-600">{formatTons(hoveredState.co2Saved)} tCO2e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Miles:</span>
                <span className="font-medium">{formatNumber(hoveredState.totalMiles)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipments:</span>
                <span className="font-medium">{formatNumber(hoveredState.orderCount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500">Less</span>
          <div className="flex">
            <div className="w-6 h-4 bg-[#bbf7d0] rounded-l" />
            <div className="w-6 h-4 bg-[#86efac]" />
            <div className="w-6 h-4 bg-[#4ade80]" />
            <div className="w-6 h-4 bg-[#22c55e]" />
            <div className="w-6 h-4 bg-[#16a34a]" />
            <div className="w-6 h-4 bg-[#15803d] rounded-r" />
          </div>
          <span className="text-xs text-gray-500">More CO2 Saved</span>
          <div className="ml-4 flex items-center gap-1">
            <div className="w-4 h-4 bg-[#e5e7eb] rounded" />
            <span className="text-xs text-gray-500">No data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
