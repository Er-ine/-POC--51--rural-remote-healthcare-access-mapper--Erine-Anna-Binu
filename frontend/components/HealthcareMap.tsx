"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import * as turf from "@turf/turf";
import * as d3 from "d3";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  CircleMarker,
  Polygon,
  Circle,
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
  selectedCountry: string;
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

// ── ISOCHRONE CONFIG ──────────────────────────────────────────────
// No real road-network routing available for this POC, so bands are
// distance rings around each facility approximating travel time at
// an assumed rural road speed (~40 km/h). Flagged as an approximation
// in VAR_REPORT.md — swap for a real routing engine (e.g. OSRM) if
// this becomes production.
const ISOCHRONE_BANDS = [
  { minutes: 90, radiusKm: 60, color: "#ef4444", fillOpacity: 0.05 },
  { minutes: 60, radiusKm: 40, color: "#f59e0b", fillOpacity: 0.08 },
  { minutes: 30, radiusKm: 20, color: "#22c55e", fillOpacity: 0.14 },
];
// ───────────────────────────────────────────────────────────────────

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
  const [showIsochrones, setShowIsochrones] = useState(true);
  const [showChoropleth, setShowChoropleth] = useState(false);
  const [showPopulationDensity, setShowPopulationDensity] =
    useState(false);

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
    const map = new Map<number, AccessibilityResult>();

    return map;
  }, [analysisResults]);

  // ── ISOCHRONE RINGS (Turf.js) ─────────────────────────────────
  const isochroneRings = useMemo(() => {
    return visibleFacilities.flatMap((facility) =>
      ISOCHRONE_BANDS.map((band) => {
        const circle = turf.circle(
          [facility.lng, facility.lat],
          band.radiusKm,
          { units: "kilometers", steps: 48 }
        );

        const latlngs = circle.geometry.coordinates[0].map(
          ([lng, lat]) => [lat, lng] as [number, number]
        );

        return {
          key: `iso-${facility.id}-${band.minutes}`,
          latlngs,
          color: band.color,
          fillOpacity: band.fillOpacity,
          minutes: band.minutes,
          facilityName: facility.name,
        };
      })
    );
  }, [visibleFacilities]);

  // ── ACCESS-GAP CHOROPLETH (D3 Voronoi over settlements) ────────
  const choroplethCells = useMemo(() => {
    if (visibleSettlements.length < 3) return [];

    const points: [number, number][] = visibleSettlements.map(
      (s) => [s.lng, s.lat]
    );

    const delaunay = d3.Delaunay.from(points);

    // Rough bbox covering Oman + Saudi Arabia. Widen if you add
    // settlements outside this range.
    const bounds: [number, number, number, number] = [
      34, 12, 62, 32,
    ];

    const voronoi = delaunay.voronoi(bounds);

    const maxTravel =
      d3.max(visibleSettlements, (s) => s.travelTime) ?? 90;

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, maxTravel / 2, maxTravel])
      .range(["#065f46", "#b45309", "#7f1d1d"]);

    return visibleSettlements
      .map((settlement, i) => {
        const cellPolygon = voronoi.cellPolygon(i);
        if (!cellPolygon) return null;

        const latlngs = cellPolygon.map(
          ([lng, lat]) => [lat, lng] as [number, number]
        );

        return {
          key: `cell-${settlement.id}`,
          latlngs,
          color: colorScale(settlement.travelTime),
          travelTime: settlement.travelTime,
          name: settlement.name,
        };
      })
      .filter(
        (
          cell
        ): cell is {
          key: string;
          latlngs: [number, number][];
          color: string;
          travelTime: number;
          name: string;
        } => cell !== null
      );
  }, [visibleSettlements]);

  // ── POPULATION DENSITY OVERLAY ──────────────────────────────────
  // Graduated circles sized by settlement population — a proxy for
  // density since current mock data has no polygon-based district
  // boundaries. Radius scales with population using a sqrt scale so
  // area (not radius) is proportional to population, which is the
  // correct way to encode magnitude in a circle.
  const populationCircles = useMemo(() => {
    const maxPop =
      d3.max(visibleSettlements, (s) => s.population) ?? 1;

    const radiusScale = d3
      .scaleSqrt()
      .domain([0, maxPop])
      .range([0, 35000]);

    return visibleSettlements.map((s) => ({
      key: `pop-${s.id}`,
      center: [s.lat, s.lng] as [number, number],
      radius: radiusScale(s.population),
      population: s.population,
      name: s.name,
    }));
  }, [visibleSettlements]);

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

        {/* ACCESS-GAP CHOROPLETH */}
        {showChoropleth &&
          choroplethCells.map((cell) => (
            <Polygon
              key={cell.key}
              positions={cell.latlngs}
              pathOptions={{
                color: cell.color,
                weight: 1,
                fillColor: cell.color,
                fillOpacity: 0.35,
              }}
            >
              <Tooltip sticky>
                {cell.name}: {cell.travelTime} min to nearest
                facility
              </Tooltip>
            </Polygon>
          ))}

        {/* POPULATION DENSITY OVERLAY */}
        {showPopulationDensity &&
          populationCircles.map((circle) => (
            <Circle
              key={circle.key}
              center={circle.center}
              radius={circle.radius}
              pathOptions={{
                color: "#a78bfa",
                weight: 1,
                fillColor: "#a78bfa",
                fillOpacity: 0.15,
              }}
            >
              <Tooltip sticky>
                {circle.name}: {circle.population.toLocaleString()}{" "}
                people
              </Tooltip>
            </Circle>
          ))}

        {/* TRAVEL-TIME ISOCHRONE RINGS */}
        {showIsochrones &&
          isochroneRings.map((ring) => (
            <Polygon
              key={ring.key}
              positions={ring.latlngs}
              pathOptions={{
                color: ring.color,
                weight: 1,
                fillColor: ring.color,
                fillOpacity: ring.fillOpacity,
                dashArray: "4 3",
              }}
            >
              <Tooltip sticky>
                {ring.facilityName}: ~{ring.minutes} min catchment
              </Tooltip>
            </Polygon>
          ))}

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

      {/* LAYER TOGGLES */}
      <div className="absolute left-4 top-4 z-[1000] rounded-lg border border-slate-700 bg-[#030712]/90 px-3 py-2 shadow-xl backdrop-blur">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
          Layers
        </div>

        <label className="mb-1.5 flex items-center gap-2 text-[10px] text-slate-300">
          <input
            type="checkbox"
            checked={showIsochrones}
            onChange={(e) => setShowIsochrones(e.target.checked)}
            className="h-3 w-3 accent-cyan-400"
          />
          Isochrone bands
        </label>

        <label className="mb-1.5 flex items-center gap-2 text-[10px] text-slate-300">
          <input
            type="checkbox"
            checked={showChoropleth}
            onChange={(e) => setShowChoropleth(e.target.checked)}
            className="h-3 w-3 accent-cyan-400"
          />
          Access-gap choropleth
        </label>

        <label className="flex items-center gap-2 text-[10px] text-slate-300">
          <input
            type="checkbox"
            checked={showPopulationDensity}
            onChange={(e) =>
              setShowPopulationDensity(e.target.checked)
            }
            className="h-3 w-3 accent-violet-400"
          />
          Population density
        </label>
      </div>

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