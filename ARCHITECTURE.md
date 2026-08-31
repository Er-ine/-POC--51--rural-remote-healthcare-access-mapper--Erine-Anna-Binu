# Architecture Summary — POC-51: Rural & Remote Healthcare Access Mapper

## Overview
A healthcare intelligence platform that maps rural and remote healthcare access gaps across Gulf populations, surfacing coverage deserts, facility density, and access risk through interactive visualizations.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| Frontend | Next.js + TypeScript + Tailwind CSS |
| Database | [DuckDB / PostgreSQL / file-based — fill in] |
| Visualization | [e.g. D3.js / Plotly / Mapbox / MapLibre GL — fill in] |
| Data Source(s) | [e.g. public health facility datasets, population density, synthetic access-gap data — fill in] |

## System Architecture

```
┌─────────────┐      REST API      ┌──────────────┐      ┌─────────────┐
│   Frontend   │ ─────────────────▶ │   FastAPI     │ ───▶ │  Database /  │
│  (Next.js)   │ ◀───────────────── │   Backend     │ ◀─── │  Data Layer  │
└─────────────┘                     └──────────────┘      └─────────────┘
```

- **Frontend (`frontend/`)**: Renders the access-gap map/dashboard, handles filters, and calls backend REST endpoints for facility, population, and gap-analysis data.
- **Backend (`backend/app/`)**: FastAPI service exposing endpoints for [list key endpoints — e.g. `/facilities`, `/access-gaps`, `/regions`]. Handles data loading, gap-scoring logic, and filtering.
- **Data Layer**: [Describe how data is stored/loaded — static files, DuckDB queries, etc.]

## Key Features
- [Facility mapping / geospatial visualization]
- [Access-gap scoring or heatmap logic]
- [Filters — region, facility type, population segment, etc.]
- [Explainability / "why this gap matters" panel, if implemented]

## Data Flow
1. Raw data ([source]) is loaded/processed into [format].
2. FastAPI backend serves processed data via REST endpoints.
3. Next.js frontend fetches data client-side and renders it on the map/dashboard.
4. User interactions (filters, drill-downs) trigger new API calls or client-side re-filtering.

## Design Decisions
- [Why FastAPI + Next.js — reuse of Phase 0/PoC-1 stack for speed and consistency]
- [Any notable trade-offs made for a PoC timeline]

## Known Limitations
- [Data is synthetic/sample-based, not live production data]
- [Any features scoped out of this PoC]