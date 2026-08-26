"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const HealthcareMap = dynamic(
  () => import("@/components/HealthcareMap"),
  {
    ssr: false,
  }
);

type AccessibilityResult = {
  settlement_id: number;
  settlement_name: string;
  nearest_facility: string;
  distance_km: number;
  accessibility_status: string;
};

type AnalysisResponse = {
  total_settlements: number;
  underserved_areas: AccessibilityResult[];
  all_results: AccessibilityResult[];
};

export default function Home() {
  const [analysisData, setAnalysisData] =
    useState<AnalysisResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/analysis/underserved-areas"
        );

        const data = await response.json();

        setAnalysisData(data);
      } catch (error) {
        console.error("Failed to fetch analysis:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Health Equity
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Rural & Remote Healthcare Access Gap Mapper
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            Mapping healthcare accessibility gaps across rural and remote
            populations in Oman and Saudi Arabia.
          </p>
        </div>

        {loading && (
          <p className="text-slate-500">
            Loading healthcare accessibility analysis...
          </p>
        )}

        {!loading && analysisData && (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Total Settlements
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {analysisData.total_settlements}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Underserved Areas
                </p>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {analysisData.underserved_areas.length}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Accessibility Analysis
                </p>
                <p className="mt-2 text-lg font-semibold text-green-600">
                  Active
                </p>
              </div>
            </div>

            <HealthcareMap />
          </>
        )}

        {!loading && !analysisData && (
          <p className="text-red-500">
            Unable to load healthcare analysis.
          </p>
        )}
      </div>
    </main>
  );
}