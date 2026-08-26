from math import radians, sin, cos, sqrt, atan2

from app.models.schemas import (
    HealthcareFacility,
    Settlement,
    AccessibilityResult,
)


def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the distance between two geographic
    coordinates using the Haversine formula.
    """

    earth_radius = 6371  # Radius of Earth in kilometers

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1

    a = (
        sin(delta_lat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(delta_lon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return earth_radius * c


def analyze_accessibility(
    settlements: list[Settlement],
    facilities: list[HealthcareFacility],
):
    results = []

    for settlement in settlements:

        nearest_facility = None
        shortest_distance = float("inf")

        for facility in facilities:

            distance = calculate_distance(
                settlement.latitude,
                settlement.longitude,
                facility.latitude,
                facility.longitude,
            )

            if distance < shortest_distance:
                shortest_distance = distance
                nearest_facility = facility

        # Classify accessibility
        if shortest_distance <= 5:
            status = "Well Served"
        elif shortest_distance <= 15:
            status = "Moderate Access"
        else:
            status = "Underserved"

        results.append(
            AccessibilityResult(
                settlement_id=settlement.id,
                settlement_name=settlement.name,
                nearest_facility=nearest_facility.name,
                distance_km=round(shortest_distance, 2),
                accessibility_status=status,
            )
        )

    return results