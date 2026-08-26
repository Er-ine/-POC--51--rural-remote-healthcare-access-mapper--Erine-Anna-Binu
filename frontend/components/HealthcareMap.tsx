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

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function HealthcareMap() {
  return (
    <div className="h-[600px] w-full overflow-hidden rounded-xl border">
      <MapContainer
        center={[23.5, 50]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {healthcareFacilities.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.lat, facility.lng]}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{facility.name}</h3>

                <p>
                  <strong>Type:</strong> {facility.type}
                </p>

                <p>
                  <strong>Capacity:</strong> {facility.capacity}
                </p>

                <p>
                  <strong>Specialties:</strong>{" "}
                  {facility.specialties.join(", ")}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {settlements.map((settlement) => {
          const color =
            settlement.travelTime > 60
              ? "#dc2626"
              : settlement.travelTime > 30
                ? "#f59e0b"
                : "#16a34a";

          return (
            <CircleMarker
              key={settlement.id}
              center={[settlement.lat, settlement.lng]}
              radius={10}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.7,
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{settlement.name}</h3>

                  <p>
                    Population: {settlement.population.toLocaleString()}
                  </p>

                  <p>
                    Travel time to nearest facility:{" "}
                    <strong>{settlement.travelTime} minutes</strong>
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}