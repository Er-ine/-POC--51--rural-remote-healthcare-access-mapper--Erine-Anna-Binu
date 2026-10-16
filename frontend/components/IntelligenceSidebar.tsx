"use client";

import { useEffect, useRef } from "react";

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
  isOpen: boolean;
  onClose: () => void;
  selectedSettlement: AccessibilityResult | null;
  results: AccessibilityResult[];
  totalFacilities: number;
  onSelectSettlement?: (settlement: AccessibilityResult) => void;
};

function getPriority(distance: number, population: number) {
  const distanceScore = Math.min(distance / 500, 1);
  const populationScore = Math.min(population / 60000, 1);
  const score = Math.round((distanceScore * 0.6 + populationScore * 0.4) * 100);

  if (score >= 70) {
    return {
      score,
      label: "CRITICAL",
      className: "border-red-400/30 bg-red-500/10 text-red-300",
    };
  }

  if (score >= 45) {
    return {
      score,
      label: "HIGH",
      className: "border-amber-400/30 bg-amber-500/10 text-amber-300",
    };
  }

  if (score >= 25) {
    return {
      score,
      label: "MODERATE",
      className: "border-yellow-400/30 bg-yellow-500/10 text-yellow-300",
    };
  }

  return {
    score,
    label: "LOW",
    className: "border-[#2dd4bf]/30 bg-[#2dd4bf]/10 text-[#2dd4bf]",
  };
}

