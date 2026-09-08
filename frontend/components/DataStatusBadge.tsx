"use client";

import { useEffect, useRef, useState } from "react";

const PROVENANCE_BREAKDOWN = [
  {
    field: "Facility names & locations",
    status: "real" as const,
    note: "Based on real, publicly known Gulf hospitals (public directories, ministry listings). Coordinates are city-level approximations.",
  },
  {
    field: "Facility capacity & specialties",
    status: "synthetic" as const,
    note: "Illustrative values — not verified bed counts or specialty rosters.",
  },
  {
    field: "Settlement population & travel time",
    status: "synthetic" as const,
    note: "Illustrative placeholders standing in for census and isochrone-model data.",
  },
];

export default function DataStatusBadge() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const allSynthetic = PROVENANCE_BREAKDOWN.every(
    (item) => item.status === "synthetic"
  );
  const allReal = PROVENANCE_BREAKDOWN.every(
    (item) => item.status === "real"
  );
  const isMixed = !allSynthetic && !allReal;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const badgeColor = isMixed
    ? "border-amber-400/20 bg-amber-400/5 text-amber-300"
    : allReal
      ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
      : "border-amber-400/20 bg-amber-400/5 text-amber-300";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition ${badgeColor}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="text-[10px] font-semibold">
          {isMixed ? "MIXED DATA" : allReal ? "REAL DATA" : "SYNTHETIC DATA"}
        </span>
        <span className="text-[8px] opacity-70">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 z-[1100] mt-1 w-72 overflow-hidden rounded-lg border border-slate-700 bg-[#0b1120] shadow-xl">
          <div className="border-b border-slate-800 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Data Provenance
          </div>

          <div className="divide-y divide-slate-800/60">
            {PROVENANCE_BREAKDOWN.map((item) => (
              <div key={item.field} className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-200">
                    {item.field}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      item.status === "real"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {item.status === "real" ? "REAL-BASED" : "SYNTHETIC"}
                  </span>
                </div>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}