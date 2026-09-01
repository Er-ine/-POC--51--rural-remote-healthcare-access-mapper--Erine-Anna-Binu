"use client";

import { useMemo } from "react";
import type { AccessibilityResult } from "@/app/page";

// NOTE: This is a simple greedy heuristic (farthest-first ordering),
// not a real routing/VRP solver — flagged as descoped-to-heuristic in
// VAR_REPORT.md. Good enough to demonstrate the concept for a POC.
export default function MobileClinicPanel({
  results,
}: {
  results: AccessibilityResult[];
}) {
  const route = useMemo(() => {
    return [...results]
      .sort((a, b) => b.distance_km - a.distance_km)
      .slice(0, 5);
  }, [results]);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#07101b]">
      <div className="flex h-11 items-center border-b border-slate-800 px-4">
        <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
        <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
          Mobile Clinic Route (Suggested)
        </span>
      </div>

      <div className="p-4">
        {route.length === 0 ? (
          <p className="text-xs text-slate-600">
            No underserved stops to route for this filter.
          </p>
        ) : (
          <ol className="space-y-2">
            {route.map((stop, idx) => (
              <li
                key={stop.settlement_id}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[#0b1120] px-3 py-2"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-300">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-slate-200">
                    {stop.settlement_name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {stop.country} · {stop.distance_km.toFixed(1)} km to
                    nearest facility
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-3 text-[9px] italic text-slate-600">
          Illustrative ordering by distance from nearest facility — not a
          production routing engine.
        </p>
      </div>
    </section>
  );
}