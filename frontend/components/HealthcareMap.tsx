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

export type AccessibilityResult = {
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
  onSettlementSelect: (settlement: AccessibilityResult) => void;
  panelOpen?: boolean;
};

// Fix Leaflet's default icon path issues in Next.js without using 'any'
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ISOCHRONE_BANDS = [
  { minutes: 90, radiusKm: 60, color: "#ef4444", fillOpacity: 0.05 },
  { minutes: 60, radiusKm: 40, color: "#f59e0b", fillOpacity: 0.08 },
  { minutes: 30, radiusKm: 20, color: "#2dd4bf", fillOpacity: 0.12 },
];

function MapController({
  selectedSettlement,
  panelOpen,
}: {
  selectedSettlement: AccessibilityResult | null;
  panelOpen?: boolean;
}) {
  const map = useMap();

  // Invalidate map size when slide-over panel opens or closes
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 320);
    return () => clearTimeout(timer);
  }, [panelOpen, map]);

  useEffect(() => {
    if (!selectedSettlement) return;

    map.flyTo(
      [
        selectedSettlementLatitude(selectedSettlement.settlement_id),
        selectedSettlementLongitude(selectedSettlement.settlement_id),
      ],
      Math.max(map.getZoom(), 6),
      {
        duration: 0.5,
      }
    );
  }, [selectedSettlement, map]);

  return null;
}

function selectedSettlementLatitude(id: number) {
  const settlement = settlements.find((item) => item.id === id);
  return settlement?.lat ?? 23.5;
}

function selectedSettlementLongitude(id: number) {
  const settlement = settlements.find((item) => item.id === id);
  return settlement?.lng ?? 50;
}

