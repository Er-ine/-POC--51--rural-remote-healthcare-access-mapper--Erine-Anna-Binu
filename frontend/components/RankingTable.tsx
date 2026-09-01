"use client";

import { useMemo, useState } from "react";
import type { AccessibilityResult } from "@/app/page";

type SortKey = "settlement_name" | "country" | "population" | "distance_km";
type SortDir = "asc" | "desc";

export default function RankingTable({
  results,
}: {
  results: AccessibilityResult[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("distance_km");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...results];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [results, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "settlement_name", label: "District" },
    { key: "country", label: "Country" },
    { key: "population", label: "Population" },
    { key: "distance_km", label: "Distance (km)" },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#07101b]">
      <div className="flex h-11 items-center border-b border-slate-800 px-4">
        <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.7)]" />
        <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
          Underserved District Ranking
        </span>
      </div>

      <div className="max-h-[320px] overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-[#0b1120] text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer select-none px-4 py-2 hover:text-cyan-300"
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-slate-600"
                >
                  No underserved districts for this filter.
                </td>
              </tr>
            )}
            {sorted.map((r) => (
              <tr
                key={r.settlement_id}
                className="border-t border-slate-800/60 text-slate-300 hover:bg-slate-800/30"
              >
                <td className="px-4 py-2 font-medium text-slate-200">
                  {r.settlement_name}
                </td>
                <td className="px-4 py-2">{r.country}</td>
                <td className="px-4 py-2">
                  {r.population.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-red-300">
                  {r.distance_km.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}