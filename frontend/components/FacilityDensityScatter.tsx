"use client";

import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import type { AccessibilityResult } from "@/app/page";

export default function FacilityDensityScatter({
  results,
}: {
  results: AccessibilityResult[];
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // NOTE: aggregated by country, not by district — your current data
  // (AccessibilityResult) has no per-district facility-capacity field.
  // If your backend adds a facility_capacity/specialty field per
  // settlement, swap the grouping key from `country` to `district`.
  const aggregated = useMemo(() => {
    const groups = d3.group(results, (r) => r.country);
    return Array.from(groups, ([country, rows]) => ({
      country,
      population: d3.sum(rows, (r) => r.population),
      facilityCount: new Set(rows.map((r) => r.nearest_facility)).size,
    }));
  }, [results]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 480;
    const height = 260;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (aggregated.length === 0) return;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(aggregated, (d) => d.population) ?? 1])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(aggregated, (d) => d.facilityCount) ?? 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".2s")))
      .selectAll("text")
      .attr("fill", "#64748b")
      .style("font-size", "9px");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("fill", "#64748b")
      .style("font-size", "9px");

    svg.selectAll(".domain, .tick line").attr("stroke", "#1e293b");

    svg
      .append("g")
      .selectAll("circle")
      .data(aggregated)
      .join("circle")
      .attr("cx", (d) => x(d.population))
      .attr("cy", (d) => y(d.facilityCount))
      .attr("r", 7)
      .attr("fill", "#22d3ee")
      .attr("fill-opacity", 0.7)
      .attr("stroke", "#0891b2")
      .attr("stroke-width", 1);

    svg
      .append("g")
      .selectAll("text.label")
      .data(aggregated)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.population) + 10)
      .attr("y", (d) => y(d.facilityCount) + 3)
      .text((d) => d.country)
      .attr("fill", "#94a3b8")
      .style("font-size", "9px");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .style("font-size", "9px")
      .text("Population");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .style("font-size", "9px")
      .text("Facility Count");
  }, [aggregated]);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#07101b]">
      <div className="flex h-11 items-center border-b border-slate-800 px-4">
        <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
        <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
          Facility Density vs. Population
        </span>
      </div>
      <div className="flex justify-center p-3">
        <svg ref={svgRef} width={480} height={260} />
      </div>
    </section>
  );
}