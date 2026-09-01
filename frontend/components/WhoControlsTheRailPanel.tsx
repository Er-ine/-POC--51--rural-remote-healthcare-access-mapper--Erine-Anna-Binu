export default function WhoControlsTheRailPanel() {
  const stakeholders = [
    {
      name: "Ministry of Health (Oman / Saudi Arabia)",
      role: "Sets national rural health policy, facility licensing, and resource allocation priorities.",
    },
    {
      name: "Regional Health Directorates",
      role: "Operate primary health centres and coordinate mobile clinic deployment at the district level.",
    },
    {
      name: "WHO Regional Office (EMRO)",
      role: "Provides workforce retention guidance and technical standards for rural health equity.",
    },
    {
      name: "National Spatial Data Infrastructure bodies",
      role: "Maintain the geospatial data (settlements, boundaries, facility locations) this dashboard depends on.",
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#07101b]">
      <div className="flex h-11 items-center border-b border-slate-800 px-4">
        <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.7)]" />
        <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
          Who Controls The Rail
        </span>
      </div>

      <div className="divide-y divide-slate-800/60">
        {stakeholders.map((s) => (
          <div key={s.name} className="px-4 py-3">
            <div className="text-xs font-semibold text-slate-200">
              {s.name}
            </div>
            <div className="mt-1 text-[11px] leading-5 text-slate-500">
              {s.role}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}