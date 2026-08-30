# UAT Checklist

## Project

**POC ID:** POC-51

**Title:** Rural & Remote Healthcare Access Gap Mapper

---

## User Acceptance Testing

| Test Case | Expected Result | Status |
|---|---|---|
| Start backend | FastAPI starts successfully | PASS |
| Health endpoint | Returns healthy service response | PASS |
| Open API documentation | Swagger UI loads | PASS |
| Run underserved-area analysis | Returns analysis JSON | PASS |
| Start frontend | Next.js application loads | PASS |
| Dashboard rendering | Dashboard displays correctly | PASS |
| Map rendering | Interactive map loads | PASS |
| Healthcare facilities | Facility markers appear | PASS |
| Facility interaction | Facility popup displays information | PASS |
| Settlement visualization | Settlement markers appear | PASS |
| Settlement interaction | Settlement popup displays information | PASS |
| Accessibility visualization | Accessibility status is visually represented | PASS |
| Backend/frontend integration | Frontend receives backend analysis | PASS |
| Production build | Frontend builds successfully | PASS |

---

## API Validation

### Health Check

Endpoint:

`GET /health`

Expected:

```json
{
  "status": "ok"
}