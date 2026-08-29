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
  selectedSettlement: AccessibilityResult | null;
  results: AccessibilityResult[];
  totalFacilities: number;
};

function getPriority(
  distance: number,
  population: number
) {
  const distanceScore = Math.min(
    distance / 500,
    1
  );

  const populationScore = Math.min(
    population / 60000,
    1
  );

  const score = Math.round(
    (distanceScore * 0.6 +
      populationScore * 0.4) *
      100
  );

  if (score >= 70) {
    return {
      score,
      label: "CRITICAL",
      className:
        "border-red-400/20 bg-red-400/10 text-red-300",
    };
  }

  if (score >= 45) {
    return {
      score,
      label: "HIGH",
      className:
        "border-orange-400/20 bg-orange-400/10 text-orange-300",
    };
  }

  if (score >= 25) {
    return {
      score,
      label: "MODERATE",
      className:
        "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    };
  }

  return {
    score,
    label: "LOW",
    className:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  };
}

export default function IntelligenceSidebar({
  selectedSettlement,
  results,
  totalFacilities,
}: Props) {
  const underserved = results.filter(
    (result) =>
      result.accessibility_status === "Underserved"
  );

  const totalPopulation = results.reduce(
    (sum, result) => sum + result.population,
    0
  );

  const underservedPopulation =
    underserved.reduce(
      (sum, result) => sum + result.population,
      0
    );

  const highestPriority =
    underserved.length > 0
      ? [...underserved].sort(
          (a, b) =>
            getPriority(
              b.distance_km,
              b.population
            ).score -
            getPriority(
              a.distance_km,
              a.population
            ).score
        )[0]
      : null;

  const priority = selectedSettlement
    ? getPriority(
        selectedSettlement.distance_km,
        selectedSettlement.population
      )
    : null;

  return (
    <aside className="min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-[#07101b]">
      {/* SIDEBAR HEADER */}
      <div className="flex h-11 items-center justify-between border-b border-slate-800 px-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.7)]" />

          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
            INTELLIGENCE
          </span>
        </div>

        <span className="text-[9px] text-emerald-400">
          ● LIVE
        </span>
      </div>

      <div className="h-[calc(100%-44px)] overflow-y-auto">
        {/* SELECTED LOCATION */}
        <section className="border-b border-slate-800 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
              SELECTED AREA
            </span>

            {selectedSettlement && (
              <span className="text-[9px] text-cyan-400">
                MAP LINKED
              </span>
            )}
          </div>

          {selectedSettlement ? (
            <>
              <h2 className="text-xl font-bold text-white">
                {selectedSettlement.settlement_name}
              </h2>

              <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                {selectedSettlement.country}
              </p>

              {/* ACCESS STATUS */}
              <div className="mt-4 rounded-lg border border-red-400/20 bg-red-400/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    ACCESS STATUS
                  </span>

                  <span className="text-[10px] font-bold text-red-300">
                    {selectedSettlement.accessibility_status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${Math.min(
                        selectedSettlement.distance_km /
                          8,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* METRICS */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-slate-800 bg-black/10 p-3">
                  <p className="text-[9px] uppercase tracking-wide text-slate-600">
                    Population
                  </p>

                  <p className="mt-1 text-lg font-bold text-white">
                    {selectedSettlement.population.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-black/10 p-3">
                  <p className="text-[9px] uppercase tracking-wide text-slate-600">
                    Distance
                  </p>

                  <p className="mt-1 text-lg font-bold text-red-300">
                    {selectedSettlement.distance_km}
                    <span className="ml-1 text-[9px] font-normal">
                      km
                    </span>
                  </p>
                </div>

                <div className="col-span-2 rounded-lg border border-slate-800 bg-black/10 p-3">
                  <p className="text-[9px] uppercase tracking-wide text-slate-600">
                    Nearest Healthcare Facility
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    {selectedSettlement.nearest_facility}
                  </p>
                </div>
              </div>

              {/* PRIORITY */}
              {priority && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-800 bg-black/10 p-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-wide text-slate-600">
                      Intervention Priority
                    </p>

                    <p className="mt-1 text-xs font-bold text-white">
                      {priority.label}
                    </p>
                  </div>

                  <div
                    className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${priority.className}`}
                  >
                    {priority.score}/100
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-800 p-5 text-center">
              <p className="text-xs text-slate-500">
                Click a settlement on the map to inspect
                its healthcare accessibility profile.
              </p>
            </div>
          )}
        </section>

        {/* NETWORK SNAPSHOT */}
        <section className="border-b border-slate-800 p-4">
          <div className="mb-3 text-[9px] font-bold uppercase tracking-widest text-slate-600">
            HEALTHCARE NETWORK
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-cyan-400/5 p-3">
              <p className="text-[9px] text-slate-600">
                Facilities
              </p>

              <p className="mt-1 text-xl font-bold text-cyan-300">
                {totalFacilities}
              </p>
            </div>

            <div className="rounded-lg bg-red-400/5 p-3">
              <p className="text-[9px] text-slate-600">
                Underserved
              </p>

              <p className="mt-1 text-xl font-bold text-red-300">
                {underserved.length}
              </p>
            </div>
          </div>
        </section>

        {/* WHO / WHAT CONTROLS ACCESS */}
        <section className="border-b border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">◈</span>

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              WHO CONTROLS ACCESS?
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="rounded-lg border border-slate-800 bg-black/10 p-3">
              <p className="text-[9px] text-slate-600">
                PRIMARY ACCESS DRIVER
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-200">
                Healthcare facility proximity
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-black/10 p-3">
              <p className="text-[9px] text-slate-600">
                IDENTIFIED GAP
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-200">
                Long-distance access for remote settlements
              </p>
            </div>
          </div>
        </section>

        {/* DECISIONS */}
        <section className="border-b border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <span className="text-violet-400">ϟ</span>

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              DECISIONS TO MAKE
            </span>
          </div>

          <div className="mt-3 space-y-3">
            <div className="flex gap-2">
              <span className="mt-1 text-cyan-400">
                •
              </span>

              <p className="text-[10px] leading-4 text-slate-400">
                Prioritize settlements with the largest
                distance-to-facility gaps.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="mt-1 text-cyan-400">
                •
              </span>

              <p className="text-[10px] leading-4 text-slate-400">
                Consider mobile healthcare services for
                highly remote populations.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="mt-1 text-cyan-400">
                •
              </span>

              <p className="text-[10px] leading-4 text-slate-400">
                Expand local healthcare capacity where
                population impact is high.
              </p>
            </div>
          </div>
        </section>

        {/* DATA SIGNAL */}
        <section className="p-4">
          <div className="mb-3 text-[9px] font-bold uppercase tracking-widest text-slate-600">
            DATA SIGNAL
          </div>

          <div className="rounded-lg border border-slate-800 bg-black/10 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-500">
                Analyzed Population
              </span>

              <span className="text-xs font-bold text-cyan-300">
                {totalPopulation.toLocaleString()}
              </span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{
                  width:
                    totalPopulation > 0
                      ? `${Math.min(
                          (underservedPopulation /
                            totalPopulation) *
                            100,
                          100
                        )}%`
                      : "0%",
                }}
              />
            </div>

            <p className="mt-2 text-[9px] leading-4 text-slate-600">
              The highlighted signal represents the
              proportion of the analyzed population
              living in underserved settlements.
            </p>
          </div>

          {highestPriority && (
            <div className="mt-3 rounded-lg border border-red-400/20 bg-red-400/5 p-3">
              <p className="text-[9px] uppercase tracking-wide text-red-400">
                Highest Priority Signal
              </p>

              <p className="mt-1 text-xs font-bold text-white">
                {highestPriority.settlement_name}
              </p>

              <p className="mt-1 text-[9px] leading-4 text-slate-500">
                {highestPriority.distance_km} km from nearest
                facility ·{" "}
                {highestPriority.population.toLocaleString()}{" "}
                people affected
              </p>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}