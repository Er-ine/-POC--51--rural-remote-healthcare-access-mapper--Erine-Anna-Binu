from fastapi import APIRouter

from app.data_access.data import (
    healthcare_facilities,
    settlements,
)

from app.services.accessibility_service import analyze_accessibility


router = APIRouter(
    prefix="/api/analysis",
    tags=["Healthcare Analysis"],
)


@router.get("/underserved-areas")
def get_underserved_areas():

    results = analyze_accessibility(
        settlements,
        healthcare_facilities,
    )

    underserved = [
        result
        for result in results
        if result.accessibility_status == "Underserved"
    ]

    return {
        "total_settlements": len(settlements),
        "total_facilities": len(healthcare_facilities),
        "underserved_count": len(underserved),
        "underserved_areas": underserved,
        "all_results": results,
    }