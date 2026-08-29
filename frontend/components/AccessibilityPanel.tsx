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

type AccessibilityPanelProps = {
  results: AccessibilityResult[];
};

export default function AccessibilityPanel({
  results,
}: AccessibilityPanelProps) {
  const underservedAreas = results.filter(
    (result) => result.accessibility_status === "Underserved"
  );

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Underserved Areas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Communities with limited access to nearby healthcare
            facilities.
          </p>
        </div>

        <div className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
          {underservedAreas.length} Areas
        </div>
      </div>

      {/* Empty state */}
      {underservedAreas.length === 0 && (
        <div className="rounded-lg bg-green-50 p-5 text-center">
          <p className="font-semibold text-green-700">
            No underserved areas found.
          </p>

          <p className="mt-1 text-sm text-green-600">
            All settlements currently have acceptable healthcare
            accessibility.
          </p>
        </div>
      )}

      {/* Underserved areas */}
      <div className="space-y-4">
        {underservedAreas.map((area) => (
          <div
            key={area.settlement_id}
            className="rounded-xl border border-red-100 bg-red-50/40 p-5"
          >
            {/* Settlement header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-red-600" />

                <div>
                  <h3 className="font-bold text-slate-900">
                    {area.settlement_name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {area.country}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Underserved
              </span>
            </div>

            {/* Information */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {/* Population */}
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-slate-500">
                  Population
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {area.population.toLocaleString()}
                </p>
              </div>

              {/* Nearest facility */}
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-slate-500">
                  Nearest Facility
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {area.nearest_facility}
                </p>
              </div>

              {/* Distance */}
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-slate-500">
                  Distance
                </p>

                <p className="mt-1 font-semibold text-red-600">
                  {area.distance_km} km
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}