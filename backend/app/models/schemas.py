from pydantic import BaseModel
from typing import Literal


class HealthcareFacility(BaseModel):
    id: int
    name: str
    type: Literal["Hospital", "Health Center", "Clinic"]
    country: Literal["Oman", "Saudi Arabia"]
    latitude: float
    longitude: float
    capacity: int
    specialties: list[str]


class Settlement(BaseModel):
    id: int
    name: str
    country: Literal["Oman", "Saudi Arabia"]
    latitude: float
    longitude: float
    population: int
    travel_time: int


class AccessibilityResult(BaseModel):
    settlement_id: int
    settlement_name: str
    country: str
    population: int
    nearest_facility: str
    distance_km: float
    accessibility_status: str