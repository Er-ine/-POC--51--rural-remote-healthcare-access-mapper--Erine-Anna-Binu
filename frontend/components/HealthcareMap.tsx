"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
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

type Props = {
  analysisResults: AccessibilityResult[];
  selectedCountry: "All" | "Oman" | "Saudi Arabia";
  selectedSettlement: AccessibilityResult | null;
  onSettlementSelect: (
    settlement: AccessibilityResult
  ) => void;
};

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapController({
  selectedSettlement,
}: {
  selectedSettlement: AccessibilityResult | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedSettlement) return;

    map.flyTo(
      [
        selectedSettlementLatitude(
          selectedSettlement.settlement_id
        ),
        selectedSettlementLongitude(
          selectedSettlement.settlement_id
        ),
      ],
      Math.max(map.getZoom(), 6),
      {
        duration: 0.45,
      }
    );
  }, [selectedSettlement, map]);

  return null;
}

function selectedSettlementLatitude(id: number) {
  const settlement = settlements.find(
    (item) => item.id === id
  );

  return settlement?.lat ?? 23.5;
}

function selectedSettlementLongitude(id: number) {
  const settlement = settlements.find(
    (item) => item.id === id
  );

  return settlement?.lng ?? 50;
}

export default function HealthcareMap({
  analysisResults,
  selectedCountry,
  selectedSettlement,
  onSettlementSelect,
}: Props) {
  const visibleSettlements = useMemo(() => {
    return settlements.filter(
      (settlement) =>
        selectedCountry === "All" ||
        settlement.country === selectedCountry
    );
  }, [selectedCountry]);

  const visibleFacilities = useMemo(() => {
    return healthcareFacilities.filter(
      (facility) =>
        selectedCountry === "All" ||
        facility.country === selectedCountry
    );
  }, [selectedCountry]);

  const resultMap = useMemo(() => {
    const map = new Map<
      number,
      AccessibilityResult
    >();

    analysisResults.forEach((result) => {
      map.set(result.settlement_id, result);
    });

    return map;
  }, [analysisResults]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[23.5, 50]}
        zoom={5}
        minZoom={4}
        maxZoom={10}
        scrollWheelZoom={true}
        preferCanvas={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          selectedSettlement={selectedSettlement}
        />

        {/* HEALTHCARE FACILITIES */}
        {visibleFacilities.map((facility) => (
          <Marker
            key={`facility-${facility.id}`}
            position={[
              facility.lat,
              facility.lng,
            ]}
          >
            <Popup>
              <div className="min-w-[190px]">
                <h3 className="font-bold">
                  {facility.name}
                </h3>

                <div className="mt-2 space-y-1 text-sm">
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
                    {facility.capacity}
                  </p>

                  <p>
                    <strong>Specialties:</strong>{" "}
                    {facility.specialties.join(", ")}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* SETTLEMENTS */}
        {visibleSettlements.map((settlement) => {
          const result = resultMap.get(settlement.id);

          const isSelected =
            selectedSettlement?.settlement_id ===
            settlement.id;

          const travelTime =
            settlement.travelTime;

          const color =
            travelTime > 60
              ? "#ef4444"
              : travelTime > 30
                ? "#f59e0b"
                : "#22c55e";

          return (
            <CircleMarker
              key={`settlement-${settlement.id}`}
              center={[
                settlement.lat,
                settlement.lng,
              ]}
              radius={isSelected ? 13 : 9}
              pathOptions={{
                color: isSelected
                  ? "#ffffff"
                  : color,
                weight: isSelected ? 3 : 2,
                fillColor: color,
                fillOpacity: isSelected ? 0.95 : 0.75,
              }}
              eventHandlers={{
                click: () => {
                  if (result) {
                    onSettlementSelect(result);
                  }
                },
              }}
            >
              <Popup>
                <div className="min-w-[210px]">
                  <h3 className="font-bold">
                    {settlement.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {settlement.country}
                  </p>

                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Population:</strong>{" "}
                      {settlement.population.toLocaleString()}
                    </p>

                    <p>
                      <strong>Travel time:</strong>{" "}
                      {settlement.travelTime} min
                    </p>

                    {result && (
                      <>
                        <p>
                          <strong>
                            Nearest facility:
                          </strong>{" "}
                          {result.nearest_facility}
                        </p>

                        <p>
                          <strong>
                            Distance:
                          </strong>{" "}
                          {result.distance_km} km
                        </p>

                        <p className="font-semibold text-red-600">
                          {result.accessibility_status}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* MAP LEGEND */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-slate-700 bg-[#030712]/90 px-3 py-2 shadow-xl backdrop-blur">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
          Access Status
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span>≤ 30 min</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <span>31–60 min</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>&gt; 60 min</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span>Healthcare facility</span>
          </div>
        </div>
      </div>

      {/* MAP STATUS */}
      <div className="absolute right-4 top-4 z-[1000] rounded-lg border border-slate-700 bg-[#030712]/90 px-3 py-2 backdrop-blur">
        <div className="text-[9px] uppercase tracking-widest text-slate-500">
          Showing
        </div>

        <div className="mt-0.5 text-xs font-semibold text-white">
          {visibleSettlements.length} settlements
        </div>
      </div>
    </div>
  );
}