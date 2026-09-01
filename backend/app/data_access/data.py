from app.models.schemas import HealthcareFacility, Settlement


healthcare_facilities = [
    # ---- Oman ----
    HealthcareFacility(id=1, name="Muscat Regional Hospital", type="Hospital", country="Oman", latitude=23.588, longitude=58.382, capacity=450, specialties=["Emergency", "Cardiology", "Surgery"]),
    HealthcareFacility(id=2, name="Nizwa Health Center", type="Health Center", country="Oman", latitude=22.933, longitude=57.533, capacity=120, specialties=["General Medicine", "Maternal Care"]),
    HealthcareFacility(id=3, name="Ibri Rural Clinic", type="Clinic", country="Oman", latitude=23.225, longitude=56.515, capacity=40, specialties=["General Medicine"]),
    HealthcareFacility(id=4, name="Sohar Hospital", type="Hospital", country="Oman", latitude=24.3486, longitude=56.7091, capacity=320, specialties=["Emergency", "Pediatrics", "Orthopedics"]),
    HealthcareFacility(id=5, name="Sur Health Center", type="Health Center", country="Oman", latitude=22.5667, longitude=59.5289, capacity=95, specialties=["General Medicine", "Maternal Care"]),

    # ---- Saudi Arabia ----
    HealthcareFacility(id=6, name="Riyadh General Hospital", type="Hospital", country="Saudi Arabia", latitude=24.713, longitude=46.675, capacity=600, specialties=["Emergency", "Surgery", "Cardiology"]),
    HealthcareFacility(id=7, name="Al Bahah Health Center", type="Health Center", country="Saudi Arabia", latitude=20.012, longitude=41.467, capacity=90, specialties=["General Medicine", "Pediatrics"]),
    HealthcareFacility(id=8, name="King Abdulaziz Hospital, Jeddah", type="Hospital", country="Saudi Arabia", latitude=21.4858, longitude=39.1925, capacity=550, specialties=["Emergency", "Cardiology", "Oncology"]),
    HealthcareFacility(id=9, name="Abha General Hospital", type="Hospital", country="Saudi Arabia", latitude=18.2465, longitude=42.5117, capacity=280, specialties=["Emergency", "Surgery"]),
    HealthcareFacility(id=10, name="Najran Rural Clinic", type="Clinic", country="Saudi Arabia", latitude=17.4924, longitude=44.1277, capacity=35, specialties=["General Medicine"]),

    # ---- UAE ----
    HealthcareFacility(id=11, name="Rashid Hospital, Dubai", type="Hospital", country="UAE", latitude=25.2400, longitude=55.3110, capacity=762, specialties=["Emergency", "Trauma", "Surgery"]),
    HealthcareFacility(id=12, name="Mafraq Hospital, Abu Dhabi", type="Hospital", country="UAE", latitude=24.3450, longitude=54.5470, capacity=450, specialties=["Emergency", "Cardiology", "Nephrology"]),
    HealthcareFacility(id=13, name="Al Qassimi Hospital, Sharjah", type="Hospital", country="UAE", latitude=25.3463, longitude=55.4209, capacity=362, specialties=["Emergency", "General Medicine", "Pediatrics"]),
    HealthcareFacility(id=14, name="Al Dhaid Hospital", type="Health Center", country="UAE", latitude=25.2890, longitude=55.8800, capacity=80, specialties=["General Medicine", "Maternal Care"]),
    HealthcareFacility(id=15, name="Dibba Al Fujairah Hospital", type="Clinic", country="UAE", latitude=25.5925, longitude=56.2617, capacity=45, specialties=["General Medicine"]),

    # ---- Qatar ----
    HealthcareFacility(id=16, name="Hamad General Hospital, Doha", type="Hospital", country="Qatar", latitude=25.2854, longitude=51.5310, capacity=611, specialties=["Emergency", "Surgery", "Cardiology"]),
    HealthcareFacility(id=17, name="Al Khor Hospital", type="Hospital", country="Qatar", latitude=25.6810, longitude=51.4970, capacity=220, specialties=["Emergency", "General Medicine"]),
    HealthcareFacility(id=18, name="Al Wakra Hospital", type="Hospital", country="Qatar", latitude=25.1715, longitude=51.6035, capacity=253, specialties=["Emergency", "Maternal Care", "Surgery"]),
    HealthcareFacility(id=19, name="Cuban Hospital, Dukhan", type="Health Center", country="Qatar", latitude=25.4253, longitude=50.7867, capacity=70, specialties=["General Medicine"]),
    HealthcareFacility(id=20, name="Rumailah Hospital, Doha", type="Hospital", country="Qatar", latitude=25.2820, longitude=51.5200, capacity=360, specialties=["Geriatrics", "Rehabilitation"]),

    # ---- Bahrain ----
    HealthcareFacility(id=21, name="Salmaniya Medical Complex", type="Hospital", country="Bahrain", latitude=26.2198, longitude=50.6145, capacity=1200, specialties=["Emergency", "Surgery", "Cardiology"]),
    HealthcareFacility(id=22, name="King Hamad University Hospital", type="Hospital", country="Bahrain", latitude=26.1736, longitude=50.5478, capacity=313, specialties=["Emergency", "Trauma", "Organ Transplant"]),
    HealthcareFacility(id=23, name="Bahrain Defence Force Hospital", type="Hospital", country="Bahrain", latitude=26.2100, longitude=50.5900, capacity=220, specialties=["Emergency", "General Medicine"]),
    HealthcareFacility(id=24, name="Muharraq Health Center", type="Health Center", country="Bahrain", latitude=26.2572, longitude=50.6119, capacity=65, specialties=["General Medicine", "Maternal Care"]),
    HealthcareFacility(id=25, name="Riffa Health Center", type="Health Center", country="Bahrain", latitude=26.1300, longitude=50.5550, capacity=55, specialties=["General Medicine"]),

    # ---- Kuwait ----
    HealthcareFacility(id=26, name="Amiri Hospital, Kuwait City", type="Hospital", country="Kuwait", latitude=29.3759, longitude=47.9774, capacity=470, specialties=["Emergency", "Internal Medicine", "Cardiology"]),
    HealthcareFacility(id=27, name="Mubarak Al-Kabeer Hospital", type="Hospital", country="Kuwait", latitude=29.3000, longitude=48.0800, capacity=623, specialties=["Nephrology", "Gastroenterology", "Surgery"]),
    HealthcareFacility(id=28, name="Jahra Hospital", type="Hospital", country="Kuwait", latitude=29.3375, longitude=47.6581, capacity=380, specialties=["Emergency", "General Medicine"]),
    HealthcareFacility(id=29, name="Farwaniya Hospital", type="Hospital", country="Kuwait", latitude=29.2775, longitude=47.9391, capacity=460, specialties=["Emergency", "Pediatrics", "Maternal Care"]),
    HealthcareFacility(id=30, name="Adan Hospital, Al Ahmadi", type="Hospital", country="Kuwait", latitude=29.0769, longitude=48.0837, capacity=400, specialties=["Emergency", "Surgery"]),
]


