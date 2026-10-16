"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import HealthcareGovernancePanel from "@/components/WhoControlsTheRailPanel";
import FacilityDensityScatter from "@/components/FacilityDensityScatter";
import IntelligenceSidebar from "@/components/IntelligenceSidebar";
import AnalyticsStrip from "@/components/AnalyticsStrip";
import RankingTable from "@/components/RankingTable";
import MobileClinicPanel from "@/components/MobileClinicPanel";
import WhyThisMattersPanel from "@/components/WhyThisMattersPanel";
import DataStatusBadge from "@/components/DataStatusBadge";
import SyntheticDataDisclaimer from "@/components/SyntheticDataDisclaimer";
import ProjectInfoModal from "@/components/ProjectInfoModal";

const HealthcareMap = dynamic(() => import("@/components/HealthcareMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#06161a]">
      <div className="text-center">
        <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-2 border-[rgba(45,212,191,0.2)] border-t-[#2dd4bf]" />
        <p className="text-xs font-medium tracking-wide text-[#94a3b8]">
          Initializing geospatial canvas & telemetry...
        </p>
      </div>
    </div>
  ),
});

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

type AnalyticsTab = "metrics" | "ranking" | "scatter" | "clinic" | "policy";

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedSettlement, setSelectedSettlement] =
    useState<AccessibilityResult | null>(null);

  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("metrics");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAnalysis() {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(
          `${apiBase}/api/analysis/underserved-areas`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Analysis service returned non-200 status");
        }

        const data: AnalysisResponse = await response.json();

        if (!cancelled) {
          setAnalysisData(data);
          // Note: Automatic selection of first settlement removed per prompt requirements
          // Intelligence panel starts closed by default.
        }
      } catch (err) {
        console.error("Accessibility API request error:", err);
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

  // Keyboard shortcut listener for global escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isInfoModalOpen) {
          setIsInfoModalOpen(false);
        } else if (isIntelligenceOpen) {
          setIsIntelligenceOpen(false);
        } else if (isAnalyticsOpen) {
          setIsAnalyticsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInfoModalOpen, isIntelligenceOpen, isAnalyticsOpen]);

  // Derived available countries from actual backend response
  const availableCountries = useMemo(() => {
    if (!analysisData) return [];
    return Array.from(
      new Set(analysisData.all_results.map((r) => r.country))
    ).sort();
  }, [analysisData]);

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
      (result) => result.accessibility_status === "Underserved"
    );
  }, [filteredResults]);

  const totalPopulation = useMemo(() => {
    return filteredResults.reduce((sum, result) => sum + result.population, 0);
  }, [filteredResults]);

  const averageDistance = useMemo(() => {
    if (!filteredResults.length) return 0;
    return (
      filteredResults.reduce((sum, result) => sum + result.distance_km, 0) /
      filteredResults.length
    );
  }, [filteredResults]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    // If selected settlement does not belong to new country filter, clear it
    if (
      selectedSettlement &&
      country !== "All" &&
      selectedSettlement.country !== country
    ) {
      setSelectedSettlement(null);
    }
  };

  const handleSettlementSelect = (settlement: AccessibilityResult) => {
    setSelectedSettlement(settlement);
    setIsIntelligenceOpen(true);
  };

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#06161a] text-[#f0fdfa]">
      {/* ── CINEMATIC HEADER ──────────────────────────────────────────────── */}
      <header className="relative z-40 flex h-14 flex-shrink-0 items-center justify-between border-b border-[rgba(45,212,191,0.18)] bg-[#0a1f24]/95 px-4 backdrop-blur-md lg:px-6">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(45,212,191,0.3)] bg-[rgba(45,212,191,0.1)] shadow-[0_0_12px_rgba(45,212,191,0.25)]">
            <span className="text-sm font-bold text-[#2dd4bf]">✚</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="hidden text-[10px] font-bold uppercase tracking-widest text-[#2dd4bf] sm:inline">
                Healthcare Access Intelligence
              </span>
              <span className="hidden rounded bg-[#0e2a30] px-1.5 py-0.2 text-[9px] text-[#94a3b8] sm:inline">
                POC-51
              </span>
            </div>
            <h1 className="text-xs font-bold tracking-tight text-white sm:text-sm">
              <span className="hidden md:inline">
                Infocreon Internship — Rural & Remote Healthcare Access Gap Mapper
              </span>
              <span className="md:hidden">Healthcare Access Gap Mapper</span>
            </h1>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Country Filter */}
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="country-filter"
              className="hidden text-[10px] font-semibold uppercase tracking-wider text-[#64748b] md:block"
            >
              Region
            </label>
            <select
              id="country-filter"
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="rounded-lg border border-[rgba(45,212,191,0.2)] bg-[#06161a] px-3 py-1.5 text-xs font-semibold text-[#f0fdfa] transition hover:border-[#2dd4bf] focus:border-[#2dd4bf] focus:outline-none"
            >
              <option value="All">All Regions ({availableCountries.length})</option>
              {availableCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Data Provenance Badge */}
          <DataStatusBadge />

          {/* Analytics Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsAnalyticsOpen((v) => !v)}
            aria-expanded={isAnalyticsOpen}
            aria-label="Toggle analytics drawer"
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
              isAnalyticsOpen
                ? "border-[#2dd4bf] bg-[rgba(45,212,191,0.15)] text-[#2dd4bf]"
                : "border-[rgba(45,212,191,0.2)] bg-[#0e2a30] text-[#94a3b8] hover:bg-[#133840] hover:text-[#f0fdfa]"
            }`}
          >
            <span>📊 Analytics</span>
            <span className="text-[10px] opacity-75">{isAnalyticsOpen ? "▲" : "▼"}</span>
          </button>

          {/* Slide-over Intelligence Panel Toggle */}
          <button
            type="button"
            onClick={() => setIsIntelligenceOpen((v) => !v)}
            aria-expanded={isIntelligenceOpen}
            aria-label="Toggle settlement intelligence slide-over panel"
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
              isIntelligenceOpen
                ? "border-[#2dd4bf] bg-[rgba(45,212,191,0.15)] text-[#2dd4bf]"
                : "border-[rgba(45,212,191,0.2)] bg-[#0e2a30] text-[#94a3b8] hover:bg-[#133840] hover:text-[#f0fdfa]"
            }`}
          >
            <span>◈ Intelligence</span>
            {selectedSettlement && (
              <span className="flex h-2 w-2 rounded-full bg-[#2dd4bf] shadow-[0_0_6px_rgba(45,212,191,0.8)]" />
            )}
          </button>

          {/* Project Info Button */}
          <button
            type="button"
            onClick={() => setIsInfoModalOpen(true)}
            aria-label="Open project metadata and architecture modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(45,212,191,0.2)] bg-[#0e2a30] text-[#94a3b8] transition hover:bg-[#133840] hover:text-[#2dd4bf] focus:outline-none focus:ring-1 focus:ring-[#2dd4bf]"
            title="System Info & Specifications"
          >
            ⓘ
          </button>
        </div>
      </header>

      {/* Synthetic Data Notice Sub-bar */}
      <div className="relative z-30 w-full border-b border-amber-400/20 bg-[#06161a]/90 px-4 py-1.5 backdrop-blur-md">
        <SyntheticDataDisclaimer />
      </div>

      {/* ── MAIN VIEWPORT CANVAS: FULLSCREEN MAP ──────────────────────────── */}
      <main className="relative flex-1 overflow-hidden">

        {/* Full-screen Leaflet Map */}
        {!loading && !error && analysisData && (
          <div className="h-full w-full">
            <HealthcareMap
              analysisResults={filteredResults}
              selectedCountry={selectedCountry}
              selectedSettlement={selectedSettlement}
              onSettlementSelect={handleSettlementSelect}
              panelOpen={isIntelligenceOpen}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex h-full w-full items-center justify-center bg-[#06161a]">
            <div className="rounded-xl border border-[rgba(45,212,191,0.2)] bg-[#0a1f24] p-8 text-center shadow-2xl">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[rgba(45,212,191,0.2)] border-t-[#2dd4bf]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Connecting to Geospatial Engine
              </h2>
              <p className="mt-1 text-xs text-[#94a3b8]">
                Loading settlement matrices, catchment polygons & Haversine distances...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex h-full w-full items-center justify-center bg-[#06161a] p-4">
            <div className="max-w-md rounded-xl border border-red-500/30 bg-[#0a1f24] p-6 text-center shadow-2xl">
              <div className="mb-3 text-3xl">⚠</div>
              <h2 className="text-base font-bold text-red-300">
                Analysis Engine Offline
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#94a3b8]">
                Unable to establish connection to the FastAPI backend service at{" "}
                <code className="text-[#2dd4bf]">
                  {process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}
                </code>
                . Please verify the backend server is running.
              </p>
              <div className="mt-4 rounded-lg border border-[rgba(45,212,191,0.15)] bg-[#06161a] p-3 text-left">
                <p className="text-[10px] text-[#64748b]">Start backend command:</p>
                <code className="mt-1 block text-xs text-[#2dd4bf]">
                  uvicorn app.main:app --port 8000
                </code>
              </div>
            </div>
          </div>
        )}

        {/* ── EXPANDABLE ANALYTICS TRAY / BOTTOM DOCK ──────────────────────── */}
        {!loading && !error && analysisData && (
          <div
            className={`absolute right-4 bottom-0 left-4 z-[1050] transition-all duration-300 sm:left-6 ${
              isIntelligenceOpen ? "sm:right-[456px]" : "sm:right-6"
            }`}
          >
            <div className="overflow-hidden rounded-t-xl border border-b-0 border-[rgba(45,212,191,0.2)] bg-[#0a1f24]/95 shadow-2xl backdrop-blur-md">
              {/* Drawer Top Bar / Tab Strip */}
              <div className="flex flex-wrap items-center justify-between border-b border-[rgba(45,212,191,0.15)] bg-[#06161a]/90 px-4 py-2">
                {/* Metric Summary Chips */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <span className="h-2 w-2 rounded-full bg-[#2dd4bf]" />
                    <span>{filteredResults.length} Settlements</span>
                  </div>
                  <span className="text-[#64748b]">|</span>
                  <div className="flex items-center gap-1.5 text-red-400">
                    <span>
                      {filteredUnderserved.length} Underserved (
                      {filteredResults.length > 0
                        ? Math.round(
                            (filteredUnderserved.length / filteredResults.length) * 100
                          )
                        : 0}
                      %)
                    </span>
                  </div>
                  <span className="hidden text-[#64748b] md:inline">|</span>
                  <div className="hidden items-center gap-1.5 text-[#94a3b8] md:flex">
                    <span>Avg Distance: {averageDistance.toFixed(1)} km</span>
                  </div>
                </div>

                {/* Tab Navigation Buttons */}
                <div className="flex items-center gap-1">
                  {(
                    [
                      { id: "metrics", label: "Analytics Strip" },
                      { id: "ranking", label: "Priority Rankings" },
                      { id: "scatter", label: "Density vs Pop" },
                      { id: "clinic", label: "Mobile Clinic" },
                      { id: "policy", label: "Governance & Impact" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (!isAnalyticsOpen) setIsAnalyticsOpen(true);
                      }}
                      className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                        activeTab === tab.id && isAnalyticsOpen
                          ? "bg-[#2dd4bf] text-[#06161a]"
                          : "text-[#94a3b8] hover:bg-[#0e2a30] hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setIsAnalyticsOpen((v) => !v)}
                    aria-label={
                      isAnalyticsOpen ? "Minimize analytics drawer" : "Expand analytics drawer"
                    }
                    className="ml-2 flex h-6 w-6 items-center justify-center rounded border border-[rgba(45,212,191,0.2)] bg-[#0e2a30] text-[10px] text-[#94a3b8] transition hover:bg-[#133840] hover:text-[#2dd4bf]"
                  >
                    {isAnalyticsOpen ? "▼" : "▲"}
                  </button>
                </div>
              </div>

              {/* Drawer Content Body (when expanded) */}
              {isAnalyticsOpen && (
                <div className="max-h-[340px] overflow-y-auto p-4 transition-all">
                  {activeTab === "metrics" && (
                    <AnalyticsStrip
                      results={filteredResults}
                      underservedCount={filteredUnderserved.length}
                      totalPopulation={totalPopulation}
                      averageDistance={averageDistance}
                    />
                  )}

                  {activeTab === "ranking" && (
                    <RankingTable
                      results={filteredUnderserved}
                      onSelectSettlement={handleSettlementSelect}
                      selectedSettlementId={selectedSettlement?.settlement_id}
                    />
                  )}

                  {activeTab === "scatter" && (
                    <FacilityDensityScatter results={filteredResults} />
                  )}

                  {activeTab === "clinic" && (
                    <MobileClinicPanel
                      results={filteredUnderserved}
                      onSelectSettlement={handleSettlementSelect}
                    />
                  )}

                  {activeTab === "policy" && (
                    <div className="grid gap-3 lg:grid-cols-2">
                      <WhyThisMattersPanel />
                      <HealthcareGovernancePanel />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── SLIDE-OVER INTELLIGENCE PANEL ─────────────────────────────────── */}
      <IntelligenceSidebar
        isOpen={isIntelligenceOpen}
        onClose={() => setIsIntelligenceOpen(false)}
        selectedSettlement={selectedSettlement}
        results={filteredResults}
        totalFacilities={
          analysisData
            ? selectedCountry === "All"
              ? analysisData.total_facilities
              : new Set(filteredResults.map((item) => item.nearest_facility)).size
            : 0
        }
        onSelectSettlement={handleSettlementSelect}
      />

      {/* ── PROJECT INFORMATION MODAL ─────────────────────────────────────── */}
      <ProjectInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}