export default function HealthcareMap({
  analysisResults,
  selectedCountry,
  selectedSettlement,
  onSettlementSelect,
  panelOpen = false,
}: Props) {
  const [showIsochrones, setShowIsochrones] = useState(true);
  const [showChoropleth, setShowChoropleth] = useState(false);
  const [showPopulationDensity, setShowPopulationDensity] = useState(false);

  const visibleSettlements = useMemo(() => {
    return settlements.filter(
      (settlement) =>
        selectedCountry === "All" || settlement.country === selectedCountry
    );
  }, [selectedCountry]);

  const visibleFacilities = useMemo(() => {
    return healthcareFacilities.filter(
      (facility) =>
        selectedCountry === "All" || facility.country === selectedCountry
    );
  }, [selectedCountry]);

  const resultMap = useMemo(() => {
    const map = new Map<number, AccessibilityResult>();
    analysisResults.forEach((result) => {
      map.set(result.settlement_id, result);
    });
    return map;
  }, [analysisResults]);

  // Cinematic custom facility icon with teal glow and medical cross
  const facilityIcon = useMemo(() => {
    return L.divIcon({
      className: "custom-facility-pin",
      html: `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;background:#06161a;border:1.5px solid #2dd4bf;box-shadow:0 0 10px rgba(45,212,191,0.7);color:#2dd4bf;font-weight:bold;font-size:12px;">✚</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -14],
    });
  }, []);

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

  // ACCESS-GAP CHOROPLETH (D3 Voronoi over settlements)
  const { cells: choroplethCells, maxTravel: choroplethMaxTravel } =
    useMemo(() => {
      if (visibleSettlements.length < 3) {
        return { cells: [], maxTravel: 0 };
      }

      const points: [number, number][] = visibleSettlements.map((s) => [
        s.lng,
        s.lat,
      ]);

      const delaunay = d3.Delaunay.from(points);
      const bounds: [number, number, number, number] = [34, 12, 62, 32];
      const voronoi = delaunay.voronoi(bounds);

      const maxTravel =
        d3.max(visibleSettlements, (s: { travelTime: number }) => s.travelTime) ?? 90;

      const colorScale = d3
        .scaleLinear<string>()
        .domain([0, maxTravel / 2, maxTravel])
        .range(["#065f46", "#b45309", "#7f1d1d"]);

      const cells = visibleSettlements
        .map((settlement, i) => {
          const cellPolygon = voronoi.cellPolygon(i);
          if (!cellPolygon) return null;

          const latlngs = cellPolygon.map(
            ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
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

      return { cells, maxTravel };
    }, [visibleSettlements]);

  const populationCircles = useMemo(() => {
    const maxPop =
      d3.max(visibleSettlements, (s: { population: number }) => s.population) ?? 1;

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
        maxZoom={12}
        scrollWheelZoom={true}
        preferCanvas={true}
        className="h-full w-full"
      >
        {/* Esri World Dark Gray Canvas: reliable, dark, professional, and free without API keys */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, OpenStreetMap contributors'
          maxZoom={16}
        />

        <MapController
          selectedSettlement={selectedSettlement}
          panelOpen={panelOpen}
        />

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
                {cell.name}: {cell.travelTime} min to nearest facility
              </Tooltip>
            </Polygon>
          ))}

        {showPopulationDensity &&
          populationCircles.map((circle) => (
            <Circle
              key={circle.key}
              center={circle.center}
              radius={circle.radius}
              pathOptions={{
                color: "#2dd4bf",
                weight: 1,
                fillColor: "#2dd4bf",
                fillOpacity: 0.15,
              }}
            >
              <Tooltip sticky>
                {circle.name}: {circle.population.toLocaleString()} residents (Synthetic)
              </Tooltip>
            </Circle>
          ))}

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

        {visibleFacilities.map((facility) => (
          <Marker
            key={`facility-${facility.id}`}
            position={[facility.lat, facility.lng]}
            icon={facilityIcon}
          >
            <Popup>
              <div className="min-w-[190px]">
                <div className="flex items-center gap-1.5 border-b border-[rgba(45,212,191,0.2)] pb-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#2dd4bf]" />
                  <h3 className="font-bold text-white">{facility.name}</h3>
                </div>
                <div className="mt-2 space-y-1 text-xs text-[#94a3b8]">
                  <p>
                    <strong className="text-[#f0fdfa]">Type:</strong> {facility.type}
                  </p>
                  <p>
                    <strong className="text-[#f0fdfa]">Country:</strong> {facility.country}
                  </p>
                  <p>
                    <strong className="text-[#f0fdfa]">Capacity:</strong> {facility.capacity} beds <span className="text-[10px] text-[#64748b]">(Synthetic)</span>
                  </p>
                  <p>
                    <strong className="text-[#f0fdfa]">Specialties:</strong>{" "}
                    {facility.specialties.join(", ")}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {visibleSettlements.map((settlement) => {
          const result = resultMap.get(settlement.id);
          const isSelected =
            selectedSettlement?.settlement_id === settlement.id;
          const travelTime = settlement.travelTime;
          const color =
            travelTime > 60
              ? "#ef4444"
              : travelTime > 30
                ? "#f59e0b"
                : "#2dd4bf";

          return (
            <CircleMarker
              key={`settlement-${settlement.id}`}
              center={[settlement.lat, settlement.lng]}
              radius={isSelected ? 13 : 9}
              pathOptions={{
                color: isSelected ? "#ffffff" : color,
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
                  <div className="flex items-center justify-between border-b border-[rgba(45,212,191,0.2)] pb-1.5">
                    <h3 className="font-bold text-white">{settlement.name}</h3>
                    <span className="text-[10px] text-[#94a3b8]">{settlement.country}</span>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-[#94a3b8]">
                    <p>
                      <strong className="text-[#f0fdfa]">Population:</strong>{" "}
                      {settlement.population.toLocaleString()}{" "}
                      <span className="text-[10px] text-[#64748b]">(Synthetic)</span>
                    </p>
                    <p>
                      <strong className="text-[#f0fdfa]">Travel time:</strong>{" "}
                      {settlement.travelTime} min
                    </p>
                    {result && (
                      <>
                        <p>
                          <strong className="text-[#f0fdfa]">Nearest facility:</strong>{" "}
                          {result.nearest_facility}
                        </p>
                        <p>
                          <strong className="text-[#f0fdfa]">Distance:</strong>{" "}
                          <span className="font-semibold text-white">{result.distance_km} km</span>
                        </p>
                        <p className={`font-semibold ${
                          result.accessibility_status === "Underserved"
                            ? "text-red-400"
                            : result.accessibility_status === "Moderate Access"
                              ? "text-amber-400"
                              : "text-[#2dd4bf]"
                        }`}>
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

      {/* LAYER TOGGLES (Floating HUD Top-Left) */}
      <div className="absolute left-3 top-3 z-[1000] rounded-xl border border-[rgba(45,212,191,0.2)] bg-[#0a1f24]/90 p-2.5 shadow-2xl backdrop-blur-md sm:left-4 sm:top-4 sm:p-3">
        <div className="mb-1.5 flex items-center gap-1.5 border-b border-[rgba(45,212,191,0.15)] pb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf]" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#2dd4bf]">
            Map Overlays
          </span>
        </div>

        <div className="space-y-1">
          <label className="flex cursor-pointer items-center gap-2 text-[10px] text-[#f0fdfa] transition hover:text-[#2dd4bf] sm:text-[11px]">
            <input
              type="checkbox"
              checked={showIsochrones}
              onChange={(e) => setShowIsochrones(e.target.checked)}
              className="h-3 w-3 accent-[#2dd4bf]"
            />
            <span>Isochrone bands</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-[10px] text-[#f0fdfa] transition hover:text-[#2dd4bf] sm:text-[11px]">
            <input
              type="checkbox"
              checked={showChoropleth}
              onChange={(e) => setShowChoropleth(e.target.checked)}
              className="h-3 w-3 accent-[#2dd4bf]"
            />
            <span>Access-gap Voronoi</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-[10px] text-[#f0fdfa] transition hover:text-[#2dd4bf] sm:text-[11px]">
            <input
              type="checkbox"
              checked={showPopulationDensity}
              onChange={(e) => setShowPopulationDensity(e.target.checked)}
              className="h-3 w-3 accent-[#2dd4bf]"
            />
            <span>Population circles</span>
          </label>
        </div>
      </div>

      {/* SETTLEMENT STATUS LEGEND (Floating HUD Bottom-Left) */}
      <div className="hidden sm:block absolute bottom-14 left-4 z-[1000] rounded-xl border border-[rgba(45,212,191,0.2)] bg-[#0a1f24]/90 p-3 shadow-2xl backdrop-blur-md">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#94a3b8]">
          Catchment Legend
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] text-[#f0fdfa]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2dd4bf]" />
            <span>&le; 30 min (Well Served)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#f0fdfa]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
            <span>31–60 min (Moderate)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#f0fdfa]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
            <span>&gt; 60 min (Underserved)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#f0fdfa]">
            <span className="flex h-3 w-3 items-center justify-center rounded-sm bg-[#06161a] border border-[#2dd4bf] text-[9px] font-bold text-[#2dd4bf]">
              ✚
            </span>
            <span>Healthcare Facility</span>
          </div>
        </div>
      </div>

      {/* CHOROPLETH GRADIENT LEGEND */}
      {showChoropleth && (
        <div className="hidden sm:block absolute bottom-14 left-[185px] z-[1000] rounded-xl border border-[rgba(45,212,191,0.2)] bg-[#0a1f24]/90 p-3 shadow-2xl backdrop-blur-md">
          <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#94a3b8]">
            Access Gap (Travel Time)
          </div>

          <div
            className="h-2 w-32 rounded-full"
            style={{
              background: "linear-gradient(to right, #065f46, #b45309, #7f1d1d)",
            }}
          />

          <div className="mt-1 flex w-32 justify-between text-[9px] text-[#94a3b8]">
            <span>0 min</span>
            <span>{Math.round(choroplethMaxTravel / 2)} min</span>
            <span>{choroplethMaxTravel} min</span>
          </div>
        </div>
      )}

      {/* MAP STATUS INDICATOR */}
      <div
        className={`hidden md:block absolute top-4 z-[1000] rounded-xl border border-[rgba(45,212,191,0.2)] bg-[#0a1f24]/90 px-3 py-2 shadow-2xl backdrop-blur-md transition-all duration-300 ${
          panelOpen ? "right-[456px]" : "right-4"
        }`}
      >
        <div className="text-[9px] uppercase tracking-widest text-[#64748b]">
          Active Canvas
        </div>
        <div className="mt-0.5 text-xs font-semibold text-[#f0fdfa]">
          {visibleSettlements.length} settlements · {visibleFacilities.length} facilities
        </div>
      </div>
    </div>
  );
}