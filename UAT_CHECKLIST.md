# User Acceptance Testing (UAT) Checklist

**Project:** Rural & Remote Healthcare Access Gap Mapper\
**Program:** Infocreon Internship — Batch 6\
**POC ID:** 51\
**Architect:** Erine Anna Binu ([@Er-ine](https://github.com/Er-ine))\
**Active Branch:** `cinematic-rail`\
**Test Environment:** Windows 11, Node.js v24 / Next.js 16.3.2, Python 3.14.4 / FastAPI 0.135.2, Microsoft Edge

Every item in this checklist has been verified against the live running application (FastAPI backend on port 8000 and Next.js frontend on port 3000).

---

## 1. Engineering & Build Verification

- [x] **Linting Cleanliness**: `npm run lint` passes with 0 errors and 0 warnings (ESLint 9).
- [x] **TypeScript Strictness**: `npm run build` passes with zero type errors. `@types/d3` declarations resolve cleanly.
- [x] **Production Compilation**: Next.js 16 Turbopack build creates optimized static assets without warnings.
- [x] **Backend Server Startup**: `python -m uvicorn app.main:app --port 8000` starts with zero runtime exceptions.
- [x] **Browser Console Health**: Zero uncaught exceptions, 404s, or hydration mismatches in the browser devtools.
- [x] **Initial Data Ingestion**: Frontend successfully fetches and deserializes payload from `http://127.0.0.1:8000/api/analysis/underserved-areas`.

---

## 2. Map Rendering & Geospatial Canvas

- [x] **Full-Screen Viewport**: Map canvas occupies full available height (`calc(100vh - 3.5rem)`), removing the legacy 570px constraint.
- [x] **Esri Dark Gray Basemap**: Cartographic tiles load reliably without watermarks, API keys, or broken tile requests.
- [x] **Custom Medical Facility Pins**: Custom Leaflet `divIcon` pins render with glowing teal borders and medical cross symbols (`✚`) for all 30 facilities.
- [x] **Settlement Access Horizon Markers**: Settlement circles render with color-coded access tiers (&le;30 min green, 31–60 min yellow, &gt;60 min red).
- [x] **Turf.js Isochrone Bands**: Multi-ring circular catchment buffers (30 min / 20 km, 60 min / 40 km, 90 min / 60 km) render around facilities and toggle cleanly.
- [x] **D3 Voronoi Gap Choropleth**: Voronoi tessellation cells render over settlements, shaded according to travel-time horizons, with synchronized gradient legend.
- [x] **Population Density Circles**: Scaled circle markers accurately reflect relative settlement populations and toggle independently.
- [x] **Canvas Resize Synchronization**: Opening and closing panels triggers `map.invalidateSize()` after transition, preventing gray unloaded tile bands.

---

## 3. Regional & Country Filtering

- [x] **Country Dropdown**: Select control in header displays "All Regions (6)" and all unique countries extracted from backend analysis.
- [x] **Dynamic Filter Execution**: Selecting a country (e.g., Oman or Saudi Arabia) immediately filters visible markers, isochrones, and facilities.
- [x] **Telemetry Synchronization**: Bottom dock settlement count and average distance update immediately upon filter change.
- [x] **Selection Reset on Filter Mismatch**: If a selected settlement does not belong to the newly chosen country filter, the selection is safely reset.

---

## 4. Settlement Selection & Deep-Dive Interaction

- [x] **Map Marker Click**: Clicking any settlement circle marker focuses the settlement and smoothly pans the map (`map.flyTo`).
- [x] **Table Row Click**: Clicking a row in the Underserved Ranking table selects the settlement, pans the map, and opens the intelligence panel.
- [x] **Route Stop Click**: Clicking a stop in the Mobile Clinic Route panel focuses that remote locality immediately.
- [x] **Visual Focus State**: The active settlement marker is emphasized with an enlarged radius (13px) and high-contrast white border.

---

## 5. Slide-Over Intelligence Panel

- [x] **Closed on Initial Load**: The intelligence panel starts closed by default (automatic selection of first result disabled).
- [x] **Smooth Entry Transition**: Opens with an animated CSS slide-in (`translate-x-0`) from the right margin.
- [x] **Settlement Profile Data**: Renders settlement name, country, population `(Synthetic)`, distance to care, nearest primary facility, and access status bar.
- [x] **Intervention Priority Score**: Displays deterministic priority score (0–100) and severity category (`CRITICAL`, `HIGH`, `MODERATE`, `LOW`).
- [x] **Keyboard Dismissal (Escape)**: Pressing the `Escape` key immediately closes the slide-over panel.
- [x] **Close Button (✕)**: Accessible close button in panel header closes the drawer.
- [x] **Empty State**: When open without a selection, presents a clean prompt and a quick "Focus Highest Priority Area" action button.
- [x] **Scrollable Content**: Long intelligence sections scroll vertically with custom dark scrollbars.

---

## 6. Collapsible Bottom Analytics Dock

- [x] **Floating Telemetry Bar**: Positioned cleanly at the bottom of the map showing settlement count, underserved count/ratio, and average distance.
- [x] **Expand / Collapse Toggle**: Chevron button (`▲`/`▼`) expands and collapses the analytics tray without navigating away from the map.
- [x] **Tab 1: Analytics Strip**: Renders access gap distribution bands, population impact bar, and Haversine distance telemetry.
- [x] **Tab 2: Priority Rankings**: Sortable table of underserved settlements; supports sorting by distance, population, settlement name, and country.
- [x] **Tab 3: Facility Density vs Population**: D3 SVG scatter plot with linear regression gridlines, country data labels, and tick formatters.
- [x] **Tab 4: Mobile Clinic Dispatch**: Displays top 5 farthest settlements sequenced for mobile clinic deployment with direct "Locate →" actions.
- [x] **Tab 5: Governance & Impact**: Dual-column layout displaying Public Health Impact Rationale and Healthcare Governance Authorities.

---

## 7. Project Information Modal

- [x] **Modal Trigger**: Accessible `ⓘ` info button in header opens the dialog.
- [x] **Project Metadata**: Displays exact program ("Infocreon Internship — Batch 6"), POC ID ("51"), and Architect ("Erine Anna Binu", `@Er-ine`).
- [x] **Verified Tech Stack**: Accurately lists verified frontend, geospatial, backend, and data provenance technologies.
- [x] **Keyboard Navigation**: Pressing `Escape` closes the modal; close button receives focus on open.
- [x] **Backdrop Click**: Clicking outside the modal container dismisses it.

---

## 8. Data Provenance & Synthetic Transparency

- [x] **Synthetic Notice Sub-Bar**: Dismissible notice banner placed directly under the header discloses that demographic and capacity numbers are illustrative demonstration models.
- [x] **Data Status Badge**: Header badge indicates `PROVENANCE: MIXED` and toggles a popover itemizing real-based vs synthetic attributes.
- [x] **Inline Metric Disclaimers**: Population, capacity, and route heuristics are explicitly labeled with `(Synthetic)` and `(Illustrative)` tags.
- [x] **Documentation Integrity**: No unverified real-world health outcomes are claimed.

---

## 9. API Resilience & Error States

- [x] **Loading Indicator**: Renders a centered dark spinner while awaiting initial API response.
- [x] **Offline Service State**: If the backend is unavailable or returns non-200, an error panel displays clear instructions to start `uvicorn app.main:app --port 8000`.
- [x] **Configurable URL**: Connects to `process.env.NEXT_PUBLIC_API_URL` with a default fallback to `http://127.0.0.1:8000`.

---

## 10. Responsive Behavior & Accessibility

- [x] **Desktop (1500×950)**: Full-screen layout with spacious overlays, floating HUD, and right slide-over panel. Verified via screenshot [`1_fullscreen_map_panel_closed.png`](screenshots/1_fullscreen_map_panel_closed.png).
- [x] **Mobile (390×844)**: Responsive header with abbreviated title, stacked controls, full-width notice sub-bar, and touch-friendly targets. Verified via screenshot [`4_mobile_viewport.png`](screenshots/4_mobile_viewport.png).
- [x] **No Horizontal Overflow**: Page layout maintains `overflow-hidden` at the root, preventing unwanted horizontal panning.
- [x] **Contrast & Legibility**: High-contrast text (`#F0FDFA`) against dark teal surfaces (`#0A1F24` / `#0E2A30`) with accessible WCAG ratios.
