"use client";

import { useEffect, useRef, useState } from "react";

const PROVENANCE_BREAKDOWN = [
  {
    field: "Facility names & coordinates",
    status: "real" as const,
    note: "Publicly verified Gulf healthcare facilities (ministry listings, hospital directories). Coordinate centroids approximated.",
  },
  {
    field: "Facility capacity & specialties",
    status: "synthetic" as const,
    note: "Illustrative operational metrics — not verified live bed counts or active physician rosters.",
  },
  {
    field: "Settlement population & travel times",
    status: "synthetic" as const,
    note: "Illustrative demographic placeholders demonstrating isochrone and catchment gap algorithms.",
  },
];

export default function DataStatusBadge() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-amber-300 transition hover:bg-amber-400/20 focus:outline-none focus:ring-1 focus:ring-amber-400"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        <span className="text-[10px] font-bold tracking-wider">PROVENANCE: MIXED</span>
        <span className="text-[8px] opacity-75">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-[1500] mt-1.5 w-80 overflow-hidden rounded-xl border border-[rgba(45,212,191,0.25)] bg-[#0a1f24] shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[rgba(45,212,191,0.15)] bg-[#06161a] px-3.5 py-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2dd4bf]">
              Data Provenance & Verification
            </span>
            <span className="text-[9px] text-[#64748b]">POC Transparency</span>
          </div>

          <div className="divide-y divide-[rgba(45,212,191,0.08)]">
            {PROVENANCE_BREAKDOWN.map((item) => (
              <div key={item.field} className="px-3.5 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white">
                    {item.field}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                      item.status === "real"
                        ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                        : "border border-amber-400/30 bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {item.status === "real" ? "Verified Reference" : "Synthetic Model"}
                  </span>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-[#94a3b8]">
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[rgba(45,212,191,0.15)] bg-[#06161a]/70 px-3.5 py-2 text-[9px] text-[#64748b]">
            Per Section 9 guidelines, synthetic demonstration values are clearly disclosed and separated from API calculations.
          </div>
        </div>
      )}
    </div>
  );
}