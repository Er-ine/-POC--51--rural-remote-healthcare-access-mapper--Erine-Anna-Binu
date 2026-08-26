from fastapi import APIRouter

from app.models.schemas import HealthcareFacility, Settlement
from app.services.accessibility_service import analyze_accessibility


router = APIRouter(
    prefix="/api/analysis",
    tags=["Healthcare Analysis"],
)


@router.get("/underserved-areas")
def get_underserved_areas():

    facilities = [
        HealthcareFacility(
            id=1,
            name="Central Health Center",
            type="Hospital",
            latitude=23.5000,
            longitude=50.5000,
            capacity=200,
        ),
        HealthcareFacility(
            id=2,
            name="Community Clinic",
            type="Clinic",
            latitude=23.5500,
            longitude=50.5500,
            capacity=50,
        ),
    ]

    settlements = [
        Settlement(
            id=1,
            name="Green Village",
            latitude=23.5100,
            longitude=50.5100,
            population=5000,
        ),
        Settlement(
            id=2,
            name="Hill Settlement",
            latitude=23.6500,
            longitude=50.6500,
            population=3000,
        ),
        Settlement(
            id=3,
            name="Remote Village",
            latitude=23.9000,
            longitude=50.9000,
            population=1500,
        ),
    ]

    results = analyze_accessibility(settlements, facilities)

    return {
        "total_settlements": len(settlements),
        "underserved_areas": [
            result
            for result in results
            if result.accessibility_status == "Underserved"
        ],
        "all_results": results,
    }