settlements = [
    # ---- Oman ----
    Settlement(id=1, name="Al Hamra", country="Oman", latitude=23.119, longitude=57.281, population=12000, travel_time=18),
    Settlement(id=2, name="Haima", country="Oman", latitude=19.959, longitude=56.275, population=8500, travel_time=52),
    Settlement(id=3, name="Duqm", country="Oman", latitude=19.663, longitude=57.699, population=18000, travel_time=38),
    Settlement(id=4, name="Rustaq", country="Oman", latitude=23.3908, longitude=57.4247, population=15500, travel_time=29),
    Settlement(id=5, name="Ibra", country="Oman", latitude=22.6906, longitude=58.5334, population=10200, travel_time=33),

    # ---- Saudi Arabia ----
    Settlement(id=6, name="Al Ula", country="Saudi Arabia", latitude=26.608, longitude=37.923, population=32000, travel_time=67),
    Settlement(id=7, name="Wadi Al Dawasir", country="Saudi Arabia", latitude=20.462, longitude=44.793, population=58000, travel_time=43),
    Settlement(id=8, name="Sharurah", country="Saudi Arabia", latitude=17.4713, longitude=47.1173, population=24500, travel_time=71),
    Settlement(id=9, name="Rafha", country="Saudi Arabia", latitude=29.6255, longitude=43.4930, population=19800, travel_time=58),
    Settlement(id=10, name="Baljurashi", country="Saudi Arabia", latitude=19.8564, longitude=41.5665, population=27300, travel_time=24),

    # ---- UAE ----
    Settlement(id=11, name="Liwa Oasis", country="UAE", latitude=23.1333, longitude=53.7833, population=9500, travel_time=61),
    Settlement(id=12, name="Hatta", country="UAE", latitude=24.7996, longitude=56.1172, population=17300, travel_time=45),
    Settlement(id=13, name="Al Madam", country="UAE", latitude=25.0000, longitude=55.7833, population=6200, travel_time=27),
    Settlement(id=14, name="Al Ghail, Ras Al Khaimah", country="UAE", latitude=25.9333, longitude=56.0333, population=4800, travel_time=39),
    Settlement(id=15, name="Al Ain (outer settlements)", country="UAE", latitude=24.2075, longitude=55.7447, population=42000, travel_time=22),

    # ---- Qatar ----
    Settlement(id=16, name="Umm Salal", country="Qatar", latitude=25.4149, longitude=51.4053, population=20500, travel_time=19),
    Settlement(id=17, name="Al Shahaniya", country="Qatar", latitude=25.3708, longitude=51.2172, population=8700, travel_time=31),
    Settlement(id=18, name="Al Ruwais", country="Qatar", latitude=26.1417, longitude=51.2131, population=5300, travel_time=48),
    Settlement(id=19, name="Simaisma", country="Qatar", latitude=25.5333, longitude=51.5667, population=3100, travel_time=26),
    Settlement(id=20, name="Mesaieed", country="Qatar", latitude=24.9911, longitude=51.5470, population=14200, travel_time=21),

    # ---- Bahrain ----
    Settlement(id=21, name="Sitra", country="Bahrain", latitude=26.1547, longitude=50.6247, population=60000, travel_time=14),
    Settlement(id=22, name="Zallaq", country="Bahrain", latitude=26.0464, longitude=50.4933, population=4100, travel_time=22),
    Settlement(id=23, name="Budaiya", country="Bahrain", latitude=26.2244, longitude=50.4586, population=33000, travel_time=16),
    Settlement(id=24, name="Askar", country="Bahrain", latitude=26.0731, longitude=50.5764, population=5600, travel_time=20),
    Settlement(id=25, name="Hamad Town", country="Bahrain", latitude=26.1197, longitude=50.5064, population=90000, travel_time=12),

    # ---- Kuwait ----
    Settlement(id=26, name="Wafra", country="Kuwait", latitude=28.6394, longitude=47.9358, population=7200, travel_time=54),
    Settlement(id=27, name="Al Nuwaiseeb", country="Kuwait", latitude=28.5667, longitude=48.4167, population=2100, travel_time=63),
    Settlement(id=28, name="Sabriya", country="Kuwait", latitude=29.7167, longitude=47.7500, population=3400, travel_time=49),
    Settlement(id=29, name="Abdali", country="Kuwait", latitude=29.8667, longitude=47.7167, population=5800, travel_time=57),
    Settlement(id=30, name="Mutlaa", country="Kuwait", latitude=29.4667, longitude=47.7333, population=12500, travel_time=32),
]