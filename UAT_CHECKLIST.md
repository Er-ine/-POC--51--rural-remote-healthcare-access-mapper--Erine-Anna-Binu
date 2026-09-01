# UAT Checklist — Rural & Remote Healthcare Access Gap Mapper

**POC ID:** POC-51
**Project:** Rural & Remote Healthcare Access Gap Mapper
**Author:** Erine Anna Binu

UAT = User Acceptance Testing. Every item below must be manually verified against the running application (both frontend and backend live) before submission. Do not mark an item ✅ unless you have personally tested it.

## Engineering

- [x] Application builds successfully (frontend: `npm run build` or `npm run dev`; backend: starts without errors)
- [x] No console errors in the browser dev tools
- [x] No errors in the backend terminal on startup or during use
- [x] Data loads correctly on initial page load
- [x] Filters (if any) work correctly and update the relevant views
- [x] All core functionality operates as expected end-to-end

## Feature-by-Feature Verification

- [x] Travel-time isochrone map renders and responds to interaction
- [x] Access-gap choropleth renders with correct shading/legend
- [x] Facility-density vs. population scatter renders and is readable
- [x] Underserved-district ranking table populates and sorts correctly
- [x] Mobile-clinic route optimisation panel displays expected output
- [x] "Why this matters" panel displays correctly
- [x] "Who controls the rail" panel displays correctly
- [x] Data Status indicator correctly distinguishes real vs. synthetic data
- [x] Synthetic-data disclaimer is visible where synthetic data is shown

## Experience

- [x] Strong, consistent visual identity across all views
- [x] Responsive layout — verified at desktop width
- [x] Responsive layout — verified at tablet width
- [x] Responsive layout — verified at mobile width
- [x] Clear interaction flow (a first-time user can navigate without instructions)
- [x] Dashboard tells a coherent story (not just a collection of disconnected widgets)
- [x] Professional presentation — no placeholder text, lorem ipsum, or broken images left in

## Data Correctness Spot Checks

- [x] At least 2–3 districts spot-checked manually for correct access-gap scoring
- [] Provenance tags spot-checked — confirmed real data is labeled real, synthetic data is labeled synthetic
- [x] Edge cases checked (e.g. a district with no facilities, a district with very high population density)

## Architecture

- [x] Existing functionality preserved after any late-stage changes
- [x] AI Handshake protocol followed (Repomix output shared before AI-assisted implementation)
- [x] Clean repository structure (no stray/unused files, no commented-out dead code left in)
- [x] Repomix workflow followed throughout
