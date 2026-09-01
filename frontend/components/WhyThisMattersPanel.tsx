export default function WhyThisMattersPanel() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#07101b]">
      <div className="flex h-11 items-center border-b border-slate-800 px-4">
        <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
        <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
          Why This Matters
        </span>
      </div>

      <div className="p-4 text-xs leading-6 text-slate-400">
        <p>
          Rural and remote populations face longer travel distances to
          healthcare facilities, which directly correlates with delayed
          treatment, worse maternal and emergency outcomes, and lower
          preventive care uptake. Mapping these access gaps allows health
          ministries and NGOs to prioritize facility placement, mobile
          clinic deployment, and resource allocation where the need is
          greatest — rather than distributing resources evenly regardless
          of actual accessibility.
        </p>
      </div>
    </section>
  );
}