import { useMemo, useState, type ReactNode } from "react";
import { IcTable, IcChart } from "../icons";
import { daysBetween, extent, formatDateTick, niceTicks, padExtent, pickIndices, SERIES, useWidth } from "./scale";
import "./charts.css";

export interface LineSeries {
  id: string;
  label: string;
  data: (number | null)[];
  color?: string;
  /** de-emphasised context line (thinner, muted colour) */
  muted?: boolean;
  /** fill a 10% wash under this line */
  area?: boolean;
}

export interface RefLine {
  value: number;
  label?: string;
}

export function LineChart({
  x,
  series,
  height = 260,
  yFormat = (v) => v.toLocaleString("en-US", { maximumFractionDigits: 2 }),
  xFormat,
  refLines = [],
  endLabels = true,
  legend = true,
  includeZero = false,
  ariaLabel,
  tableTitle,
  className = "",
  children,
}: {
  x: string[];
  series: LineSeries[];
  height?: number;
  yFormat?: (v: number) => string;
  xFormat?: (x: string, i: number) => string;
  refLines?: RefLine[];
  endLabels?: boolean;
  legend?: boolean;
  includeZero?: boolean;
  ariaLabel: string;
  tableTitle?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const n = x.length;

  const spanDays = n > 1 ? daysBetween(x[0], x[n - 1]) : 0;
  const fmtX = xFormat ?? ((v: string) => (spanDays > 0 ? formatDateTick(v, spanDays) : v));

  const geo = useMemo(() => {
    const all = series.flatMap((s) => s.data).concat(refLines.map((r) => r.value));
    const [lo, hi] = padExtent(extent(all), 0.08, includeZero);
    const ticks = niceTicks(lo, hi, 5);
    const yLabelW = Math.max(...ticks.map((t) => yFormat(t).length), 3) * 6.8 + 10;
    const rightPad = endLabels ? 62 : 14;
    const pad = { top: 14, right: rightPad, bottom: 26, left: yLabelW };
    const pw = Math.max(10, width - pad.left - pad.right);
    const ph = Math.max(10, height - pad.top - pad.bottom);
    const yMin = Math.min(lo, ticks[0] ?? lo);
    const yMax = Math.max(hi, ticks[ticks.length - 1] ?? hi);
    const sx = (i: number) => pad.left + (n <= 1 ? pw / 2 : (i / (n - 1)) * pw);
    const sy = (v: number) => pad.top + ph - ((v - yMin) / (yMax - yMin || 1)) * ph;
    return { pad, pw, ph, ticks, sx, sy, yMin, yMax };
  }, [series, refLines, width, height, includeZero, endLabels, n, yFormat]);

  const paths = useMemo(() => {
    return series.map((s) => {
      let d = "";
      let open = false;
      s.data.forEach((v, i) => {
        if (v === null || v === undefined || !Number.isFinite(v)) {
          open = false;
          return;
        }
        d += `${open ? "L" : "M"}${geo.sx(i).toFixed(1)},${geo.sy(v).toFixed(1)}`;
        open = true;
      });
      // area: only for contiguous tail; find first non-null
      let area = "";
      if (s.area) {
        const first = s.data.findIndex((v) => v !== null && v !== undefined);
        const last = s.data.length - 1;
        if (first >= 0 && s.data[last] !== null) {
          const base = geo.pad.top + geo.ph;
          area = `${d}L${geo.sx(last).toFixed(1)},${base}L${geo.sx(first).toFixed(1)},${base}Z`;
        }
      }
      return { d, area };
    });
  }, [series, geo]);

  const xIdx = pickIndices(n, Math.max(2, Math.min(7, Math.floor(geo.pw / 90))));

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = Math.round((px / rect.width) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? n - 1) - 1));
    else if (e.key === "ArrowRight") setHover((h) => Math.min(n - 1, (h ?? n - 1) + 1));
    else if (e.key === "Escape") setHover(null);
  };

  // end labels with collision handling: keep the first series' label, drop later ones that would overlap
  const endLabelNodes = useMemo(() => {
    if (!endLabels) return [];
    const items = series
      .map((s, si) => {
        const v = [...s.data].reverse().find((d) => d !== null && d !== undefined) as number | undefined;
        return v === undefined ? null : { si, y: geo.sy(v), text: yFormat(v), muted: s.muted };
      })
      .filter((v): v is { si: number; y: number; text: string; muted: boolean | undefined } => Boolean(v));
    const kept: typeof items = [];
    for (const it of items) {
      if (kept.some((k) => Math.abs(k.y - it.y) < 14)) continue;
      kept.push(it);
    }
    return kept;
  }, [series, geo, endLabels, yFormat]);

  const hoverX = hover !== null ? geo.sx(hover) : null;
  const tooltipLeft = hoverX !== null ? (hoverX > width * 0.6 ? hoverX - 160 : hoverX + 12) : 0;

  return (
    <div className={`chart ${className}`} ref={ref} tabIndex={0} role="img" aria-label={ariaLabel} onKeyDown={onKey} onBlur={() => setHover(null)}>
      <div className="chart-toolbar">
        {children}
        <button type="button" aria-pressed={table} onClick={() => setTable((t) => !t)} title={table ? "Show chart" : "Show as table"}>
          {table ? <IcChart size={12} /> : <IcTable size={12} />}
          {table ? "Chart" : "Table"}
        </button>
      </div>
      {table ? (
        <div className="chart-table" style={{ marginTop: 26 }}>
          <table>
            <caption className="sr-only">{tableTitle ?? ariaLabel}</caption>
            <thead>
              <tr>
                <th>Date</th>
                {series.map((s) => (
                  <th key={s.id}>{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {x.map((xi, i) => (
                <tr key={xi + i}>
                  <td>{xi}</td>
                  {series.map((s) => (
                    <td key={s.id}>{s.data[i] === null || s.data[i] === undefined ? "—" : yFormat(s.data[i] as number)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <svg width={width || 1} height={height}>
            <g className="chart-grid">
              {geo.ticks.map((t) => (
                <line key={t} x1={geo.pad.left} x2={geo.pad.left + geo.pw} y1={geo.sy(t)} y2={geo.sy(t)} />
              ))}
            </g>
            <g className="chart-axis">
              <line x1={geo.pad.left} x2={geo.pad.left + geo.pw} y1={geo.pad.top + geo.ph} y2={geo.pad.top + geo.ph} />
            </g>
            {geo.ticks.map((t) => (
              <text key={t} className="chart-tick" x={geo.pad.left - 6} y={geo.sy(t) + 3.5} textAnchor="end">
                {yFormat(t)}
              </text>
            ))}
            {xIdx.map((i) => (
              <text key={i} className="chart-tick" x={geo.sx(i)} y={height - 8} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}>
                {fmtX(x[i], i)}
              </text>
            ))}
            {refLines.map((r, i) => (
              <g key={i}>
                <line className="chart-ref" x1={geo.pad.left} x2={geo.pad.left + geo.pw} y1={geo.sy(r.value)} y2={geo.sy(r.value)} />
                {r.label && (
                  <text className="chart-ref-label" x={geo.pad.left + 4} y={geo.sy(r.value) - 4}>
                    {r.label}
                  </text>
                )}
              </g>
            ))}
            {series.map((s, si) => {
              const color = s.muted ? "var(--series-muted)" : s.color ?? SERIES[si % SERIES.length];
              return (
                <g key={s.id}>
                  {paths[si].area && <path className="chart-area" d={paths[si].area} fill={color} />}
                  <path className={`chart-line ${s.muted ? "thin" : ""}`} d={paths[si].d} stroke={color} />
                </g>
              );
            })}
            {/* end markers + labels */}
            {endLabelNodes.map((l) => {
              const s = series[l.si];
              const color = s.muted ? "var(--series-muted)" : s.color ?? SERIES[l.si % SERIES.length];
              return (
                <g key={s.id}>
                  {!s.muted && <circle className="chart-dot" cx={geo.pad.left + geo.pw} cy={l.y} r={4} fill={color} />}
                  <text className="chart-end-label" x={geo.pad.left + geo.pw + 8} y={l.y + 3.5}>
                    {l.text}
                  </text>
                </g>
              );
            })}
            {hover !== null && hoverX !== null && (
              <g>
                <line className="chart-crosshair" x1={hoverX} x2={hoverX} y1={geo.pad.top} y2={geo.pad.top + geo.ph} />
                {series.map((s, si) => {
                  const v = s.data[hover];
                  if (v === null || v === undefined) return null;
                  const color = s.muted ? "var(--series-muted)" : s.color ?? SERIES[si % SERIES.length];
                  return <circle key={s.id} className="chart-dot" cx={hoverX} cy={geo.sy(v)} r={4.5} fill={color} />;
                })}
              </g>
            )}
            <rect
              className="chart-hit"
              x={geo.pad.left}
              y={geo.pad.top}
              width={geo.pw}
              height={geo.ph}
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
            />
          </svg>
          {hover !== null && (
            <div className="chart-tooltip" style={{ left: tooltipLeft }}>
              <div className="tt-x">{x[hover]}</div>
              {series.map((s, si) => {
                const v = s.data[hover];
                const color = s.muted ? "var(--series-muted)" : s.color ?? SERIES[si % SERIES.length];
                return (
                  <div className="tt-row" key={s.id}>
                    <span className="tt-key" style={{ background: color }} />
                    <span className="tt-label">{s.label}</span>
                    <span className="tt-val">{v === null || v === undefined ? "—" : yFormat(v)}</span>
                  </div>
                );
              })}
            </div>
          )}
          {legend && series.length >= 2 && (
            <div className="chart-legend">
              {series.map((s, si) => (
                <span className="lg-item" key={s.id}>
                  <span className="lg-key" style={{ background: s.muted ? "var(--series-muted)" : s.color ?? SERIES[si % SERIES.length] }} />
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
