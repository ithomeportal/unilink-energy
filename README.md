# Unilink Energy & Sustainability Dashboard

Real-time carbon footprint tracking and sustainability reporting for Unilink Transportation.

## Overview

This public-facing website displays real-time CO2 emissions data and savings from Unilink Transportation's green carrier policies:

- **B20 Biodiesel Requirement**: All US carriers must use B20 biodiesel (~17% CO2 reduction)
- **Modern Fleet Standard**: All power units must be less than 9 years old (~12% efficiency improvement)

Combined, these policies reduce our carbon footprint by approximately **27%** compared to industry standard operations.

## Features

- Real-time emissions data from operational database
- State-by-state emissions breakdown
- Top routes analysis
- Monthly trend tracking
- Methodology documentation
- Responsive design matching Unilink branding

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Database**: PostgreSQL (Aiven)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure your database credentials in .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Environment Variables

```
DATABASE_HOST=your-database-host
DATABASE_PORT=10261
DATABASE_USER=your-username
DATABASE_PASSWORD=your-password
DATABASE_NAME=aivn_datalake_gold
DATABASE_SSL=require
```

## Project Structure

```
src/
├── app/
│   ├── api/emissions/     # API routes for emissions data
│   ├── dashboard/         # State analysis page
│   ├── initiatives/       # Policies and initiatives page
│   ├── methodology/       # Calculation methodology page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   └── index.ts           # Component exports
└── lib/
    ├── db.ts              # Database connection
    ├── emissions.ts       # CO2 calculation utilities
    └── types.ts           # TypeScript interfaces
```

## Emission Calculation Methodology

### Formula

```
Standard CO2 = (Miles / 6 MPG) × 10.21 kg CO2/gallon
Actual CO2 = Standard CO2 × 0.83 (B20) × 0.88 (Modern Fleet)
CO2 Saved = Standard CO2 - Actual CO2
```

### Sources

- EPA GHG Emission Factors Hub
- US DOE Alternative Fuels Data Center
- EPA SmartWay Program
- American Transportation Research Institute

## Deployment

The site is configured for Vercel deployment:

```bash
# Build for production
npm run build

# Or deploy directly
vercel
```

## Data Updates

- Database data is refreshed daily
- API responses are cached for 1 hour
- Demo data is shown if database is unavailable

## License

Proprietary - Unilink Transportation
