"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AccessibilityPanel from "@/components/AccessibilityPanel";

const HealthcareMap = dynamic(
  () => import("@/components/HealthcareMap"),
  {
    ssr: false,
  }
);

type AccessibilityResult = {
  settlement_id: number;
  settlement_name: string;
  country: string;
  population: number;
  nearest_facility: string;
  distance_km: number;
  accessibility_status: string;
};

type AnalysisResponse = {
  total_settlements: number;
  total_facilities: number;
  underserved_count: number;
  underserved_areas: AccessibilityResult[];
  all_results: AccessibilityResult[];
};

type Country = "All" | "Oman" | "Saudi Arabia";

export default function Home() {
  const [analysisData, setAnalysisData] =
    useState<AnalysisResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [selectedCountry, setSelectedCountry] =
    useState<Country>("All");

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/analysis/underserved-areas"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analysis");
        }

        const data = await response.json();

        setAnalysisData(data);
      } catch (error) {
        console.error(
          "Failed to fetch healthcare analysis:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, []);

  const filteredResults =
    analysisData?.all_results.filter(
      (result) =>
        selectedCountry === "All" ||
        result.country === selectedCountry
    ) ?? [];

  const filteredUnderserved = filteredResults.filter(
    (result) =>
      result.accessibility_status === "Underserved"
  );

  const totalPopulation = filteredResults.reduce(
    (total, result) => total + result.population,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Health Equity
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Rural & Remote Healthcare Access Gap Mapper
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            Mapping healthcare accessibility gaps across rural
            and remote populations in Oman and Saudi Arabia.
          </p>
        </div>

        {/* Country Filter */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Geographic Filter
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a country to analyze healthcare
              accessibility.
            </p>
          </div>

          <select
            value={selectedCountry}
            onChange={(event) =>
              setSelectedCountry(
                event.target.value as Country
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="All">All Countries</option>
            <option value="Oman">Oman</option>
            <option value="Saudi Arabia">
              Saudi Arabia
            </option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">
              Loading healthcare accessibility analysis...
            </p>
          </div>
        )}

        {/* Main Dashboard */}
        {!loading && analysisData && (
          <>
            {/* Statistics */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Settlements */}
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Total Settlements
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {filteredResults.length}
                </p>
              </div>

              {/* Underserved Areas */}
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Underserved Areas
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {filteredUnderserved.length}
                </p>
              </div>

              {/* Population */}
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Population Covered
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalPopulation.toLocaleString()}
                </p>
              </div>

              {/* Analysis Status */}
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Accessibility Analysis
                </p>

                <p className="mt-2 text-lg font-semibold text-green-600">
                  Active
                </p>
              </div>
            </div>

            {/* Healthcare Map */}
            <HealthcareMap
              analysisResults={filteredResults}
              selectedCountry={selectedCountry}
            />

            {/* Underserved Areas Panel */}
            <div className="mt-6">
              <AccessibilityPanel
                results={filteredResults}
              />
            </div>
          </>
        )}

        {/* Error */}
        {!loading && !analysisData && (
          <div className="rounded-xl bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              Unable to load healthcare analysis.
            </p>

            <p className="mt-1 text-sm text-red-600">
              Make sure the FastAPI backend is running.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}