export default function IntelligenceSidebar({
  isOpen,
  onClose,
  selectedSettlement,
  results,
  totalFacilities,
  onSelectSettlement,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const underserved = results.filter(
    (result) => result.accessibility_status === "Underserved"
  );

  const totalPopulation = results.reduce(
    (sum, result) => sum + result.population,
    0
  );

  const underservedPopulation = underserved.reduce(
    (sum, result) => sum + result.population,
    0
  );

  const highestPriority =
    underserved.length > 0
      ? [...underserved].sort(
          (a, b) =>
            getPriority(b.distance_km, b.population).score -
            getPriority(a.distance_km, a.population).score
        )[0]
      : null;

  const priority = selectedSettlement
    ? getPriority(
        selectedSettlement.distance_km,
        selectedSettlement.population
      )
    : null;

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1150] bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-over Container */}
      <aside
        role="complementary"
        aria-label="Settlement Healthcare Intelligence"
        className={`fixed top-14 right-0 bottom-0 z-[1200] flex w-full flex-col border-l border-[rgba(45,212,191,0.2)] bg-[#0a1f24] shadow-2xl transition-transform duration-300 ease-out sm:w-[420px] lg:w-[440px] ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* PANEL HEADER */}
        <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-[rgba(45,212,191,0.15)] bg-[#06161a]/90 px-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.7)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2dd4bf]">
              Geospatial Intelligence Panel
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-400">
              ● ACTIVE
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close intelligence panel"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(45,212,191,0.2)] bg-[#0e2a30] text-[#94a3b8] transition hover:bg-[#133840] hover:text-[#2dd4bf] focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto">
          {/* SELECTED LOCATION */}
          <section className="border-b border-[rgba(45,212,191,0.12)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#64748b]">
                SELECTED SETTLEMENT
              </span>

              {selectedSettlement && (
                <span className="flex items-center gap-1 text-[9px] font-semibold text-[#2dd4bf]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf]" />
                  MAP SYNCHRONIZED
                </span>
              )}
            </div>

            {selectedSettlement ? (
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {selectedSettlement.settlement_name}
                </h2>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                    {selectedSettlement.country}
                  </span>
                  <span className="text-[#64748b]">·</span>
                  <span className="text-[10px] text-[#64748b]">
                    Settlement #{selectedSettlement.settlement_id}
                  </span>
                </div>

                {/* ACCESS STATUS */}
                <div
                  className={`mt-4 rounded-lg border p-3 ${
                    selectedSettlement.accessibility_status === "Underserved"
                      ? "border-red-500/30 bg-red-500/10"
                      : selectedSettlement.accessibility_status === "Moderate Access"
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-[#2dd4bf]/30 bg-[#2dd4bf]/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8]">
                      ACCESS STATUS
                    </span>

                    <span
                      className={`text-[10px] font-bold ${
                        selectedSettlement.accessibility_status === "Underserved"
                          ? "text-red-300"
                          : selectedSettlement.accessibility_status === "Moderate Access"
                            ? "text-amber-300"
                            : "text-[#2dd4bf]"
                      }`}
                    >
                      {selectedSettlement.accessibility_status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#06161a]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedSettlement.accessibility_status === "Underserved"
                          ? "bg-red-400"
                          : selectedSettlement.accessibility_status === "Moderate Access"
                            ? "bg-amber-400"
                            : "bg-[#2dd4bf]"
                      }`}
                      style={{
                        width: `${Math.min(
                          (selectedSettlement.distance_km / 70) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* METRICS */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-[rgba(45,212,191,0.12)] bg-[#06161a]/60 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] uppercase tracking-wide text-[#64748b]">
                        Population
                      </p>
                      <span className="text-[8px] text-[#64748b]">Synthetic</span>
                    </div>

                    <p className="mt-1 text-lg font-bold text-white">
                      {selectedSettlement.population.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[rgba(45,212,191,0.12)] bg-[#06161a]/60 p-3">
                    <p className="text-[9px] uppercase tracking-wide text-[#64748b]">
                      Distance to Care
                    </p>

                    <p className="mt-1 text-lg font-bold text-red-300">
                      {selectedSettlement.distance_km}
                      <span className="ml-1 text-[9px] font-normal text-[#94a3b8]">
                        km
                      </span>
                    </p>
                  </div>

                  <div className="col-span-2 rounded-lg border border-[rgba(45,212,191,0.12)] bg-[#06161a]/60 p-3">
                    <p className="text-[9px] uppercase tracking-wide text-[#64748b]">
                      Nearest Primary Facility
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#f0fdfa]">
                      {selectedSettlement.nearest_facility}
                    </p>
                  </div>
                </div>

                {/* PRIORITY SCORE */}
                {priority && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-[rgba(45,212,191,0.12)] bg-[#06161a]/60 p-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-wide text-[#64748b]">
                        Intervention Priority
                      </p>

                      <p className="mt-0.5 text-xs font-bold text-white">
                        {priority.label} SEVERITY
                      </p>
                    </div>

                    <div
                      className={`rounded-md border px-2.5 py-1 text-[10px] font-bold ${priority.className}`}
                    >
                      Score: {priority.score} / 100
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[rgba(45,212,191,0.2)] bg-[#06161a]/40 p-5 text-center">
                <p className="text-xs text-[#94a3b8]">
                  Select any settlement on the interactive map to inspect its detailed accessibility profile and travel metrics.
                </p>

                {highestPriority && onSelectSettlement && (
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-wider text-[#64748b]">
                      Or inspect highest priority area:
                    </p>
                    <button
                      type="button"
                      onClick={() => onSelectSettlement(highestPriority)}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[rgba(45,212,191,0.3)] bg-[#0e2a30] px-3 py-1.5 text-xs font-semibold text-[#2dd4bf] transition hover:bg-[#133840]"
                    >
                      <span>Focus {highestPriority.settlement_name}</span>
                      <span className="text-[10px]">({highestPriority.distance_km} km) →</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* NETWORK SNAPSHOT */}
          <section className="border-b border-[rgba(45,212,191,0.12)] p-4">
            <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#64748b]">
              HEALTHCARE NETWORK OVERVIEW
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-[rgba(45,212,191,0.15)] bg-[#0e2a30]/50 p-3">
                <p className="text-[9px] text-[#94a3b8]">Active Facilities</p>
                <p className="mt-1 text-xl font-bold text-[#2dd4bf]">
                  {totalFacilities}
                </p>
              </div>

              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-[9px] text-[#94a3b8]">Underserved Localities</p>
                <p className="mt-1 text-xl font-bold text-red-300">
                  {underserved.length}
                </p>
              </div>
            </div>
          </section>

          {/* ACCESS DRIVERS */}
          <section className="border-b border-[rgba(45,212,191,0.12)] p-4">
            <div className="flex items-center gap-2">
              <span className="text-[#2dd4bf]">◈</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f0fdfa]">
                Healthcare Access Drivers
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-lg border border-[rgba(45,212,191,0.12)] bg-[#06161a]/60 p-3">
                <p className="text-[9px] text-[#64748b]">PRIMARY ACCESS DRIVER</p>
                <p className="mt-1 text-xs font-semibold text-[#f0fdfa]">
                  Facility catchment perimeter and travel corridor density
                </p>
              </div>

              <div className="rounded-lg border border-[rgba(45,212,191,0.12)] bg-[#06161a]/60 p-3">
                <p className="text-[9px] text-[#64748b]">IDENTIFIED BOTTLENECK</p>
                <p className="mt-1 text-xs font-semibold text-amber-200">
                  Critical travel times (&gt;60 min) for outlying desert and remote settlements
                </p>
              </div>
            </div>
          </section>

          {/* DECISION SUPPORT */}
          <section className="border-b border-[rgba(45,212,191,0.12)] p-4">
            <div className="flex items-center gap-2">
              <span className="text-[#2dd4bf]">ϟ</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f0fdfa]">
                Decision Support Recommendations
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs text-[#94a3b8]">
              <div className="flex gap-2">
                <span className="mt-0.5 text-[#2dd4bf]">•</span>
                <p className="text-[11px] leading-relaxed">
                  Target mobile health unit deployments to settlements exceeding 40 km from the nearest hospital hub.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="mt-0.5 text-[#2dd4bf]">•</span>
                <p className="text-[11px] leading-relaxed">
                  Establish telemedicine teleconsultation links at primary health posts to triage emergency transfers.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="mt-0.5 text-[#2dd4bf]">•</span>
                <p className="text-[11px] leading-relaxed">
                  Incentivize rural medical personnel retention in high-population underserved clusters.
                </p>
              </div>
            </div>
          </section>

          {/* DATA SIGNAL */}
          <section className="p-4">
            <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#64748b]">
              POPULATION GAP SIGNAL
            </div>

            <div className="rounded-lg border border-[rgba(45,212,191,0.12)] bg-[#06161a]/60 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#94a3b8]">Analyzed Population</span>
                <span className="text-xs font-bold text-[#2dd4bf]">
                  {totalPopulation.toLocaleString()}
                </span>
              </div>

              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#0e2a30]">
                <div
                  className="h-full rounded-full bg-[#2dd4bf]"
                  style={{
                    width:
                      totalPopulation > 0
                        ? `${Math.min(
                            (underservedPopulation / totalPopulation) * 100,
                            100
                          )}%`
                        : "0%",
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] leading-relaxed text-[#64748b]">
                {totalPopulation > 0
                  ? `${Math.round(
                      (underservedPopulation / totalPopulation) * 100
                    )}% of the analyzed regional population resides in settlements classified as underserved.`
                  : "Awaiting population data stream."}
              </p>
            </div>

            {highestPriority && (
              <div className="mt-3 rounded-lg border border-red-500/25 bg-red-500/5 p-3">
                <p className="text-[9px] font-bold uppercase tracking-wide text-red-400">
                  Highest Regional Priority
                </p>
                <p className="mt-1 text-xs font-bold text-white">
                  {highestPriority.settlement_name} ({highestPriority.country})
                </p>
                <p className="mt-0.5 text-[10px] text-[#94a3b8]">
                  {highestPriority.distance_km} km to {highestPriority.nearest_facility} ·{" "}
                  {highestPriority.population.toLocaleString()} residents
                </p>
              </div>
            )}
          </section>
        </div>
      </aside>
    </>
  );
}