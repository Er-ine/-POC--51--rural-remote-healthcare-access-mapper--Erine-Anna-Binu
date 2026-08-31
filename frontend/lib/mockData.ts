// Rural & Remote Healthcare Access Gap Mapper — Reference Data
//
// PROVENANCE:
// - name, type, country, lat, lng for `healthcareFacilities`: based on real,
//   publicly known hospitals across the Gulf (sourced from public hospital
//   directories, Wikipedia, and ministry-of-health listings). Coordinates
//   are city/town-level approximations, not verified street addresses —
//   confirm exact coordinates via OpenStreetMap/Overpass before treating
//   this as production-grade geodata.
// - capacity, specialties: SYNTHETIC — illustrative values, not real bed
//   counts or verified specialty rosters. Flag as synthetic in the UI.
// - `settlements` (all fields): SYNTHETIC — town names are real, but
//   population and travelTime figures are illustrative placeholders
//   standing in for census + isochrone-model data this POC does not
//   yet compute.

export type HealthcareFacility = {
  id: number;
  name: string;
  type: "Hospital" | "Health Center" | "Clinic";
  country: "Oman" | "Saudi Arabia" | "UAE" | "Qatar" | "Bahrain" | "Kuwait";
  lat: number;
  lng: number;
  capacity: number;
  specialties: string[];
};

export type Settlement = {
  id: number;
  name: string;
  country: "Oman" | "Saudi Arabia" | "UAE" | "Qatar" | "Bahrain" | "Kuwait";
  lat: number;
  lng: number;
  population: number;
  travelTime: number;
};

