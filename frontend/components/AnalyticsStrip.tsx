"use client";

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
  results: AccessibilityResult[];
  underservedCount: number;
  totalPopulation: number;
  averageDistance: number;
};

export default function AnalyticsStrip({
  results,
  underservedCount,
  totalPopulation,
  averageDistance,
}: Props) {
  const criticalCount = results.filter(
    (result) => result.distance_km > 60
  ).length;

  const moderateCount = results.filter(
    (result) =>
      result.distance_km > 30 && result.distance_km <= 60
  ).length;

  const accessibleCount = results.filter(
    (result) => result.distance_km <= 30
  ).length;

  const maxDistance = Math.max(
    ...results.map((result) => result.distance_km),
    1
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {/* DISTANCE DISTRIBUTION */}
      <div className="rounded-xl border border-[rgba(45,212,191,0.18)] bg-[#0a1f24] p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between border-b border-[rgba(45,212,191,0.12)] pb-2">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-[#2dd4bf]">
              ACCESS HORIZON SPREAD
            </div>
            <div className="text-xs font-semibold text-[#f0fdfa]">
              Travel-time distance bands
            </div>
          </div>
          <span className="rounded border border-[rgba(45,212,191,0.25)] bg-[rgba(45,212,191,0.1)] px-1.5 py-0.5 text-[8px] font-bold text-[#2dd4bf]">
            REALTIME
          </span>
        </div>

        <div className="space-y-2.5">
          <Bar
            label="&le; 30 min (Accessible)"
            value={accessibleCount}
            total={results.length}
            barColor="bg-[#2dd4bf]"
          />
          <Bar
            label="31–60 min (Moderate)"
            value={moderateCount}
            total={results.length}
            barColor="bg-amber-400"
          />
          <Bar
            label="&gt; 60 min (Critical Gap)"
            value={criticalCount}
            total={results.length}
            barColor="bg-red-400"
          />
        </div>
      </div>

      {/* POPULATION IMPACT */}
      <div className="rounded-xl border border-[rgba(45,212,191,0.18)] bg-[#0a1f24] p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between border-b border-[rgba(45,212,191,0.12)] pb-2">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#2dd4bf]">
            POPULATION ACCESSIBILITY
          </div>
          <span className="text-[9px] text-[#64748b]">Synthetic model</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight text-white">
              {totalPopulation.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94a3b8]">Covered settlement population</p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight text-red-400">
              {underservedCount}
            </p>
            <p className="text-[10px] text-[#94a3b8]">Underserved areas</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-[#94a3b8] mb-1">
            <span>Underserved Ratio</span>
            <span className="font-semibold text-white">
              {results.length > 0
                ? `${Math.round((underservedCount / results.length) * 100)}%`
                : "0%"}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#06161a]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-400"
              style={{
                width:
                  results.length > 0
                    ? `${(underservedCount / results.length) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {/* NETWORK SIGNAL */}
      <div className="rounded-xl border border-[rgba(45,212,191,0.18)] bg-[#0a1f24] p-4 shadow-xl sm:col-span-2 lg:col-span-1">
        <div className="mb-3 flex items-center justify-between border-b border-[rgba(45,212,191,0.12)] pb-2">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#2dd4bf]">
            DISTANCE METRIC TELEMETRY
          </div>
          <span className="flex items-center gap-1 text-[9px] text-[#2dd4bf]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf]" />
            Haversine
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[rgba(45,212,191,0.12)] bg-[#06161a]/60 p-2.5">
            <p className="text-[9px] uppercase tracking-wide text-[#64748b]">
              AVERAGE DISTANCE
            </p>
            <p className="mt-1 text-xl font-bold text-[#2dd4bf]">
              {averageDistance.toFixed(1)}
              <span className="ml-1 text-[10px] font-normal text-[#94a3b8]">km</span>
            </p>
          </div>

          <div className="rounded-lg border border-[rgba(45,212,191,0.12)] bg-[#06161a]/60 p-2.5">
            <p className="text-[9px] uppercase tracking-wide text-[#64748b]">
              PEAK DISPARITY
            </p>
            <p className="mt-1 text-xl font-bold text-red-400">
              {maxDistance.toFixed(1)}
              <span className="ml-1 text-[10px] font-normal text-[#94a3b8]">km</span>
            </p>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-[#64748b]">
          Calculated against nearest national healthcare facilities using straight-line geodesic coordinates.
        </p>
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  total,
  barColor,
}: {
  label: string;
  value: number;
  total: number;
  barColor: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px]">
        <span className="text-[#94a3b8]">{label}</span>
        <span className="font-semibold text-white">
          {value} <span className="text-[9px] text-[#64748b]">({Math.round(percentage)}%)</span>
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[#06161a]">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}