"use client";

import L from "leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  healthcareFacilities,
  settlements,
} from "@/lib/mockData";


type AccessibilityResult = {
  settlement_id: number;
  settlement_name: string;
  country: string;
  population: number;
  nearest_facility: string;
  distance_km: number;
  accessibility_status: string;
};


type Country = "All" | "Oman" | "Saudi Arabia";


type HealthcareMapProps = {
  analysisResults?: AccessibilityResult[];
  selectedCountry?: Country;
};


// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


export default function HealthcareMap({
  analysisResults = [],
  selectedCountry = "All",
}: HealthcareMapProps) {


  // Filter healthcare facilities
  const filteredFacilities =
    selectedCountry === "All"
      ? healthcareFacilities
      : healthcareFacilities.filter(
          (facility) => facility.country === selectedCountry
        );


  // Filter settlements
  const filteredSettlements =
    selectedCountry === "All"
      ? settlements
      : settlements.filter(
          (settlement) => settlement.country === selectedCountry
        );


  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl border">


      <MapContainer
        center={[23.5, 50]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >


        {/* Map tiles */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* ===================================================== */}
        {/* HEALTHCARE FACILITIES */}
        {/* ===================================================== */}

        {filteredFacilities.map((facility) => (

          <Marker
            key={facility.id}
            position={[
              facility.lat,
              facility.lng,
            ]}
          >

            <Popup>

              <div className="space-y-1">

                <h3 className="text-base font-bold text-slate-900">
                  {facility.name}
                </h3>


                <p>
                  <strong>Type:</strong>{" "}
                  {facility.type}
                </p>


                <p>
                  <strong>Country:</strong>{" "}
                  {facility.country}
                </p>


                <p>
                  <strong>Capacity:</strong>{" "}
                  {facility.capacity.toLocaleString()}
                </p>


                <p>
                  <strong>Specialties:</strong>{" "}
                  {facility.specialties.join(", ")}
                </p>

              </div>

            </Popup>

          </Marker>

        ))}


        {/* ===================================================== */}
        {/* SETTLEMENTS */}
        {/* ===================================================== */}

        {filteredSettlements.map((settlement) => {


          // Find backend analysis for this settlement
          const analysis = analysisResults.find(
            (result) =>
              result.settlement_id === settlement.id
          );


          // Default color
          let color = "#16a34a";


          // Use backend accessibility classification
          if (analysis) {

            if (
              analysis.accessibility_status ===
              "Underserved"
            ) {
              color = "#dc2626";
            }

            else if (
              analysis.accessibility_status ===
              "Moderate Access"
            ) {
              color = "#f59e0b";
            }

            else if (
              analysis.accessibility_status ===
              "Well Served"
            ) {
              color = "#16a34a";
            }

          }


          return (

            <CircleMarker
              key={settlement.id}
              center={[
                settlement.lat,
                settlement.lng,
              ]}
              radius={10}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                weight: 3,
              }}
            >

              <Popup>

                <div className="space-y-2">

                  {/* Settlement name */}
                  <h3 className="text-base font-bold text-slate-900">
                    {settlement.name}
                  </h3>


                  {/* Country */}
                  <p>
                    <strong>Country:</strong>{" "}
                    {settlement.country}
                  </p>


                  {/* Population */}
                  <p>
                    <strong>Population:</strong>{" "}
                    {settlement.population.toLocaleString()}
                  </p>


                  {/* Backend analysis */}
                  {analysis ? (

                    <>

                      <p>
                        <strong>
                          Nearest facility:
                        </strong>{" "}
                        {analysis.nearest_facility}
                      </p>


                      <p>
                        <strong>
                          Distance:
                        </strong>{" "}
                        {analysis.distance_km} km
                      </p>


                      <p>
                        <strong>
                          Accessibility:
                        </strong>{" "}

                        <span
                          className={
                            analysis.accessibility_status ===
                            "Underserved"
                              ? "font-bold text-red-600"
                              : analysis.accessibility_status ===
                                  "Moderate Access"
                                ? "font-bold text-amber-500"
                                : "font-bold text-green-600"
                          }
                        >
                          {analysis.accessibility_status}
                        </span>

                      </p>

                    </>

                  ) : (

                    /* Fallback if backend data isn't available */
                    <p>
                      <strong>
                        Travel time:
                      </strong>{" "}
                      {settlement.travelTime} minutes
                    </p>

                  )}

                </div>

              </Popup>

            </CircleMarker>

          );

        })}

      </MapContainer>


      {/* ===================================================== */}
      {/* MAP LEGEND */}
      {/* ===================================================== */}

      <div className="absolute bottom-5 right-5 z-[1000] rounded-xl bg-white p-4 shadow-lg">

        <h3 className="mb-3 text-sm font-bold text-slate-900">
          Map Legend
        </h3>


        <div className="space-y-2 text-sm">


          {/* Healthcare facility */}
          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-blue-500" />

            <span className="text-slate-700">
              Healthcare Facility
            </span>

          </div>


          {/* Well served */}
          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-green-600" />

            <span className="text-slate-700">
              Well Served
            </span>

          </div>


          {/* Moderate access */}
          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-amber-500" />

            <span className="text-slate-700">
              Moderate Access
            </span>

          </div>


          {/* Underserved */}
          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-red-600" />

            <span className="text-slate-700">
              Underserved
            </span>

          </div>


        </div>

      </div>


    </div>
  );
}