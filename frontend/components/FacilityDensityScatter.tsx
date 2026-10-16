"use client";

import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

export type AccessibilityResult = {
  settlement_id: number;
  settlement_name: string;
  country: string;
  population: number;
  nearest_facility: string;
  distance_km: number;
  accessibility_status: string;
};

type Props = {
  results: AccessibilityResult[];
};

type CountryAggregate = {
  country: string;
  population: number;
  facilityCount: number;
};

export default function FacilityDensityScatter({ results }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const aggregated = useMemo<CountryAggregate[]>(() => {
    const groups = d3.group(results, (r: AccessibilityResult) => r.country);
    return Array.from(groups, ([country, rows]) => ({
      country,
      population: d3.sum(rows, (r: AccessibilityResult) => r.population),
      facilityCount: new Set(rows.map((r: AccessibilityResult) => r.nearest_facility)).size,
    }));
  }, [results]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 480;
    const height = 240;
    const margin = { top: 20, right: 30, bottom: 40, left: 45 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (aggregated.length === 0) return;

    const maxPop = d3.max(aggregated, (d: CountryAggregate) => d.population) ?? 1;
    const maxFac = d3.max(aggregated, (d: CountryAggregate) => d.facilityCount) ?? 1;

    const x = d3
      .scaleLinear()
      .domain([0, maxPop * 1.1])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, maxFac * 1.2])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Gridlines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", "rgba(45, 212, 191, 0.08)")
      .attr("stroke-dasharray", "2 2");

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat((d) => d3.format(".2s")(d as number)))
      .selectAll("text")
      .attr("fill", "#94a3b8")
      .style("font-size", "10px");

    // Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("fill", "#94a3b8")
      .style("font-size", "10px");

    svg.selectAll(".domain, .tick line").attr("stroke", "#133840");

    // Scatter dots
    svg
      .append("g")
      .selectAll("circle")
      .data(aggregated)
      .join("circle")
      .attr("cx", (d: CountryAggregate) => x(d.population))
      .attr("cy", (d: CountryAggregate) => y(d.facilityCount))
      .attr("r", 7)
      .attr("fill", "#2dd4bf")
      .attr("fill-opacity", 0.8)
      .attr("stroke", "#5eead4")
      .attr("stroke-width", 1.5);

    // Country labels
    svg
      .append("g")
      .selectAll("text.label")
      .data(aggregated)
      .join("text")
      .attr("class", "label")
      .attr("x", (d: CountryAggregate) => x(d.population) + 10)
      .attr("y", (d: CountryAggregate) => y(d.facilityCount) + 3)
      .text((d: CountryAggregate) => d.country)
      .attr("fill", "#f0fdfa")
      .style("font-size", "10px")
      .style("font-weight", "500");

    // Axis Labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 6)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .style("font-size", "10px")
      .text("Population Cluster (Synthetic)");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .style("font-size", "10px")
      .text("Active Facilities");
  }, [aggregated]);

  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(45,212,191,0.18)] bg-[#0a1f24] shadow-xl">
      <div className="flex h-11 items-center justify-between border-b border-[rgba(45,212,191,0.12)] px-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.7)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2dd4bf]">
            Facility Density vs. Population
          </span>
        </div>
        <span className="text-[10px] text-[#64748b]">D3.js Regression Matrix</span>
      </div>
      <div className="flex justify-center p-4">
        <svg
          ref={svgRef}
          viewBox="0 0 480 240"
          className="h-auto w-full max-w-[480px]"
        />
      </div>
    </div>
  );
}