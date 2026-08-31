# VAR Report — Rural & Remote Healthcare Access Gap Mapper

**POC ID:** POC-51
**Project:** Rural & Remote Healthcare Access Gap Mapper
**Author:** Erine Anna Binu
**Rail:** Health Equity

VAR = Visual & Architecture Review. This document records the review conducted before implementation (and any follow-up review after implementation) against the Real Rails engineering protocol.

## 1. Scope Reviewed

_(List what was reviewed — e.g. initial architecture proposal, Repomix output, wireframes/mockups, or the implemented application itself.)_

## 2. Findings — Architecture

| Area | Finding | Action Taken |
|---|---|---|
| Scoring model | Configurable weight sliders were in the original spec but added unnecessary complexity/opacity | Switched to fixed, deterministic scoring |
| API surface | Initial API design had more endpoints than needed for the required features | Reduced to the minimum set needed |
| Data provenance | No way to distinguish real vs. synthetic data in the original design | Added explicit provenance fields in schemas + a Data Status indicator in the UI |
| Data folder naming | `data/real` was misleading since some of it is reference data, not live data | Renamed to `data/reference` |
| Routing | A full routing engine / VRP solver was considered for mobile-clinic optimisation | Descoped — out of scope for a POC; flagged as a future enhancement |
| ML | Machine-learning-based scoring was considered | Descoped in favor of explainable, fixed scoring |

## 3. Findings — Visual / Experience

_(Fill in after implementation — e.g. review against the required visual bar: cinematic experience, strong interaction model, dashboard storytelling, production-grade polish, clear visual identity, professional presentation.)_

| Area | Finding | Action Taken |
|---|---|---|
| _(e.g. Map interaction)_ | | |
| _(e.g. Data Status indicator visibility)_ | | |
| _(e.g. Responsive layout)_ | | |

## 4. Required Features — Coverage Check

| Feature | Status |
|---|---|
| Travel-time isochrone map | ☐ |
| Access-gap choropleth | ☐ |
| Facility-density vs. population scatter | ☐ |
| Underserved-district ranking table | ☐ |
| Mobile-clinic route optimisation panel | ☐ |
| "Why this matters" panel | ☐ |
| "Who controls the rail" panel | ☐ |
| Synthetic-data disclaimer | ☐ |
| Data Status indicator | ☐ |

_(Mark each ✅ once verified working in the running app, not just implemented.)_

## 5. Outstanding Issues at Time of This Review

_(List anything not yet resolved — carry unresolved items into UAT_CHECKLIST.md as known issues.)_

## 6. Reviewer

_(Self-reviewed using AI as a design/architecture review partner, per protocol. Final sign-off: @pallaviprasadt.)_