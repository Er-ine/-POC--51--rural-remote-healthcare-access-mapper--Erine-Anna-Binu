# Rural & Remote Healthcare Access Gap Mapper

**PoC ID:** POC-51
**Rail:** Health Equity
**Author:** Erine Anna Binu
**Program:** Real Rails — Batch 6

## Overview

A healthcare intelligence platform that maps healthcare access gaps facing rural and remote populations across Gulf countries (Oman and Saudi Arabia). Gulf health systems are largely urban-centric — this dashboard makes the access gap facing interior and rural populations concrete and mappable rather than anecdotal.

## Features

- **Travel-time isochrone map** — distance-based catchment rings around each facility (30/60/90-minute bands)
- **Access-gap choropleth** — Voronoi-cell overlay shaded by travel time to nearest facility
- **Population density overlay** — graduated circles sized by settlement population
- **Facility-density vs. population scatter** — compares facility count against population by country
- **Underserved-district ranking table** — sortable table of districts by access severity
- **Mobile-clinic route panel** — suggested visitation order for the most underserved settlements
- **"Why this matters" panel** — context on the real-world stakes of healthcare access gaps
- **"Who controls the rail" panel** — key stakeholders responsible for rural health policy and infrastructure
- **Data Status indicator** — flags whether displayed data is real or synthetic
- **Synthetic-data disclaimer** — shown wherever synthetic data is displayed

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Mapping | Leaflet.js (react-leaflet), Turf.js |
| Data Visualization | D3.js |
| Backend | FastAPI (Python) |
| Data Processing | Pandas |

## Data Sources

This PoC uses synthetic data modeled on the structure and scope of the following real-world sources:

- **WHO health workforce rural retention guidance** — informs the access-gap severity thresholds
- **OpenStreetMap / Overpass healthcare POIs** — reference structure for facility location data
- **Oman National Spatial Data Infrastructure (NSDI)** — reference structure for Omani settlement/boundary data
- **Saudi MOH rural health centre directory** — reference structure for Saudi facility data

All settlement, facility, and travel-time figures in this build are **synthetic/sample data** generated for demonstration purposes and do not represent verified real-world records.

## Getting Started

### Backend
```bash
cd backend
py -m uvicorn app.main:app --reload
```
Runs on `http://127.0.0.1:8000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`.

## Project Structure
├── backend/
│ └── app/ # FastAPI application
├── frontend/
│ ├── app/ # Next.js pages
│ ├── components/ # UI components (map, panels, tables)
│ └── lib/ # Mock data
├── docs/ # Submission documentation
├── README.md
├── ARCHITECTURE.md
├── AI_USAGE.md
├── VAR_REPORT.md
└── UAT_CHECKLIST.md


## Known Limitations

- Isochrone bands are distance-based approximations, not real road-network routing (no routing engine available for this PoC)
- Choropleth uses Voronoi cells as a stand-in for real administrative district boundaries
- Facility-density scatter is aggregated at country level (mock data has no sub-district field)
- Mobile-clinic routing uses a simple farthest-first heuristic, not a real optimization/VRP solver

## Submission Documentation

See `ARCHITECTURE.md`, `AI_USAGE.md`, `VAR_REPORT.md`, and `UAT_CHECKLIST.md` for full engineering review, AI usage disclosure, and testing records.