import { useMemo, useState } from "react";
import { extent, niceTicks, padExtent, useWidth } from "./scale";
import type { ProjectionResult } from "@/lib/types";
import "./charts.css";

/** Monte Carlo range-of-outcomes chart: two bands, a median line and the money-in line. */
export function FanChart({ result, format, height = 280 }: { result: ProjectionResult; format: (v: number) => string; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const { years, contributions, percentiles: p } = result;
  const n = years.length;

  const geo = useMemo(() => {
    const [lo, hi] = padExtent(extent([...p.p90, ...p.p10, ...contributions]), 0.06, true);
    const ticks = niceTicks(0, hi, 5);
    const yLabelW = Math.max(...ticks.map((t) => format(t).length), 3) * 6.8 + 10;
    const pad = { top: 14, right: 16, bottom: 26, left: yLabelW };
    const pw = Math.max(10, width - pad.left - pad.right);
    const ph = Math.max(10, height - pad.top - pad.bottom);
    const yMax = Math.max(hi, ticks[ticks.length - 1] ?? hi);
    const sx = (i: number) => pad.left + (i / (n - 1 || 1)) * pw;
    const sy = (v: number) => pad.top + ph - ((v - Math.min(0, lo)) / (yMax - Math.min(0, lo) || 1)) * ph;
    return { pad, pw, ph, ticks, sx, sy };
  }, [p, contributions, width, height, n, format]);

  const band = (upper: number[], lower: number[]) => {
    let d = "";
    upper.forEach((v, i) => (d += `${i ? "L" : "M"}${geo.sx(i).toFixed(1)},${geo.sy(v).toFixed(1)}`));
    for (let i = lower.length - 1; i >= 0; i--) d += `L${geo.sx(i).toFixed(1)},${geo.sy(lower[i]).toFixed(1)}`;
    return d + "Z";
  };
  const line = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${geo.sx(i).toFixed(1)},${geo.sy(v).toFixed(1)}`).join("");

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left) / rect.width) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  const rows = hover === null ? [] : [
    { k: "Optimistic (top 10%)", v: p.p90[hover], c: "var(--s1)", band: true },
    { k: "Good (top 25%)", v: p.p75[hover], c: "var(--s1)", band: true },
    { k: "Middle outcome", v: p.p50[hover], c: "var(--s1)" },
    { k: "Weak (bottom 25%)", v: p.p25[hover], c: "var(--s1)", band: true },
    { k: "Poor (bottom 10%)", v: p.p10[hover], c: "var(--s1)", band: true },
    { k: "Money put in", v: contributions[hover], c: "var(--ink-3)" },
  ];

  const hx = hover === null ? 0 : geo.sx(hover);
  return (
    <div className="chart" ref={ref} role="img" aria-label="Range of possible outcomes over time">
      <svg width={width || 1} height={height}>
        <g className="chart-grid">
          {geo.ticks.map((t) => (
            <line key={t} x1={geo.pad.left} x2={geo.pad.left + geo.pw} y1={geo.sy(t)} y2={geo.sy(t)} />
          ))}
        </g>
        {geo.ticks.map((t) => (
          <text key={t} className="chart-tick" x={geo.pad.left - 6} y={geo.sy(t) + 3.5} textAnchor="end">
            {format(t)}
          </text>
        ))}
        {years.filter((_, i) => i % Math.ceil(n / 8) === 0 || i === n - 1).map((y, _, arr) => (
          <text key={y} className="chart-tick" x={geo.sx(y)} y={height - 8} textAnchor={y === 0 ? "start" : y === arr[arr.length - 1] ? "end" : "middle"}>
            {y === 0 ? "Now" : `Yr ${y}`}
          </text>
        ))}
        <path className="chart-band" d={band(p.p90, p.p10)} fill="var(--s1)" />
        <path className="chart-band inner" d={band(p.p75, p.p25)} fill="var(--s1)" />
        <path className="chart-line" d={line(p.p50)} stroke="var(--s1)" />
        <path className="chart-line thin" d={line(contributions)} stroke="var(--ink-3)" />
        <g className="chart-axis">
          <line x1={geo.pad.left} x2={geo.pad.left + geo.pw} y1={geo.pad.top + geo.ph} y2={geo.pad.top + geo.ph} />
        </g>
        <circle className="chart-dot" cx={geo.sx(n - 1)} cy={geo.sy(p.p50[n - 1])} r={4} fill="var(--s1)" />
        {hover !== null && (
          <g>
            <line className="chart-crosshair" x1={hx} x2={hx} y1={geo.pad.top} y2={geo.pad.top + geo.ph} />
            <circle className="chart-dot" cx={hx} cy={geo.sy(p.p50[hover])} r={4.5} fill="var(--s1)" />
            <circle className="chart-dot" cx={hx} cy={geo.sy(contributions[hover])} r={4} fill="var(--ink-3)" />
          </g>
        )}
        <rect className="chart-hit" x={geo.pad.left} y={geo.pad.top} width={geo.pw} height={geo.ph} onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => setHover(null)} />
      </svg>
      {hover !== null && (
        <div className="chart-tooltip" style={{ left: hx > width * 0.55 ? hx - 230 : hx + 12, minWidth: 210 }}>
          <div className="tt-x">{hover === 0 ? "Today" : `After ${hover} year${hover === 1 ? "" : "s"}`}</div>
          {rows.map((r) => (
            <div className="tt-row" key={r.k}>
              <span className={`tt-key ${r.band ? "rect" : ""}`} style={{ background: r.c, opacity: r.band ? 0.35 : 1 }} />
              <span className="tt-label">{r.k}</span>
              <span className="tt-val">{format(r.v)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="chart-legend">
        <span className="lg-item">
          <span className="lg-key" style={{ background: "var(--s1)" }} /> Middle outcome
        </span>
        <span className="lg-item">
          <span className="lg-key band" style={{ background: "var(--s1)", opacity: 0.4 }} /> Middle half of outcomes
        </span>
        <span className="lg-item">
          <span className="lg-key band" style={{ background: "var(--s1)", opacity: 0.2 }} /> 80% of outcomes
        </span>
        <span className="lg-item">
          <span className="lg-key" style={{ background: "var(--ink-3)" }} /> Money put in
        </span>
      </div>
    </div>
  );
}
