"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import IntelligenceSidebar from "@/components/IntelligenceSidebar";
import AnalyticsStrip from "@/components/AnalyticsStrip";

const HealthcareMap = dynamic(
  () => import("@/components/HealthcareMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[560px] items-center justify-center bg-[#030712]">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
          <p className="text-xs text-slate-500">
            Loading healthcare intelligence map...
          </p>
        </div>
      </div>
    ),
  }
);

export type AccessibilityResult = {
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

  const [selectedCountry, setSelectedCountry] =
    useState<Country>("All");

  const [selectedSettlement, setSelectedSettlement] =
    useState<AccessibilityResult | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAnalysis() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/analysis/underserved-areas",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Analysis request failed");
        }

        const data: AnalysisResponse = await response.json();

        if (!cancelled) {
          setAnalysisData(data);

          if (data.all_results.length > 0) {
            setSelectedSettlement(data.all_results[0]);
          }
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchAnalysis();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredResults = useMemo(() => {
    if (!analysisData) return [];

    if (selectedCountry === "All") {
      return analysisData.all_results;
    }

    return analysisData.all_results.filter(
      (result) => result.country === selectedCountry
    );
  }, [analysisData, selectedCountry]);

  const filteredUnderserved = useMemo(() => {
    return filteredResults.filter(
      (result) =>
        result.accessibility_status === "Underserved"
    );
  }, [filteredResults]);

  const totalPopulation = useMemo(() => {
    return filteredResults.reduce(
      (sum, result) => sum + result.population,
      0
    );
  }, [filteredResults]);

  const averageDistance = useMemo(() => {
    if (!filteredResults.length) return 0;

    return (
      filteredResults.reduce(
        (sum, result) => sum + result.distance_km,
        0
      ) / filteredResults.length
    );
  }, [filteredResults]);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);

    const firstMatch =
      analysisData?.all_results.find(
        (result) =>
          country === "All" ||
          result.country === country
      );

    setSelectedSettlement(firstMatch ?? null);
  };

  const handleSettlementSelect = (
    settlement: AccessibilityResult
  ) => {
    setSelectedSettlement(settlement);
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#030712]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10">
              <span className="text-sm text-cyan-300">✚</span>
            </div>

            <div>
              <div className="text-xs font-bold tracking-wide text-slate-100">
                HEALTH EQUITY INTELLIGENCE
              </div>

              <div className="hidden text-[10px] text-slate-500 sm:block">
                Rural & Remote Healthcare Access Gap Mapper
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-[10px] uppercase tracking-widest text-slate-600 md:block">
              LIVE DATA FEED
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[10px] font-semibold text-emerald-300">
                ANALYSIS ONLINE
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-5 lg:px-6">
        {/* TITLE / CONTROL ROW */}
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
              GEOSPATIAL HEALTH INTELLIGENCE
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Rural & Remote Healthcare Access Gap Mapper
            </h1>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
              Identify healthcare accessibility gaps, affected
              populations and priority intervention areas across
              Oman and Saudi Arabia.
            </p>
          </div>

          {/* FILTER */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              COUNTRY
            </span>

            <select
              value={selectedCountry}
              onChange={(event) =>
                handleCountryChange(
                  event.target.value as Country
                )
              }
              className="rounded-lg border border-slate-700 bg-[#0b1120] px-4 py-2 text-xs font-semibold text-slate-200 outline-none transition focus:border-cyan-400"
            >
              <option value="All">All Countries</option>
              <option value="Oman">Oman</option>
              <option value="Saudi Arabia">
                Saudi Arabia
              </option>
            </select>
          </div>
        </div>

        {/* MAIN 70 / 30 GRID */}
        {!loading && !error && analysisData && (
          <div className="grid min-h-[620px] gap-3 lg:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)]">
            {/* 70% MAIN VISUALIZATION */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-[#07101b]">
              <div className="flex h-11 items-center justify-between border-b border-slate-800 px-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />

                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    ACCESSIBILITY MAP
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[9px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Underserved
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    Facility
                  </span>
                </div>
              </div>

              <div className="h-[570px]">
                <HealthcareMap
                  analysisResults={filteredResults}
                  selectedCountry={selectedCountry}
                  selectedSettlement={selectedSettlement}
                  onSettlementSelect={handleSettlementSelect}
                />
              </div>
            </section>

            {/* 30% INTELLIGENCE SIDEBAR */}
            <IntelligenceSidebar
              selectedSettlement={selectedSettlement}
              results={filteredResults}
              totalFacilities={
                selectedCountry === "All"
                  ? analysisData.total_facilities
                  : filteredResults.length > 0
                    ? new Set(
                        filteredResults.map(
                          (item) => item.nearest_facility
                        )
                      ).size
                    : 0
              }
            />
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-[620px] items-center justify-center rounded-xl border border-slate-800 bg-[#07101b]">
            <div className="text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

              <p className="text-xs font-semibold text-slate-300">
                Loading healthcare intelligence...
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                Connecting to accessibility analysis engine
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex min-h-[620px] items-center justify-center rounded-xl border border-red-900/40 bg-[#07101b]">
            <div className="max-w-md text-center">
              <div className="mb-3 text-3xl">⚠</div>

              <h2 className="text-lg font-bold text-red-300">
                Analysis service unavailable
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Start the FastAPI backend and refresh the page.
              </p>

              <code className="mt-4 block rounded-lg border border-slate-800 bg-black/30 p-3 text-left text-[10px] text-cyan-300">
                py -m uvicorn app.main:app --reload
              </code>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {!loading && !error && analysisData && (
          <AnalyticsStrip
            results={filteredResults}
            underservedCount={filteredUnderserved.length}
            totalPopulation={totalPopulation}
            averageDistance={averageDistance}
          />
        )}
      </div>
    </main>
  );
}