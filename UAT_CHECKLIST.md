# UAT Checklist — Rural & Remote Healthcare Access Gap Mapper

**POC ID:** POC-51
**Project:** Rural & Remote Healthcare Access Gap Mapper
**Author:** Erine Anna Binu

UAT = User Acceptance Testing. Every item below must be manually verified against the running application (both frontend and backend live) before submission. Do not mark an item ✅ unless you have personally tested it.

## Engineering

- [ ] Application builds successfully (frontend: `npm run build` or `npm run dev`; backend: starts without errors)
- [ ] No console errors in the browser dev tools
- [ ] No errors in the backend terminal on startup or during use
- [ ] Data loads correctly on initial page load
- [ ] Filters (if any) work correctly and update the relevant views
- [ ] All core functionality operates as expected end-to-end

## Feature-by-Feature Verification

- [ ] Travel-time isochrone map renders and responds to interaction
- [ ] Access-gap choropleth renders with correct shading/legend
- [ ] Facility-density vs. population scatter renders and is readable
- [ ] Underserved-district ranking table populates and sorts correctly
- [ ] Mobile-clinic route optimisation panel displays expected output
- [ ] "Why this matters" panel displays correctly
- [ ] "Who controls the rail" panel displays correctly
- [ ] Data Status indicator correctly distinguishes real vs. synthetic data
- [ ] Synthetic-data disclaimer is visible where synthetic data is shown

## Experience

- [ ] Strong, consistent visual identity across all views
- [ ] Responsive layout — verified at desktop width
- [ ] Responsive layout — verified at tablet width
- [ ] Responsive layout — verified at mobile width
- [ ] Clear interaction flow (a first-time user can navigate without instructions)
- [ ] Dashboard tells a coherent story (not just a collection of disconnected widgets)
- [ ] Professional presentation — no placeholder text, lorem ipsum, or broken images left in

## Data Correctness Spot Checks

- [ ] At least 2–3 districts spot-checked manually for correct access-gap scoring
- [ ] Provenance tags spot-checked — confirmed real data is labeled real, synthetic data is labeled synthetic
- [ ] Edge cases checked (e.g. a district with no facilities, a district with very high population density)

## Architecture

- [ ] Existing functionality preserved after any late-stage changes
- [ ] AI Handshake protocol followed (Repomix output shared before AI-assisted implementation)
- [ ] Clean repository structure (no stray/unused files, no commented-out dead code left in)
- [ ] Repomix workflow followed throughout

## Known Issues

_(List anything found during UAT that was NOT fixed before submission, with a short explanation of why. It's expected and normal to have some — leaving this section honest is part of the protocol.)_

-
-

## Sign-off

- [ ] All unchecked items above are either resolved or explicitly logged in Known Issues
