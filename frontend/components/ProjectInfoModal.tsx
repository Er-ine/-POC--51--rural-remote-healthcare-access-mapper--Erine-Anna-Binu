"use client";

import { useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProjectInfoModal({ isOpen, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-info-title"
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-[rgba(45,212,191,0.25)] bg-[#0a1f24] text-[#f0fdfa] shadow-2xl transition-all">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-[rgba(45,212,191,0.15)] bg-[#06161a]/60 px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,0.7)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#2dd4bf]">
              System Metadata & Architecture
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close information modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(45,212,191,0.2)] bg-[#0e2a30] text-[#94a3b8] transition hover:bg-[#133840] hover:text-[#2dd4bf] focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] space-y-6 overflow-y-auto p-6 text-xs leading-relaxed">
          {/* Identity Block */}
          <div>
            <h2 id="project-info-title" className="text-base font-bold text-white">
              Infocreon Internship — Rural & Remote Healthcare Access Gap Mapper
            </h2>
            <p className="mt-1 text-[#94a3b8]">
              Geospatial decision-intelligence platform identifying underserved settlements, critical travel horizons, and catchment disparities across rural and remote regions.
            </p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-[rgba(45,212,191,0.15)] bg-[#0e2a30]/60 p-3">
              <span className="text-[10px] uppercase tracking-wider text-[#94a3b8]">Program</span>
              <p className="mt-1 font-semibold text-white">Infocreon Internship</p>
              <p className="text-[10px] text-[#2dd4bf]">Batch 6</p>
            </div>

            <div className="rounded-lg border border-[rgba(45,212,191,0.15)] bg-[#0e2a30]/60 p-3">
              <span className="text-[10px] uppercase tracking-wider text-[#94a3b8]">POC ID</span>
              <p className="mt-1 font-semibold text-white">51</p>
              <p className="text-[10px] text-[#94a3b8]">Healthcare Access</p>
            </div>

            <div className="rounded-lg border border-[rgba(45,212,191,0.15)] bg-[#0e2a30]/60 p-3">
              <span className="text-[10px] uppercase tracking-wider text-[#94a3b8]">Architect</span>
              <p className="mt-1 font-semibold text-white">Erine Anna Binu</p>
              <p className="text-[10px] text-[#2dd4bf]">Lead Engineer</p>
            </div>

            <div className="rounded-lg border border-[rgba(45,212,191,0.15)] bg-[#0e2a30]/60 p-3">
              <span className="text-[10px] uppercase tracking-wider text-[#94a3b8]">GitHub</span>
              <p className="mt-1 font-semibold text-white">Er-ine</p>
              <p className="text-[10px] text-[#94a3b8]">Repository Owner</p>
            </div>
          </div>

          {/* Core Objectives */}
          <div className="rounded-lg border border-[rgba(45,212,191,0.15)] bg-[#06161a]/60 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf]">
              Domain & Purpose
            </div>
            <p className="mt-2 text-[#94a3b8]">
              Rural populations frequently encounter extended travel barriers to secondary and tertiary medical facilities. This system pairs geographic settlement coordinates with facility catchment models to calculate distance matrices via the Haversine algorithm, classifying settlements into Well-Served (&le;5 km), Moderate Access (5–15 km), and Underserved (&gt;15 km) categories to prioritize mobile clinics and infrastructure investments.
            </p>
          </div>

          {/* Verified Technology Stack */}
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf]">
              Verified Technology Stack
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-[#133840] bg-[#0e2a30]/40 p-3">
                <span className="text-[10px] font-semibold text-white">Frontend Architecture</span>
                <ul className="mt-1.5 space-y-1 text-[11px] text-[#94a3b8]">
                  <li>• Next.js 16 (App Router & Turbopack)</li>
                  <li>• React 19 & TypeScript 5</li>
                  <li>• Tailwind CSS 4 with custom dark cinematic theme</li>
                </ul>
              </div>

              <div className="rounded-lg border border-[#133840] bg-[#0e2a30]/40 p-3">
                <span className="text-[10px] font-semibold text-white">Geospatial & Visualization</span>
                <ul className="mt-1.5 space-y-1 text-[11px] text-[#94a3b8]">
                  <li>• Leaflet 1.9 & React-Leaflet 5</li>
                  <li>• CartoDB Dark Matter / Dark All Cartography</li>
                  <li>• Turf.js (Isochrone Catchment Geometry)</li>
                  <li>• D3.js (Voronoi Tessellation & Scatter Density)</li>
                </ul>
              </div>

              <div className="rounded-lg border border-[#133840] bg-[#0e2a30]/40 p-3">
                <span className="text-[10px] font-semibold text-white">Backend Analysis Engine</span>
                <ul className="mt-1.5 space-y-1 text-[11px] text-[#94a3b8]">
                  <li>• Python 3.14</li>
                  <li>• FastAPI 0.135 & Uvicorn 0.42</li>
                  <li>• Pydantic 2.12 Type Validation</li>
                  <li>• Haversine Distance Service</li>
                </ul>
              </div>

              <div className="rounded-lg border border-[#133840] bg-[#0e2a30]/40 p-3">
                <span className="text-[10px] font-semibold text-white">Data Provenance</span>
                <ul className="mt-1.5 space-y-1 text-[11px] text-[#94a3b8]">
                  <li>• Real-based hospital & city reference data</li>
                  <li>• Synthetic demographic & travel-time indicators for proof-of-concept simulation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[rgba(45,212,191,0.15)] bg-[#06161a]/60 px-6 py-3">
          <span className="text-[10px] text-[#64748b]">POC-51 · Infocreon Internship Batch 6</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#2dd4bf] px-4 py-1.5 text-xs font-semibold text-[#06161a] transition hover:bg-[#5eead4] focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
