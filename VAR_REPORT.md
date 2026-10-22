# Visual & Architecture Review (VAR) Report

**Project:** Rural & Remote Healthcare Access Gap Mapper\
**Program:** Infocreon Internship — Batch 6\
**POC ID:** 51\
**Architect:** Erine Anna Binu ([@Er-ine](https://github.com/Er-ine))\
**Branch:** `cinematic-rail`\
**Review Date:** October 2026

---

## 1. Scope Reviewed

This Visual & Architecture Review (VAR) covers the transformation of the POC-51 Rural & Remote Healthcare Access Gap Mapper into a cinematic, production-quality healthcare intelligence platform. The review encompasses:

1. **Architecture & Data Flow Audit**: Inspection of FastAPI backend routes, Haversine accessibility service, Pydantic schemas, and frontend API consumption.
2. **Visual & Interaction Overhaul**: Migration from a 70/30 card layout to a full-viewport geospatial canvas with custom Esri World Dark Gray basemap, custom glowing medical pins, and refined palette tokens (`#06161A`, `#0A1F24`, `#0E2A30`, `#2DD4BF`).
3. **Slide-Over Intelligence Panel**: Conversion of `IntelligenceSidebar` from a static column to a right slide-over drawer triggered by settlement selection, with Escape key handling.
4. **Collapsible Bottom Telemetry Dock**: Consolidation of analytical components (`AnalyticsStrip`, `RankingTable`, `FacilityDensityScatter`, `MobileClinicPanel`, and Governance) into an expandable bottom drawer with quick-status metrics.
5. **Transparency & Governance Review**: Verification of `SyntheticDataDisclaimer`, `DataStatusBadge`, removal of stale/unrelated "Rail" branding, and creation of `ProjectInfoModal`.
6. **Code Quality & Build Integrity**: Complete TypeScript, ESLint, Next.js Turbopack build, and live browser testing.

---

## 2. Findings — Architecture

| Area | Finding | Impact | Action Taken |
| :--- | :--- | :--- | :--- |
| **Untracked Broken Scaffold** | Untracked directory `frontend/app/dashboard/page.tsx` was present, importing nonexistent `@/components/cinematic/*` and `@/lib/districts`. | Caused `next build` to fail immediately on initial run. | Cleanly removed the untracked broken scaffold, restoring clean App Router compilation. |
| **API Surface & Integrity** | Frontend was hardcoding `http://127.0.0.1:8000/api/analysis/underserved-areas`. | Rigid deployment configuration; potential CORS/environment friction. | Preserved the endpoint while adding `process.env.NEXT_PUBLIC_API_URL` configuration fallback. |
| **Distance & Catchment Service** | Pairwise distance calculation relies on the spherical Haversine formula in `backend/app/services/accessibility_service.py`. | Geodesic straight-line approximation rather than road-network routing. | Preserved calculations faithfully per backend integrity rules; clearly labeled metrics as geodesic distance approximations. |
| **Missing TypeScript Declarations** | D3 was imported in `FacilityDensityScatter` and `HealthcareMap` without `@types/d3`. | TypeScript compilation failed with TS7016 implicitly typed `any` errors. | Installed `@types/d3` in `frontend/package.json` and strictly typed all accessor functions and scales. |
| **State Coupling & Default Selection** | `page.tsx` automatically selected `all_results[0]` on mount, forcing the sidebar open on initial load. | Cluttered the initial view; violated requirement for clean map-first entry. | Decoupled panel visibility from data loading. The intelligence panel starts closed by default until explicitly invoked or a settlement is clicked. |
| **Branding Scaffolding** | `WhoControlsTheRailPanel.tsx` contained "Who Controls The Rail" terminology leftover from prior templates. | Incongruent with healthcare intelligence context. | Retitled component and display header to "Healthcare Governance & Institutional Authority" while preserving real GCC health authority stakeholders. |

---

## 3. Findings — Visual & Experience

| Area | Finding | Impact | Action Taken |
| :--- | :--- | :--- | :--- |
| **Basemap Provider & Watermarks** | Old Carto basemap URL (`cartocdn.com/dark_all`) displayed prominent "API KEY REQUIRED" watermarks across all tiles. | Distracted from map data and looked unfinished. | Migrated to Esri World Dark Gray Canvas (`Canvas/World_Dark_Gray_Base/MapServer`), providing crisp, dark cartography without watermarks or API keys. |
| **Facility Pins** | Standard Leaflet blue teardrop pins lacked visual hierarchy against a dark background. | Looked generic and cluttered. | Implemented custom Leaflet `divIcon` medical pins with dark teal fill, `#2DD4BF` border, subtle glow, and centered medical cross (`✚`). |
| **Map Viewport Sizing** | Fixed 570px map height inside a 70% card constraint limited usability. | Restricted map exploration on large displays. | Made the map fill the entire remaining viewport (`calc(100vh - 3.5rem)`), adding automated `map.invalidateSize()` calls when drawers open. |
| **Slide-Over Panel Interaction** | The sidebar occupied permanent horizontal space, shrinking the map canvas. | Squeezed map view on smaller laptops and mobile. | Transformed into a right slide-over panel with smooth CSS transforms, backdrop overlay on mobile, and Escape key dismissal. |
| **Analytics Clutter** | Multiple tables and charts below the map forced excessive vertical scrolling. | Users lost sight of the map when reading analytics. | Consolidated analytics into a collapsible bottom telemetry dock with tab navigation (`Analytics Strip`, `Priority Rankings`, `Density vs Pop`, `Mobile Clinic`, `Governance & Impact`). |
| **Mobile Notice Collisions** | On 390px mobile viewports, the floating synthetic disclaimer partially overlapped the top-left layer toggles. | Reduced readability on small screens. | Docked the disclaimer into a crisp, dismissible sub-bar directly below the header, ensuring zero overlap with map controls. |

---

## 4. Required Features — Coverage & Verification Check

Every item has been audited against the live running codebase:

| Feature / Requirement | Category | Verification Method | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Full-Screen Responsive Map** | Map Canvas | Browser visual testing & screenshot | **PASSED** | Fills viewport; responsive from 390px to 1600px+ |
| **Esri Dark Basemap** | Map Canvas | Browser visual testing & HTTP tile check | **PASSED** | Watermark-free, dark gray tiles load reliably |
| **Custom Facility Pins** | Map Canvas | Leaflet `divIcon` DOM inspection | **PASSED** | Glowing teal `✚` badges render at all facility coordinates |
| **Travel-Time Isochrone Bands** | Spatial Layer | Turf.js multi-ring buffer inspection | **PASSED** | 30/60/90-minute catchment rings render correctly |
| **Access-Gap Voronoi Choropleth** | Spatial Layer | D3 Delaunay voronoi cell inspection | **PASSED** | Voronoi cells shaded from green to red by travel time |
| **Population Density Circles** | Spatial Layer | Leaflet circle radius inspection | **PASSED** | Scaled circle markers render per settlement population |
| **Country Filtering** | Filters | Dropdown interaction in header | **PASSED** | Filters settlements, facilities, and calculations dynamically |
| **Slide-Over Intelligence Panel** | Navigation | Click settlement & Escape key test | **PASSED** | Starts closed; opens smoothly on click; dismisses on Esc/✕ |
| **Settlement Inspection Telemetry** | Intelligence | Map click inspection (Al Ula tested) | **PASSED** | Displays population, distance, nearest hospital, priority score |
| **Collapsible Analytics Dock** | Telemetry | Tab switching & collapse/expand test | **PASSED** | Renders AnalyticsStrip, RankingTable, Scatter, Clinic routes |
| **Underserved Ranking Table** | Analytics | Multi-column sort interaction | **PASSED** | Sorts by distance, population, settlement, and country |
| **Facility Density vs Pop Scatter** | Analytics | D3 SVG DOM inspection | **PASSED** | Strict TypeScript D3 regression chart with custom styling |
| **Mobile Clinic Dispatch Routing** | Analytics | Heuristic route inspection | **PASSED** | Farthest-first ordering with click-to-locate interaction |
| **Healthcare Governance Panel** | Narrative | Panel inspection | **PASSED** | GCC health ministries, regional directorates, WHO EMRO |
| **Why This Matters Panel** | Narrative | Panel inspection | **PASSED** | Clinical rationale and public health equity context |
| **Project Information Modal** | Metadata | Info button click & Esc key test | **PASSED** | Modal displays architect, program, POC ID, tech stack |
| **Synthetic Data Sub-bar** | Transparency | Dismissible sub-bar test | **PASSED** | Discloses illustrative models with ✕ dismiss button |
| **Data Status Badge** | Transparency | Popover interaction test | **PASSED** | Popover itemizes verified vs synthetic fields |
| **FastAPI Backend Startup** | Backend | Uvicorn execution on port 8000 | **PASSED** | Starts cleanly with zero runtime exceptions |
| **`/health` API Endpoint** | Backend | `Invoke-RestMethod` HTTP test | **PASSED** | Returns HTTP 200 `{"status": "ok", ...}` |
| **`/api/analysis/underserved-areas`** | Backend | `Invoke-RestMethod` HTTP test | **PASSED** | Returns HTTP 200 with 30 settlements, 25 underserved |
| **ESLint Code Quality** | Quality | `npm run lint` | **PASSED** | 0 errors, 0 warnings across the frontend |
| **TypeScript Type Checking** | Quality | `next build` | **PASSED** | Strict type-checking verified with 0 errors |
| **Turbopack Production Build** | Quality | `next build` | **PASSED** | Production bundle generated in ~4 seconds |
| **Remote Git Push** | Operations | Git command inspection | **NOT TESTED** | Intentionally not executed per safety instructions |

---

## 5. Outstanding Issues & Known Limitations

1. **Euclidean / Geodesic Distance Limitation**: The Haversine algorithm computes straight-line distances. In mountainous or desert terrain, road network travel distances exceed geodesic distance by 20–40%.
2. **Isochrone Approximations**: Catchment rings are planar radial buffers rather than isochrones derived from real-time road networks and speed limits.
3. **Synthetic Demographic Baseline**: Settlement population counts and facility bed capacities are illustrative demonstration values standing in for official census and hospital registry data.
4. **Clinic Route Heuristic**: Mobile clinic sequencing uses a distance-sorted heuristic rather than an exact Capacitated Vehicle Routing Problem (CVRP) solver.

---

## 6. Verification Sign-Off

- **Reviewer:** Erine Anna Binu ([@Er-ine](https://github.com/Er-ine))
- **Status:** **ALL FEASIBLE REVIEWS & TESTS PASSED**
- **Git Commit:** `0adfc6b` (`cinematic-rail`)
