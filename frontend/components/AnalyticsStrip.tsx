"use client";

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
      result.distance_km > 30 &&
      result.distance_km <= 60
  ).length;

  const accessibleCount = results.filter(
    (result) => result.distance_km <= 30
  ).length;

  const maxDistance = Math.max(
    ...results.map((result) => result.distance_km),
    1
  );

  return (
    <section className="mt-3 grid gap-3 lg:grid-cols-3">
      {/* DISTANCE DISTRIBUTION */}
      <div className="rounded-xl border border-slate-800 bg-[#07101b] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
              ACCESS GAP DISTRIBUTION
            </div>

            <div className="mt-1 text-xs text-slate-400">
              Settlement travel-time bands
            </div>
          </div>

          <span className="text-[9px] text-cyan-400">
            LIVE
          </span>
        </div>

        <div className="space-y-3">
          <Bar
            label="≤ 30 min"
            value={accessibleCount}
            total={results.length}
            className="bg-emerald-400"
          />

          <Bar
            label="31–60 min"
            value={moderateCount}
            total={results.length}
            className="bg-amber-400"
          />

          <Bar
            label="> 60 min"
            value={criticalCount}
            total={results.length}
            className="bg-red-400"
          />
        </div>
      </div>

      {/* POPULATION IMPACT */}
      <div className="rounded-xl border border-slate-800 bg-[#07101b] p-4">
        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
          POPULATION IMPACT
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-white">
              {totalPopulation.toLocaleString()}
            </p>

            <p className="mt-1 text-[9px] text-slate-600">
              people represented
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-red-300">
              {underservedCount}
            </p>

            <p className="mt-1 text-[9px] text-slate-600">
              underserved areas
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-red-400"
            style={{
              width:
                results.length > 0
                  ? `${(underservedCount / results.length) * 100}%`
                  : "0%",
            }}
          />
        </div>
      </div>

      {/* NETWORK SIGNAL */}
      <div className="rounded-xl border border-slate-800 bg-[#07101b] p-4">
        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
          NETWORK ACCESS SIGNAL
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] text-slate-600">
              AVG DISTANCE
            </p>

            <p className="mt-1 text-xl font-bold text-cyan-300">
              {averageDistance.toFixed(1)}
              <span className="ml-1 text-[9px] font-normal">
                km
              </span>
            </p>
          </div>

          <div>
            <p className="text-[9px] text-slate-600">
              MAX DISTANCE
            </p>

            <p className="mt-1 text-xl font-bold text-red-300">
              {maxDistance.toFixed(1)}
              <span className="ml-1 text-[9px] font-normal">
                km
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-[9px] text-slate-500">
            Accessibility engine active
          </span>
        </div>
      </div>
    </section>
  );
}

function Bar({
  label,
  value,
  total,
  className,
}: {
  label: string;
  value: number;
  total: number;
  className: string;
}) {
  const percentage =
    total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="text-[9px] text-slate-500">
          {label}
        </span>

        <span className="text-[9px] font-semibold text-slate-300">
          {value}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${className}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}