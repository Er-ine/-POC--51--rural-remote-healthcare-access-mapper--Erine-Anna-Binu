"use client";

export default function WhoControlsTheRailPanel() {
  const stakeholders = [
    {
      name: "Ministries of Health (GCC Regional Bodies)",
      role: "Sets national rural health policy, facility licensing, and resource allocation priorities across member states.",
    },
    {
      name: "Regional Health Directorates",
      role: "Operates primary health centres, regional referral networks, and coordinates mobile health clinic deployment at district levels.",
    },
    {
      name: "WHO Regional Office for the Eastern Mediterranean (EMRO)",
      role: "Provides rural healthcare equity benchmarks, workforce retention guidelines, and technical standards.",
    },
    {
      name: "National Spatial Data Infrastructure (NSDI) Agencies",
      role: "Maintains authoritative geospatial boundaries, settlement census registers, and transport infrastructure layers.",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(45,212,191,0.18)] bg-[#0a1f24] shadow-xl">
      <div className="flex h-11 items-center justify-between border-b border-[rgba(45,212,191,0.12)] px-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.7)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2dd4bf]">
            Healthcare Governance & Institutional Authority
          </span>
        </div>
        <span className="text-[10px] text-[#64748b]">Multi-Agency Framework</span>
      </div>

      <div className="divide-y divide-[rgba(45,212,191,0.08)]">
        {stakeholders.map((s) => (
          <div key={s.name} className="px-4 py-3 transition hover:bg-[#0e2a30]/40">
            <div className="text-xs font-semibold text-white">
              {s.name}
            </div>
            <div className="mt-1 text-[11px] leading-relaxed text-[#94a3b8]">
              {s.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}