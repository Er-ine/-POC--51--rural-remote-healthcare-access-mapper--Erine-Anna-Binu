"use client";

export default function WhyThisMattersPanel() {
  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(45,212,191,0.18)] bg-[#0a1f24] shadow-xl">
      <div className="flex h-11 items-center justify-between border-b border-[rgba(45,212,191,0.12)] px-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.7)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2dd4bf]">
            Public Health Impact Rationale
          </span>
        </div>
        <span className="text-[10px] text-[#64748b]">Clinical Equity Objective</span>
      </div>

      <div className="p-4 text-xs leading-relaxed text-[#94a3b8]">
        <p>
          Rural and remote populations face disproportionate travel burdens to secondary and emergency medical facilities. Extended travel times directly correlate with delayed emergency interventions, heightened maternal and perinatal risks, and reduced preventive screening compliance.
        </p>
        <p className="mt-2.5">
          By modeling distance catchments, spatial Voronoi territories, and underserved settlement clusters, healthcare ministries and NGOs can transition from uniform resource distribution to needs-weighted allocation: optimizing mobile health unit routing, prioritizing new health center construction, and directing telemedicine infrastructure where clinical distance gaps are acute.
        </p>
      </div>
    </div>
  );
}