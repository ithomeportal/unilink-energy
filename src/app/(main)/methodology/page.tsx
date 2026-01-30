'use client';

import Link from 'next/link';
import {
  Calculator,
  BookOpen,
  Database,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Info,
  BarChart3,
  ArrowRight
} from 'lucide-react';

const emissionFactors = [
  {
    factor: 'CO2 per Gallon of Diesel',
    value: '10.21 kg',
    source: 'EPA Emission Factors Hub',
    notes: 'Combustion emissions from burning one gallon of diesel fuel',
  },
  {
    factor: 'Average Truck MPG',
    value: '6 MPG',
    source: 'American Transportation Research Institute',
    notes: 'Average fuel economy for Class 8 trucks in long-haul operations',
  },
  {
    factor: 'B20 Biodiesel CO2 Reduction',
    value: '~17%',
    source: 'US Department of Energy',
    notes: 'Lifecycle emissions reduction from 20% biodiesel blend vs petroleum diesel',
  },
  {
    factor: 'Modern Fleet Efficiency Gain',
    value: '~12%',
    source: 'EPA SmartWay Program',
    notes: 'Average fuel efficiency improvement of 2016+ trucks vs older models',
  },
];

const dataFlow = [
  {
    step: 1,
    title: 'Data Collection',
    description: 'Order data including origin, destination, and mileage is collected from our McLeod TMS system.',
    icon: Database,
  },
  {
    step: 2,
    title: 'Distance Calculation',
    description: 'For orders without mileage, distance is calculated using Haversine formula from GPS coordinates.',
    icon: Calculator,
  },
  {
    step: 3,
    title: 'Emissions Calculation',
    description: 'CO2 emissions calculated using EPA factors: (Miles / MPG) × CO2 per gallon.',
    icon: BarChart3,
  },
  {
    step: 4,
    title: 'Savings Applied',
    description: 'B20 and modern fleet reductions applied to show actual vs standard emissions.',
    icon: RefreshCw,
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-eco py-16">
        <div className="container-custom text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <BookOpen size={18} />
              <span className="text-sm font-medium">Calculation Methodology</span>
            </div>
            <h1 className="heading-1 mb-6">How We Calculate CO2 Savings</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Transparency is key to our sustainability reporting. Here&apos;s exactly how we calculate
              the carbon footprint savings from our green carrier policies.
            </p>
          </div>
        </div>
      </section>

      {/* Core Formula */}
      <section className="container-custom -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calculator size={24} className="text-green-600" />
            Core Calculation Formula
          </h2>

          <div className="bg-gray-900 text-green-400 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <p className="text-gray-500 mb-4"># Standard Emissions (without policies)</p>
            <p className="mb-2">gallons_used = total_miles / truck_mpg</p>
            <p className="mb-4">standard_co2 = gallons_used × 10.21 kg/gallon</p>

            <p className="text-gray-500 mb-4"># Actual Emissions (with B20 + Modern Fleet)</p>
            <p className="mb-2">b20_factor = 1 - 0.17  <span className="text-gray-500"># 17% reduction</span></p>
            <p className="mb-2">fleet_factor = 1 - 0.12  <span className="text-gray-500"># 12% efficiency gain</span></p>
            <p className="mb-4">actual_co2 = standard_co2 × b20_factor × fleet_factor</p>

            <p className="text-gray-500 mb-4"># CO2 Savings</p>
            <p className="mb-2">co2_saved = standard_co2 - actual_co2</p>
            <p className="text-yellow-400">percent_reduction ≈ 27%  <span className="text-gray-500"># Combined effect</span></p>
          </div>

          <div className="mt-6 flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> The combined reduction of ~27% is slightly less than 17% + 12% = 29% due to
              how percentage reductions compound. The actual formula is: 1 - (0.83 × 0.88) = ~27%.
            </p>
          </div>
        </div>
      </section>

      {/* Emission Factors */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">Emission Factors Used</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All calculations use peer-reviewed emission factors from authoritative sources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {emissionFactors.map((factor, index) => (
              <div key={index} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-900">{factor.factor}</h3>
                  <span className="text-2xl font-bold text-green-600">{factor.value}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{factor.notes}</p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <ExternalLink size={14} />
                  <span>Source: {factor.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Flow */}
      <section className="bg-white section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">Data Processing Pipeline</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              How order data flows from our systems to the emissions calculations you see on the dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataFlow.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  <div className="card p-6 h-full">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <Icon size={24} className="text-green-600" />
                    </div>
                    <div className="text-sm text-gray-400 mb-2">Step {item.step}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  {item.step < 4 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight size={24} className="text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Assumptions & Limitations */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-2 text-gray-900 mb-8 text-center">Assumptions & Limitations</h2>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  Fuel Economy Assumption
                </h3>
                <p className="text-gray-600">
                  We use an average of 6 MPG for heavy-duty trucks. Actual fuel economy varies based on
                  load weight, terrain, traffic, and driving conditions. This is a conservative estimate
                  based on industry averages from ATRI.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  B20 Availability
                </h3>
                <p className="text-gray-600">
                  While our policy requires B20 biodiesel, actual blend percentages may vary slightly based on
                  regional fuel availability. The 17% reduction factor represents the expected lifecycle
                  emissions reduction from a standard B20 blend.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  Fleet Age Efficiency
                </h3>
                <p className="text-gray-600">
                  The 12% efficiency improvement for newer trucks is an average. Actual improvements depend
                  on specific engine technology, aerodynamics, and maintenance. We use EPA SmartWay data
                  as our baseline for modern truck efficiency.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  Scope of Emissions
                </h3>
                <p className="text-gray-600">
                  These calculations cover Scope 3 emissions from contracted carrier transportation only.
                  They do not include upstream fuel production emissions, vehicle manufacturing, or
                  Unilink&apos;s own Scope 1 and 2 emissions (office facilities, IT infrastructure).
                </p>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  Distance Calculation
                </h3>
                <p className="text-gray-600">
                  When actual mileage is not available from the order, we calculate distance using the
                  Haversine formula (great-circle distance). This may differ slightly from actual road
                  distances but provides consistent, reproducible results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-2 text-gray-900 mb-8 text-center">References & Sources</h2>

            <div className="space-y-4">
              <a
                href="https://www.epa.gov/climateleadership/ghg-emission-factors-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <p className="font-semibold text-gray-900">EPA GHG Emission Factors Hub</p>
                  <p className="text-gray-600 text-sm">Official emission factors for fuel combustion</p>
                </div>
                <ExternalLink size={20} className="text-gray-400" />
              </a>

              <a
                href="https://afdc.energy.gov/fuels/biodiesel_benefits.html"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <p className="font-semibold text-gray-900">US DOE Alternative Fuels Data Center</p>
                  <p className="text-gray-600 text-sm">Biodiesel benefits and emission reductions</p>
                </div>
                <ExternalLink size={20} className="text-gray-400" />
              </a>

              <a
                href="https://www.epa.gov/smartway"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <p className="font-semibold text-gray-900">EPA SmartWay Program</p>
                  <p className="text-gray-600 text-sm">Freight transportation efficiency benchmarks - Unilink is a SmartWay Partner</p>
                </div>
                <ExternalLink size={20} className="text-gray-400" />
              </a>

              <a
                href="https://truckingresearch.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <p className="font-semibold text-gray-900">American Transportation Research Institute</p>
                  <p className="text-gray-600 text-sm">Trucking industry operational data</p>
                </div>
                <ExternalLink size={20} className="text-gray-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-eco section-padding">
        <div className="container-custom text-center text-white">
          <h2 className="heading-2 mb-4">See Our Calculations in Action</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            View real-time emissions data calculated using this methodology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard" className="btn-green flex items-center gap-2">
              <BarChart3 size={20} />
              View Dashboard
            </Link>
            <Link href="/" className="btn-secondary flex items-center gap-2">
              Back to Home
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
