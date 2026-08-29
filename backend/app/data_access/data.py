from app.models.schemas import HealthcareFacility, Settlement


healthcare_facilities = [
    HealthcareFacility(
        id=1,
        name="Muscat Regional Hospital",
        type="Hospital",
        country="Oman",
        latitude=23.588,
        longitude=58.382,
        capacity=450,
        specialties=["Emergency", "Cardiology", "Surgery"],
    ),

    HealthcareFacility(
        id=2,
        name="Nizwa Health Center",
        type="Health Center",
        country="Oman",
        latitude=22.933,
        longitude=57.533,
        capacity=120,
        specialties=["General Medicine", "Maternal Care"],
    ),

    HealthcareFacility(
        id=3,
        name="Ibri Rural Clinic",
        type="Clinic",
        country="Oman",
        latitude=23.225,
        longitude=56.515,
        capacity=40,
        specialties=["General Medicine"],
    ),

    HealthcareFacility(
        id=4,
        name="Riyadh General Hospital",
        type="Hospital",
        country="Saudi Arabia",
        latitude=24.713,
        longitude=46.675,
        capacity=600,
        specialties=["Emergency", "Surgery", "Cardiology"],
    ),

    HealthcareFacility(
        id=5,
        name="Al Bahah Health Center",
        type="Health Center",
        country="Saudi Arabia",
        latitude=20.012,
        longitude=41.467,
        capacity=90,
        specialties=["General Medicine", "Pediatrics"],
    ),
]


settlements = [
    Settlement(
        id=1,
        name="Al Hamra",
        country="Oman",
        latitude=23.119,
        longitude=57.281,
        population=12000,
        travel_time=18,
    ),

    Settlement(
        id=2,
        name="Haima",
        country="Oman",
        latitude=19.959,
        longitude=56.275,
        population=8500,
        travel_time=52,
    ),

    Settlement(
        id=3,
        name="Duqm",
        country="Oman",
        latitude=19.663,
        longitude=57.699,
        population=18000,
        travel_time=38,
    ),

    Settlement(
        id=4,
        name="Al Ula",
        country="Saudi Arabia",
        latitude=26.608,
        longitude=37.923,
        population=32000,
        travel_time=67,
    ),

    Settlement(
        id=5,
        name="Wadi Al Dawasir",
        country="Saudi Arabia",
        latitude=20.462,
        longitude=44.793,
        population=58000,
        travel_time=43,
    ),
]