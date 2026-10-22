# Frontend — Rural & Remote Healthcare Access Gap Mapper

The client application for **POC-51 (Rural & Remote Healthcare Access Gap Mapper)**, built using **Next.js 16 (App Router & Turbopack)**, **React 19**, **Tailwind CSS 4**, and **Leaflet / React-Leaflet**.

---

## Architecture Overview

The frontend serves as an operational geospatial intelligence interface for healthcare planners and researchers. Rather than presenting a conventional card-based dashboard, it prioritizes a full-viewport interactive map canvas overlaid with floating telemetry HUDs, a right slide-over intelligence panel, and an expandable bottom analytics dock.

```
frontend/
├── app/
│   ├── favicon.ico
│   ├── globals.css         # Tailwind 4 @theme tokens & Leaflet custom dark skin
│   ├── layout.tsx          # Root HTML shell & metadata
│   └── page.tsx            # Fullscreen canvas, state management, HUD, slide-over, bottom dock
├── components/
│   ├── AnalyticsStrip.tsx  # Telemetry cards for travel horizons and population impact
│   ├── DataStatusBadge.tsx # Popover component breaking down data provenance
│   ├── FacilityDensityScatter.tsx # D3.js SVG scatter plot for facility density vs population
│   ├── HealthcareMap.tsx   # React-Leaflet canvas, Esri dark tiles, Turf.js isochrones, Voronoi cells
│   ├── IntelligenceSidebar.tsx # Right slide-over panel with deep settlement analysis
│   ├── MobileClinicPanel.tsx # Distance-sorted heuristic sequence for mobile clinic visits
│   ├── ProjectInfoModal.tsx # Accessible system specifications, architect, and tech stack dialog
│   ├── RankingTable.tsx    # Multi-column sortable table of underserved localities
│   ├── SyntheticDataDisclaimer.tsx # Dismissible demonstration disclosure sub-bar
│   ├── WhoControlsTheRailPanel.tsx # Healthcare governance and institutional stakeholder matrix
│   └── WhyThisMattersPanel.tsx # Narrative context on clinical equity and access burdens
├── lib/
│   └── mockData.ts         # Settlement coordinates, populations, and facility registry
├── package.json
└── tsconfig.json
```

---

## Component Inventory

| Component | Role & Interactions |
| :--- | :--- |
| [`HealthcareMap.tsx`](components/HealthcareMap.tsx) | Leaflet map with Esri World Dark Gray Canvas, Turf.js multi-ring circular catchments (30/60/90 min), D3 Voronoi choropleth, population circles, and custom glowing teal `✚` facility pins. Supports automatic resize invalidation. |
| [`IntelligenceSidebar.tsx`](components/IntelligenceSidebar.tsx) | Slide-over drawer that displays selected settlement details, population, geodesic distance to care, nearest hospital, deterministic priority score (0–100), and policy recommendations. Closes via `Escape` key or close button. |
| [`AnalyticsStrip.tsx`](components/AnalyticsStrip.tsx) | Visual telemetry cards displaying travel-time distribution bands (&le;30 min, 31–60 min, &gt;60 min), population impact ratio, and average distance to facilities. |
| [`RankingTable.tsx`](components/RankingTable.tsx) | Interactive table of underserved settlements with client-side sorting by distance, population, locality name, and country. Clicking any row selects and inspects that settlement. |
| [`FacilityDensityScatter.tsx`](components/FacilityDensityScatter.tsx) | Strictly typed D3.js scatter plot comparing national population against facility counts with dashed reference gridlines. |
| [`MobileClinicPanel.tsx`](components/MobileClinicPanel.tsx) | Distance-prioritized mobile clinic route stops with click-to-locate actions. |
| [`ProjectInfoModal.tsx`](components/ProjectInfoModal.tsx) | Accessible modal dialog detailing project title, program (Infocreon Internship Batch 6), POC ID (51), architect (Erine Anna Binu), and verified technology versions. |
| [`DataStatusBadge.tsx`](components/DataStatusBadge.tsx) | Header badge with a popover distinguishing real-based facility names from synthetic populations and travel times. |
| [`SyntheticDataDisclaimer.tsx`](components/SyntheticDataDisclaimer.tsx) | Dismissible notification sub-bar directly below the header disclosing synthetic demo models. |

---

## Color System & Visual Language

Styling is implemented in Tailwind CSS 4 using theme tokens defined in [`app/globals.css`](app/globals.css):

- **Canvas Background:** `#06161A`
- **Primary Surface:** `#0A1F24`
- **Secondary Surface:** `#0E2A30`
- **Elevated Surface:** `#133840`
- **Primary Accent:** `#2DD4BF` (Teal)
- **Accent Hover:** `#5EEAD4`
- **Subtle Borders:** `rgba(45, 212, 191, 0.18)`
- **Text Main:** `#F0FDFA` (Accessible off-white)
- **Text Muted:** `#94A3B8` (Blue-grey)

---

## Scripts & Development

From the `frontend/` directory:

```bash
# Install dependencies
npm install

# Run development server (Turbopack)
npm run dev

# Run ESLint validation
npm run lint

# Build for production
npm run build

# Start production server
npm run start -- -p 3000
```

---

## Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000` | Base URL for the FastAPI backend analysis service |

---

## Verification & Code Quality

- **Lint:** ESLint 9 configuration validated with 0 errors and 0 warnings.
- **Type Checking:** Strict TypeScript with no implicit `any`.
- **Browser Compatibility:** Verified across desktop (1500×950) and mobile (390×844) viewports.
