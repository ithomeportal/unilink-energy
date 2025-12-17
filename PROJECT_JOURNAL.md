# Unilink Energy & Sustainability Dashboard - Project Journal

## Project Overview
**Domain**: https://energy.unilinktransportation.com
**Repository**: https://github.com/ithomeportal/unilink-energy
**Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Chart.js, PostgreSQL (Aiven)

## Purpose
Public-facing carbon footprint and sustainability dashboard for Unilink Transportation, a 3PL logistics company that doesn't own trucks but contracts carriers with strict green requirements.

---

## Development Timeline

### Session 1 - Initial Build (December 2024)

#### Project Setup
- Created Next.js 14 project with TypeScript and Tailwind CSS
- Set up PostgreSQL connection to Aiven database
- Configured for Vercel deployment

#### Core Features Implemented
1. **Homepage with Hero Section**
   - Real-time metrics display (CO2 saved, reduction %, shipments, states)
   - Animated scroll indicator
   - Green/blue sustainability color scheme

2. **API Endpoint** (`/api/emissions`)
   - Queries `mcleod_gld_budget_report_v4` table
   - Calculates CO2 emissions using EPA standards
   - Demo data fallback when database unavailable
   - 1-hour caching for performance

3. **Emissions Calculations**
   - Base: 10.21 kg CO2 per gallon diesel, 6 MPG truck average
   - B20 Biodiesel: ~17% CO2 reduction
   - Modern Fleet (<9 years): ~12% efficiency improvement
   - Combined: ~27% total reduction

4. **Pages Created**
   - `/` - Homepage with metrics and charts
   - `/dashboard` - State-by-state analysis
   - `/initiatives` - Green policies detail
   - `/methodology` - Calculation methodology

5. **Charts**
   - Monthly emissions trend (line chart)
   - Savings breakdown (doughnut chart)
   - Top states by CO2 saved (bar chart)

---

### Session 2 - Enhancements (December 17, 2025)

#### New Features Added

1. **Year-over-Year Comparison Section**
   - 2024 baseline (before policies) vs 2025 current (with policies)
   - Visual side-by-side comparison cards
   - Shows transformation with B20 and modern fleet requirements

2. **EcoVadis Certification Section**
   - Highlights participation in EcoVadis sustainability ratings
   - Logistics industry program focus
   - Professional dark-themed section with info cards

3. **GHG Protocol Scope 1, 2, 3 Section**
   - Explains emissions scopes per GHG Protocol
   - Shows Scope 3 is primary focus for 3PLs (90%+ of emissions)
   - Scope 3 strategy breakdown with category impact bars
   - Educational info about why Scope 3 matters for logistics

4. **Header Improvements**
   - Fixed visibility issue - dark background when not scrolled
   - Text now visible on all page sections

5. **Green Unilink Logo**
   - Converted original red logo to green using ImageMagick
   - Created: `unilink-logo-green.png`, `icon.png`, `apple-icon.png`, `opengraph-image.png`
   - SVG versions: `logo-green.svg`, `logo-white.svg`
   - Updated Header and Footer to use new logo

6. **Interactive US Map**
   - Added `react-simple-maps` for geographic visualization
   - Shows CO2 savings by state with hover tooltips
   - Color gradient legend (light to dark green)
   - Geographic impact section with summary stats

7. **Footer Updates**
   - Added EcoVadis Rated badge with link
   - Updated logo to green version

8. **Competitive Data Removal**
   - Removed order counts and total miles from all displays
   - Replaced with CO2 emissions metrics only
   - Changed "Green Shipments" to "100% Green Carrier Compliance"
   - Updated dashboard tables to show emissions instead of volume

9. **Dynamic Time Period Selector**
   - Added selector buttons: Last 12 Months, Year to Date, Current Year vs Baseline
   - Period-specific data calculated from monthly trends
   - Automatically handles new years (2026, 2027, etc.)
   - Labels update dynamically based on selected period

---

## Database Configuration

**Connection**: Aiven PostgreSQL
```
Host: pg-111cab4b-unlkdata.b.aivencloud.com
Port: 10261
Database: aivn_datalake_gold
User: avnadmin
Table: mcleod_gld_budget_report_v4
```

**Column Names** (verified):
- `ordered_date` (not `order_date`)
- `origin_state_id` (may need adjustment from `origin_state`)
- `miles`, `origin_lat`, `origin_lon`, `dest_lat`, `dest_lon`

**Note**: Demo data fallback is functioning. Database column mapping may need refinement for production data.

---

## Key Files

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript with ES2017 target, downlevelIteration
- `.env.local` - Database credentials (not committed)

### Core Code
- `src/lib/db.ts` - PostgreSQL connection pool
- `src/lib/emissions.ts` - CO2 calculation utilities
- `src/lib/types.ts` - TypeScript interfaces
- `src/app/api/emissions/route.ts` - API endpoint

### Pages
- `src/app/page.tsx` - Homepage (~850 lines)
- `src/app/dashboard/page.tsx` - State analysis
- `src/app/initiatives/page.tsx` - Policies page
- `src/app/methodology/page.tsx` - Calculation details

### Components
- `src/components/Header.tsx` - Navigation with logo
- `src/components/Footer.tsx` - Footer with certifications
- `src/components/USMap.tsx` - Interactive US map

### Assets
- `public/unilink-logo-green.png` - Main logo
- `public/icon.png` - Favicon (256x256)
- `public/apple-icon.png` - Apple touch icon
- `public/opengraph-image.png` - Social sharing image

---

## Deployment

**Platform**: Vercel
**Domain**: energy.unilinktransportation.com

### Environment Variables Required
```
DATABASE_HOST=pg-111cab4b-unlkdata.b.aivencloud.com
DATABASE_PORT=10261
DATABASE_USER=avnadmin
DATABASE_PASSWORD=[password]
DATABASE_NAME=aivn_datalake_gold
DATABASE_SSL=require
```

---

## Future Considerations

1. **Database Schema**: Verify and fix column names for production data
2. **IP Whitelisting**: May need to whitelist Vercel IPs in Aiven
3. **Real-time Data**: Currently uses 1-hour cache
4. **Additional Charts**: Route efficiency analysis, carrier rankings
5. **Export Features**: PDF reports, CSV downloads
6. **Mobile Optimization**: Further responsive improvements
