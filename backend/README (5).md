# Rural & Remote Healthcare Access Gap Mapper (POC 51)

A healthcare intelligence platform for mapping rural and remote healthcare access gaps across Gulf populations — built for the **Real Rails Batch 6** cohort under the **Health Equity** rail.

## Overview

Access to healthcare in rural and remote parts of the Gulf region is uneven, and that unevenness is hard to see without the right tools. This platform brings together public and reference data on healthcare facilities, travel times, and population density to surface **where** access gaps exist, **how severe** they are, and **what could close them** — turning scattered geographic and demographic data into an actionable, map-first intelligence view.

This is a proof-of-concept (POC) built to demonstrate the approach with a combination of real public data sources and clearly labeled synthetic/mock data where real data isn't yet available.

## Key Features

- **Travel-time isochrone map** — visualizes how far populations are from the nearest healthcare facility, by travel time rather than straight-line distance
- **Access-gap choropleth** — district/region-level shading showing severity of healthcare access gaps
- **Facility-density vs. population scatter** — correlates facility availability against population to highlight under-resourced areas
- **Underserved-district ranking table** — ranks districts by access-gap severity for prioritization
- **Mobile-clinic route optimisation panel** — suggests routing for mobile healthcare units to reach underserved areas
- **"Why this matters" panel** — context on the real-world impact of healthcare access gaps
- **"Who controls the rail" panel** — governance/stakeholder context for the Health Equity rail

## Data Sources

- WHO health workforce rural retention guidance
- OpenStreetMap / Overpass API — healthcare points of interest
- Oman National Spatial Data Infrastructure
- Saudi MOH rural health centre directory
- Synthetic/mock data (clearly labeled in the UI) for travel-time estimates, facility capacity, specialty availability, and population density where authoritative sources are unavailable

A **Data Status indicator** in the UI distinguishes real reference data from synthetic data at all times.

## Tech Stack

**Frontend**
- Next.js
- React + TypeScript
- Tailwind CSS
- shadcn/ui
- Leaflet.js (mapping)
- Turf.js (geospatial analysis)
- D3.js (data visualization)

**Backend**
- FastAPI (Python)
- Pandas (data processing)

## Project Structure

```
.
├── backend/
│   └── app/
│       ├── data_access/       # Data access layer for reference/synthetic datasets
│       ├── models/             # Pydantic schemas
│       ├── routes/             # API routes (e.g. analysis)
│       └── services/           # Business logic (e.g. accessibility scoring)
├── docs/                       # methodology.md, data-sources.md, and other project docs
├── frontend/                   # Next.js application
├── package.json
└── README.md
```

## Design Principles

- **Fixed scoring, no configurable weight sliders** — scoring logic is deterministic and transparent rather than user-tunable
- **Explicit data provenance** — every dataset is tagged with its source and real/synthetic status
- **No real routing engine or complex VRP** — route optimisation is illustrative, not production-grade logistics
- **No ML** — the POC favors transparent, explainable analysis over black-box models
- **Professional healthcare intelligence platform look and feel** — map-first storytelling with strong visual hierarchy, not a student dashboard

## Getting Started

### Prerequisites
- Node.js (for the frontend)
- Python 3.x (for the backend)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> Adjust the above commands if your actual entry points or dependency files differ.

## Documentation

See the [`docs/`](./docs) directory for:
- `methodology.md` — how access gaps are calculated
- `data-sources.md` — full breakdown of data sources and provenance

## Engineering Workflow

This project follows the Real Rails engineering workflow:
**Repomix → AI Handshake → Architecture Review → Implementation → VAR → UAT → Submission**

## Author

**Erine Anna Binu** — Computer Science undergraduate, Muthoot Institute of Technology and Science (MITS)

## License

_Add a license if you intend to open-source this project._
