# Claude Memory File - Unilink Energy Dashboard

## Quick Reference

### Project Location
```
/home/dfrvbee/BOT/carbon-foot/energy-subdomain/
```

### Key URLs
- **Live Site**: https://energy.unilinktransportation.com
- **GitHub**: https://github.com/ithomeportal/unilink-energy
- **Main Company Site**: https://unilinktransportation.com

### Credentials (for reference)
- **GitHub**: ithomeportal (token in separate secure location)
- **Vercel**: ithome@unilinkportal.com
- **Database**: Aiven PostgreSQL (see .env.local or credentials file)
- **System Access**: See parent folder credentials files

---

## What This Project Does

Unilink Transportation is a **3PL logistics company** (they don't own trucks, they contract carriers).

Since **March 2025**, they require ALL contracted carriers to:
1. Use **B20 biodiesel** (20% biodiesel, 80% petroleum) = ~17% CO2 reduction
2. Have **power units < 9 years old** = ~12% efficiency improvement
3. **Combined reduction**: ~27%

This website displays their CO2 savings publicly as a sustainability commitment.

---

## Technical Notes

### CO2 Calculation Formula
```
Standard CO2 = (Miles / 6 MPG) × 10.21 kg CO2/gallon
Actual CO2 = Standard CO2 × 0.83 (B20) × 0.88 (Modern Fleet)
CO2 Saved = Standard CO2 - Actual CO2
```

### Database Table
`mcleod_gld_budget_report_v4` in Aiven PostgreSQL

**Known Column Issues**:
- Use `ordered_date` not `order_date`
- May need `origin_state_id` instead of `origin_state`
- Demo data fallback works when DB fails

### Key Dependencies
- Next.js 14.2.0
- react-chartjs-2 + chart.js
- react-simple-maps (for US map)
- pg (PostgreSQL client)
- lucide-react (icons)
- Tailwind CSS

---

## Recent Changes (Session 2 - Dec 17, 2024)

1. Added 2024 vs 2025 year-over-year comparison section
2. Added EcoVadis certification section
3. Added GHG Protocol Scope 1, 2, 3 explanation section
4. Fixed header visibility (dark background on all sections)
5. Created green Unilink logo from original red
6. Added interactive US map with state-by-state CO2 savings
7. Updated Header and Footer with new logo

---

## Common Tasks

### Build & Deploy
```bash
cd /home/dfrvbee/BOT/carbon-foot/energy-subdomain
npm run build
git add -A && git commit -m "message" && git push origin main
# Vercel auto-deploys from GitHub
```

### Start Dev Server
```bash
npm run dev
# Opens at http://localhost:3000
```

### View Build Output
```bash
npm run build 2>&1 | tail -30
```

---

## Files to Know

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage with all sections |
| `src/app/api/emissions/route.ts` | API endpoint |
| `src/lib/emissions.ts` | CO2 calculations |
| `src/components/USMap.tsx` | Interactive map |
| `src/components/Header.tsx` | Navigation |
| `public/unilink-logo-green.png` | Green logo |

---

## Troubleshooting

### "Demo data" showing instead of real data
- Check Vercel environment variables
- May need to whitelist Vercel IPs in Aiven
- Check column names match database schema

### TypeScript errors
- `tsconfig.json` has `downlevelIteration: true` and `target: ES2017`
- Types for react-simple-maps: `@types/react-simple-maps`

### Logo color conversion
```bash
# Red to green using ImageMagick
convert source.png -fuzz 30% -fill '#22c55e' -opaque '#a00' output.png
```

---

## Contact Context

- **Sustainability Email**: sustainability@unilinktransportation.com
- **EcoVadis**: Company participates in logistics industry program
- **EPA Standards**: Compliant with GHG emission factors
