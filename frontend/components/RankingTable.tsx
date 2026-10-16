"use client";

import { useMemo, useState } from "react";

export type AccessibilityResult = {
  settlement_id: number;
  settlement_name: string;
  country: string;
  population: number;
  nearest_facility: string;
  distance_km: number;
  accessibility_status: string;
};

type SortKey = "settlement_name" | "country" | "population" | "distance_km";
type SortDir = "asc" | "desc";

type Props = {
  results: AccessibilityResult[];
  onSelectSettlement?: (settlement: AccessibilityResult) => void;
  selectedSettlementId?: number | null;
};

export default function RankingTable({
  results,
  onSelectSettlement,
  selectedSettlementId,
}: Props) {
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
    { key: "settlement_name", label: "Settlement / District" },
    { key: "country", label: "Country" },
    { key: "population", label: "Population (Synthetic)" },
    { key: "distance_km", label: "Distance to Facility" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(45,212,191,0.18)] bg-[#0a1f24] shadow-xl">
      <div className="flex h-11 items-center justify-between border-b border-[rgba(45,212,191,0.12)] px-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.7)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2dd4bf]">
            Underserved Settlement Rankings
          </span>
        </div>
        <span className="text-[10px] text-[#94a3b8]">
          {sorted.length} localities classified &gt; 15 km
        </span>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 z-10 border-b border-[rgba(45,212,191,0.15)] bg-[#0e2a30] text-[10px] uppercase tracking-wider text-[#94a3b8]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer select-none px-4 py-2.5 transition hover:text-[#2dd4bf]"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-[#2dd4bf]">
                        {sortDir === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              <th className="px-4 py-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(45,212,191,0.08)]">
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-8 text-center text-xs text-[#64748b]"
                >
                  No underserved settlements recorded for the active filter.
                </td>
              </tr>
            )}
            {sorted.map((r) => {
              const isSelected = selectedSettlementId === r.settlement_id;
              return (
                <tr
                  key={r.settlement_id}
                  onClick={() => onSelectSettlement?.(r)}
                  className={`cursor-pointer transition hover:bg-[#0e2a30]/60 ${
                    isSelected
                      ? "bg-[rgba(45,212,191,0.1)] text-white"
                      : "text-[#94a3b8]"
                  }`}
                >
                  <td className="px-4 py-2.5 font-medium text-white">
                    {r.settlement_name}
                  </td>
                  <td className="px-4 py-2.5 text-[#94a3b8]">{r.country}</td>
                  <td className="px-4 py-2.5 text-[#94a3b8]">
                    {r.population.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-red-400">
                    {r.distance_km.toFixed(1)} km
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSettlement?.(r);
                      }}
                      className="rounded border border-[rgba(45,212,191,0.25)] bg-[#0e2a30] px-2 py-0.5 text-[10px] font-semibold text-[#2dd4bf] transition hover:bg-[#133840]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}