export const healthcareFacilities: HealthcareFacility[] = [
  // ---- Oman ----
  { id: 1, name: "Muscat Regional Hospital", type: "Hospital", country: "Oman", lat: 23.588, lng: 58.382, capacity: 450, specialties: ["Emergency", "Cardiology", "Surgery"] },
  { id: 2, name: "Nizwa Health Center", type: "Health Center", country: "Oman", lat: 22.933, lng: 57.533, capacity: 120, specialties: ["General Medicine", "Maternal Care"] },
  { id: 3, name: "Ibri Rural Clinic", type: "Clinic", country: "Oman", lat: 23.225, lng: 56.515, capacity: 40, specialties: ["General Medicine"] },
  { id: 4, name: "Sohar Hospital", type: "Hospital", country: "Oman", lat: 24.3486, lng: 56.7091, capacity: 320, specialties: ["Emergency", "Pediatrics", "Orthopedics"] },
  { id: 5, name: "Sur Health Center", type: "Health Center", country: "Oman", lat: 22.5667, lng: 59.5289, capacity: 95, specialties: ["General Medicine", "Maternal Care"] },

  // ---- Saudi Arabia ----
  { id: 6, name: "Riyadh General Hospital", type: "Hospital", country: "Saudi Arabia", lat: 24.713, lng: 46.675, capacity: 600, specialties: ["Emergency", "Surgery", "Cardiology"] },
  { id: 7, name: "Al Bahah Health Center", type: "Health Center", country: "Saudi Arabia", lat: 20.012, lng: 41.467, capacity: 90, specialties: ["General Medicine", "Pediatrics"] },
  { id: 8, name: "King Abdulaziz Hospital, Jeddah", type: "Hospital", country: "Saudi Arabia", lat: 21.4858, lng: 39.1925, capacity: 550, specialties: ["Emergency", "Cardiology", "Oncology"] },
  { id: 9, name: "Abha General Hospital", type: "Hospital", country: "Saudi Arabia", lat: 18.2465, lng: 42.5117, capacity: 280, specialties: ["Emergency", "Surgery"] },
  { id: 10, name: "Najran Rural Clinic", type: "Clinic", country: "Saudi Arabia", lat: 17.4924, lng: 44.1277, capacity: 35, specialties: ["General Medicine"] },

  // ---- UAE ----
  { id: 11, name: "Rashid Hospital, Dubai", type: "Hospital", country: "UAE", lat: 25.2400, lng: 55.3110, capacity: 762, specialties: ["Emergency", "Trauma", "Surgery"] },
  { id: 12, name: "Mafraq Hospital, Abu Dhabi", type: "Hospital", country: "UAE", lat: 24.3450, lng: 54.5470, capacity: 450, specialties: ["Emergency", "Cardiology", "Nephrology"] },
  { id: 13, name: "Al Qassimi Hospital, Sharjah", type: "Hospital", country: "UAE", lat: 25.3463, lng: 55.4209, capacity: 362, specialties: ["Emergency", "General Medicine", "Pediatrics"] },
  { id: 14, name: "Al Dhaid Hospital", type: "Health Center", country: "UAE", lat: 25.2890, lng: 55.8800, capacity: 80, specialties: ["General Medicine", "Maternal Care"] },
  { id: 15, name: "Dibba Al Fujairah Hospital", type: "Clinic", country: "UAE", lat: 25.5925, lng: 56.2617, capacity: 45, specialties: ["General Medicine"] },

  // ---- Qatar ----
  { id: 16, name: "Hamad General Hospital, Doha", type: "Hospital", country: "Qatar", lat: 25.2854, lng: 51.5310, capacity: 611, specialties: ["Emergency", "Surgery", "Cardiology"] },
  { id: 17, name: "Al Khor Hospital", type: "Hospital", country: "Qatar", lat: 25.6810, lng: 51.4970, capacity: 220, specialties: ["Emergency", "General Medicine"] },
  { id: 18, name: "Al Wakra Hospital", type: "Hospital", country: "Qatar", lat: 25.1715, lng: 51.6035, capacity: 253, specialties: ["Emergency", "Maternal Care", "Surgery"] },
  { id: 19, name: "Cuban Hospital, Dukhan", type: "Health Center", country: "Qatar", lat: 25.4253, lng: 50.7867, capacity: 70, specialties: ["General Medicine"] },
  { id: 20, name: "Rumailah Hospital, Doha", type: "Hospital", country: "Qatar", lat: 25.2820, lng: 51.5200, capacity: 360, specialties: ["Geriatrics", "Rehabilitation"] },

  // ---- Bahrain ----
  { id: 21, name: "Salmaniya Medical Complex", type: "Hospital", country: "Bahrain", lat: 26.2198, lng: 50.6145, capacity: 1200, specialties: ["Emergency", "Surgery", "Cardiology"] },
  { id: 22, name: "King Hamad University Hospital", type: "Hospital", country: "Bahrain", lat: 26.1736, lng: 50.5478, capacity: 313, specialties: ["Emergency", "Trauma", "Organ Transplant"] },
  { id: 23, name: "Bahrain Defence Force Hospital", type: "Hospital", country: "Bahrain", lat: 26.2100, lng: 50.5900, capacity: 220, specialties: ["Emergency", "General Medicine"] },
  { id: 24, name: "Muharraq Health Center", type: "Health Center", country: "Bahrain", lat: 26.2572, lng: 50.6119, capacity: 65, specialties: ["General Medicine", "Maternal Care"] },
  { id: 25, name: "Riffa Health Center", type: "Health Center", country: "Bahrain", lat: 26.1300, lng: 50.5550, capacity: 55, specialties: ["General Medicine"] },

  // ---- Kuwait ----
  { id: 26, name: "Amiri Hospital, Kuwait City", type: "Hospital", country: "Kuwait", lat: 29.3759, lng: 47.9774, capacity: 470, specialties: ["Emergency", "Internal Medicine", "Cardiology"] },
  { id: 27, name: "Mubarak Al-Kabeer Hospital", type: "Hospital", country: "Kuwait", lat: 29.3000, lng: 48.0800, capacity: 623, specialties: ["Nephrology", "Gastroenterology", "Surgery"] },
  { id: 28, name: "Jahra Hospital", type: "Hospital", country: "Kuwait", lat: 29.3375, lng: 47.6581, capacity: 380, specialties: ["Emergency", "General Medicine"] },
  { id: 29, name: "Farwaniya Hospital", type: "Hospital", country: "Kuwait", lat: 29.2775, lng: 47.9391, capacity: 460, specialties: ["Emergency", "Pediatrics", "Maternal Care"] },
  { id: 30, name: "Adan Hospital, Al Ahmadi", type: "Hospital", country: "Kuwait", lat: 29.0769, lng: 48.0837, capacity: 400, specialties: ["Emergency", "Surgery"] },
];

