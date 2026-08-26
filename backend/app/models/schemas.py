from pydantic import BaseModel


class HealthcareFacility(BaseModel):
    id: int
    name: str
    type: str
    latitude: float
    longitude: float
    capacity: int


class Settlement(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    population: int


class AccessibilityResult(BaseModel):
    settlement_id: int
    settlement_name: str
    nearest_facility: str
    distance_km: float
    accessibility_status: str