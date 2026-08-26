export type HealthcareFacility = {
  id: number;
  name: string;
  type: "Hospital" | "Health Center" | "Clinic";
  country: "Oman" | "Saudi Arabia";
  lat: number;
  lng: number;
  capacity: number;
  specialties: string[];
};

export type Settlement = {
  id: number;
  name: string;
  country: "Oman" | "Saudi Arabia";
  lat: number;
  lng: number;
  population: number;
  travelTime: number;
};

export const healthcareFacilities: HealthcareFacility[] = [
  {
    id: 1,
    name: "Muscat Regional Hospital",
    type: "Hospital",
    country: "Oman",
    lat: 23.588,
    lng: 58.382,
    capacity: 450,
    specialties: ["Emergency", "Cardiology", "Surgery"],
  },
  {
    id: 2,
    name: "Nizwa Health Center",
    type: "Health Center",
    country: "Oman",
    lat: 22.933,
    lng: 57.533,
    capacity: 120,
    specialties: ["General Medicine", "Maternal Care"],
  },
  {
    id: 3,
    name: "Ibri Rural Clinic",
    type: "Clinic",
    country: "Oman",
    lat: 23.225,
    lng: 56.515,
    capacity: 40,
    specialties: ["General Medicine"],
  },
  {
    id: 4,
    name: "Riyadh General Hospital",
    type: "Hospital",
    country: "Saudi Arabia",
    lat: 24.713,
    lng: 46.675,
    capacity: 600,
    specialties: ["Emergency", "Surgery", "Cardiology"],
  },
  {
    id: 5,
    name: "Al Bahah Health Center",
    type: "Health Center",
    country: "Saudi Arabia",
    lat: 20.012,
    lng: 41.467,
    capacity: 90,
    specialties: ["General Medicine", "Pediatrics"],
  },
];

export const settlements: Settlement[] = [
  {
    id: 1,
    name: "Al Hamra",
    country: "Oman",
    lat: 23.119,
    lng: 57.281,
    population: 12000,
    travelTime: 18,
  },
  {
    id: 2,
    name: "Haima",
    country: "Oman",
    lat: 19.959,
    lng: 56.275,
    population: 8500,
    travelTime: 52,
  },
  {
    id: 3,
    name: "Duqm",
    country: "Oman",
    lat: 19.663,
    lng: 57.699,
    population: 18000,
    travelTime: 38,
  },
  {
    id: 4,
    name: "Al Ula",
    country: "Saudi Arabia",
    lat: 26.608,
    lng: 37.923,
    population: 32000,
    travelTime: 67,
  },
  {
    id: 5,
    name: "Wadi Al Dawasir",
    country: "Saudi Arabia",
    lat: 20.462,
    lng: 44.793,
    population: 58000,
    travelTime: 43,
  },
];