export const settlements: Settlement[] = [
  // ---- Oman ----
  { id: 1, name: "Al Hamra", country: "Oman", lat: 23.119, lng: 57.281, population: 12000, travelTime: 18 },
  { id: 2, name: "Haima", country: "Oman", lat: 19.959, lng: 56.275, population: 8500, travelTime: 52 },
  { id: 3, name: "Duqm", country: "Oman", lat: 19.663, lng: 57.699, population: 18000, travelTime: 38 },
  { id: 4, name: "Rustaq", country: "Oman", lat: 23.3908, lng: 57.4247, population: 15500, travelTime: 29 },
  { id: 5, name: "Ibra", country: "Oman", lat: 22.6906, lng: 58.5334, population: 10200, travelTime: 33 },

  // ---- Saudi Arabia ----
  { id: 6, name: "Al Ula", country: "Saudi Arabia", lat: 26.608, lng: 37.923, population: 32000, travelTime: 67 },
  { id: 7, name: "Wadi Al Dawasir", country: "Saudi Arabia", lat: 20.462, lng: 44.793, population: 58000, travelTime: 43 },
  { id: 8, name: "Sharurah", country: "Saudi Arabia", lat: 17.4713, lng: 47.1173, population: 24500, travelTime: 71 },
  { id: 9, name: "Rafha", country: "Saudi Arabia", lat: 29.6255, lng: 43.4930, population: 19800, travelTime: 58 },
  { id: 10, name: "Baljurashi", country: "Saudi Arabia", lat: 19.8564, lng: 41.5665, population: 27300, travelTime: 24 },

  // ---- UAE ----
  { id: 11, name: "Liwa Oasis", country: "UAE", lat: 23.1333, lng: 53.7833, population: 9500, travelTime: 61 },
  { id: 12, name: "Hatta", country: "UAE", lat: 24.7996, lng: 56.1172, population: 17300, travelTime: 45 },
  { id: 13, name: "Al Madam", country: "UAE", lat: 25.0000, lng: 55.7833, population: 6200, travelTime: 27 },
  { id: 14, name: "Al Ghail, Ras Al Khaimah", country: "UAE", lat: 25.9333, lng: 56.0333, population: 4800, travelTime: 39 },
  { id: 15, name: "Al Ain (outer settlements)", country: "UAE", lat: 24.2075, lng: 55.7447, population: 42000, travelTime: 22 },

  // ---- Qatar ----
  { id: 16, name: "Umm Salal", country: "Qatar", lat: 25.4149, lng: 51.4053, population: 20500, travelTime: 19 },
  { id: 17, name: "Al Shahaniya", country: "Qatar", lat: 25.3708, lng: 51.2172, population: 8700, travelTime: 31 },
  { id: 18, name: "Al Ruwais", country: "Qatar", lat: 26.1417, lng: 51.2131, population: 5300, travelTime: 48 },
  { id: 19, name: "Simaisma", country: "Qatar", lat: 25.5333, lng: 51.5667, population: 3100, travelTime: 26 },
  { id: 20, name: "Mesaieed", country: "Qatar", lat: 24.9911, lng: 51.5470, population: 14200, travelTime: 21 },

  // ---- Bahrain ----
  { id: 21, name: "Sitra", country: "Bahrain", lat: 26.1547, lng: 50.6247, population: 60000, travelTime: 14 },
  { id: 22, name: "Zallaq", country: "Bahrain", lat: 26.0464, lng: 50.4933, population: 4100, travelTime: 22 },
  { id: 23, name: "Budaiya", country: "Bahrain", lat: 26.2244, lng: 50.4586, population: 33000, travelTime: 16 },
  { id: 24, name: "Askar", country: "Bahrain", lat: 26.0731, lng: 50.5764, population: 5600, travelTime: 20 },
  { id: 25, name: "Hamad Town", country: "Bahrain", lat: 26.1197, lng: 50.5064, population: 90000, travelTime: 12 },

  // ---- Kuwait ----
  { id: 26, name: "Wafra", country: "Kuwait", lat: 28.6394, lng: 47.9358, population: 7200, travelTime: 54 },
  { id: 27, name: "Al Nuwaiseeb", country: "Kuwait", lat: 28.5667, lng: 48.4167, population: 2100, travelTime: 63 },
  { id: 28, name: "Sabriya", country: "Kuwait", lat: 29.7167, lng: 47.7500, population: 3400, travelTime: 49 },
  { id: 29, name: "Abdali", country: "Kuwait", lat: 29.8667, lng: 47.7167, population: 5800, travelTime: 57 },
  { id: 30, name: "Mutlaa", country: "Kuwait", lat: 29.4667, lng: 47.7333, population: 12500, travelTime: 32 },
];