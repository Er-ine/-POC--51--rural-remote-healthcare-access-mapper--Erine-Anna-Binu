"use client";

import { useMemo } from "react";

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
  onSelectSettlement?: (settlement: AccessibilityResult) => void;
};

export default function MobileClinicPanel({
  results,
  onSelectSettlement,
}: Props) {
  const route = useMemo(() => {
    return [...results]
      .sort((a, b) => b.distance_km - a.distance_km)
      .slice(0, 5);
  }, [results]);

  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(45,212,191,0.18)] bg-[#0a1f24] shadow-xl">
      <div className="flex h-11 items-center justify-between border-b border-[rgba(45,212,191,0.12)] px-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2dd4bf]">
            Mobile Clinic Route (Dispatch Sequence)
          </span>
        </div>
        <span className="rounded border border-amber-400/25 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300">
          HEURISTIC
        </span>
      </div>

      <div className="p-4">
        {route.length === 0 ? (
          <p className="text-xs text-[#64748b]">
            No underserved destinations recorded for this regional filter.
          </p>
        ) : (
          <ol className="space-y-2">
            {route.map((stop, idx) => (
              <li
                key={stop.settlement_id}
                onClick={() => onSelectSettlement?.(stop)}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-[rgba(45,212,191,0.12)] bg-[#06161a]/70 p-2.5 transition hover:border-[#2dd4bf]/40 hover:bg-[#0e2a30]"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/15 text-[10px] font-bold text-amber-300">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-white">
                    {stop.settlement_name}
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">
                    {stop.country} · {stop.distance_km.toFixed(1)} km to{" "}
                    {stop.nearest_facility}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-[10px] font-semibold text-[#2dd4bf] transition hover:text-[#5eead4]"
                >
                  Locate →
                </button>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-3 rounded-md border border-[rgba(45,212,191,0.1)] bg-[#0e2a30]/40 p-2 text-[10px] text-[#94a3b8]">
          <span className="font-semibold text-amber-300">Note:</span> Illustrative priority dispatch sequencing sorted by distance from primary hospital hubs. Real-world route planning incorporates road network topography.
        </div>
      </div>
    </div>
  );
}