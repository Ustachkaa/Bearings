import { useState } from "react";
import { SERIES, useWidth } from "./scale";
import "./charts.css";

export interface BarItem {
  label: string;
  value: number;
  color?: string;
  sub?: string;
}

/** Horizontal bars: ≤24px thick, rounded at the data end, square at the baseline. */
export function BarChart({
  items,
  format = (v) => v.toLocaleString("en-US", { maximumFractionDigits: 1 }),
  color = SERIES[0],
  ariaLabel,
  max,
  labelWidth = 120,
}: {
  items: BarItem[];
  format?: (v: number) => string;
  color?: string;
  ariaLabel: string;
  max?: number;
  labelWidth?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const rowH = 30;
  const barH = 18;
  const valueW = 70;
  const plotW = Math.max(10, width - labelWidth - valueW);
  const m = (max ?? Math.max(...items.map((i) => Math.abs(i.value)), 0)) || 1;
  const height = items.length * rowH + 4;
  return (
    <div className="chart" ref={ref} role="img" aria-label={ariaLabel}>
      <svg width={width || 1} height={height}>
        <line className="chart-axis" x1={labelWidth} x2={labelWidth} y1={0} y2={height} stroke="var(--axis)" />
        {items.map((it, i) => {
          const w = Math.max(0, (Math.abs(it.value) / m) * plotW);
          const y = i * rowH + (rowH - barH) / 2;
          const c = it.color ?? color;
          const r = Math.min(4, w);
          const path = `M${labelWidth},${y}h${Math.max(0, w - r)}a${r},${r} 0 0 1 ${r},${r}v${barH - 2 * r}a${r},${r} 0 0 1 -${r},${r}h-${Math.max(0, w - r)}z`;
          return (
            <g key={it.label} className={`bar ${hover !== null && hover !== i ? "dim" : ""}`} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
              <rect x={0} y={i * rowH} width={width} height={rowH} fill="transparent" />
              <text className="bar-cat" x={labelWidth - 10} y={y + barH / 2 + 4} textAnchor="end">
                {it.label}
              </text>
              <path d={path} fill={c} />
              <text className="bar-label" x={labelWidth + w + 8} y={y + barH / 2 + 4}>
                {format(it.value)}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && items[hover] && (
        <div className="chart-tooltip" style={{ left: labelWidth + 8, top: hover * rowH - 4 }}>
          <div className="tt-row">
            <span className="tt-key rect" style={{ background: items[hover].color ?? color }} />
            <span className="tt-label">{items[hover].label}</span>
            <span className="tt-val">{format(items[hover].value)}</span>
          </div>
          {items[hover].sub && <div className="tiny muted-3">{items[hover].sub}</div>}
        </div>
      )}
    </div>
  );
}

export interface Segment {
  label: string;
  value: number;
  color?: string;
}

/** One horizontal stacked bar (part-to-whole), with 2px surface gaps and a legend. */
export function StackedBar({ segments, format = (v) => `${v.toFixed(1)}%`, ariaLabel, height = 22 }: { segments: Segment[]; format?: (v: number, share: number) => string; ariaLabel: string; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const total = segments.reduce((a, s) => a + Math.max(0, s.value), 0) || 1;
  const gap = 2;
  const usable = Math.max(0, width - gap * (segments.length - 1));
  let xCursor = 0;
  const rects = segments.map((s, i) => {
    const w = (Math.max(0, s.value) / total) * usable;
    const x = xCursor;
    xCursor += w + gap;
    return { ...s, x, w, color: s.color ?? SERIES[i % SERIES.length], share: s.value / total };
  });
  return (
    <div className="chart" ref={ref} role="img" aria-label={ariaLabel}>
      <svg width={width || 1} height={height}>
        {rects.map((r, i) => {
          const rad = 4;
          const first = i === 0;
          const last = i === rects.length - 1;
          const path =
            r.w <= 0
              ? ""
              : `M${r.x + (first ? rad : 0)},0h${Math.max(0, r.w - (first ? rad : 0) - (last ? rad : 0))}${
                  last ? `a${rad},${rad} 0 0 1 ${rad},${rad}v${height - 2 * rad}a${rad},${rad} 0 0 1 -${rad},${rad}` : `v${height}`
                }h-${Math.max(0, r.w - (first ? rad : 0) - (last ? rad : 0))}${first ? `a${rad},${rad} 0 0 1 -${rad},-${rad}v-${height - 2 * rad}a${rad},${rad} 0 0 1 ${rad},-${rad}` : `v-${height}`}z`;
          return (
            <path
              key={r.label}
              d={path}
              fill={r.color}
              className={`bar ${hover !== null && hover !== i ? "dim" : ""}`}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
            />
          );
        })}
      </svg>
      {hover !== null && rects[hover] && (
        <div className="chart-tooltip" style={{ left: Math.min(rects[hover].x, Math.max(0, width - 170)), top: height + 6 }}>
          <div className="tt-row">
            <span className="tt-key rect" style={{ background: rects[hover].color }} />
            <span className="tt-label">{rects[hover].label}</span>
            <span className="tt-val">{format(rects[hover].value, rects[hover].share)}</span>
          </div>
        </div>
      )}
      <div className="chart-legend">
        {rects.map((r) => (
          <span className="lg-item" key={r.label}>
            <span className="lg-key rect" style={{ background: r.color }} />
            {r.label} <span className="mono muted-3">{(r.share * 100).toFixed(0)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
