import { useMemo } from "react";
import { extent } from "./scale";

export function Sparkline({
  data,
  width = 96,
  height = 30,
  color,
  area = true,
  tone,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  area?: boolean;
  /** colour by direction of the series (first vs last) */
  tone?: "auto" | "neutral";
}) {
  const { d, a, endX, endY, stroke } = useMemo(() => {
    const n = data.length;
    if (n < 2) return { d: "", a: "", endX: 0, endY: 0, stroke: color ?? "var(--s1)" };
    const [lo, hi] = extent(data);
    const pad = 3;
    const sx = (i: number) => pad + (i / (n - 1)) * (width - pad * 2);
    const sy = (v: number) => pad + (height - pad * 2) - ((v - lo) / (hi - lo || 1)) * (height - pad * 2);
    let d = "";
    data.forEach((v, i) => (d += `${i ? "L" : "M"}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`));
    const a = `${d}L${sx(n - 1).toFixed(1)},${height - pad}L${sx(0).toFixed(1)},${height - pad}Z`;
    const up = data[n - 1] >= data[0];
    const stroke = color ?? (tone === "neutral" ? "var(--s1)" : up ? "var(--good)" : "var(--bad)");
    return { d, a, endX: sx(n - 1), endY: sy(data[n - 1]), stroke };
  }, [data, width, height, color, tone]);
  if (!d) return <svg width={width} height={height} aria-hidden />;
  return (
    <svg width={width} height={height} aria-hidden style={{ display: "block", overflow: "visible" }}>
      {area && <path d={a} fill={stroke} opacity={0.1} />}
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={endX} cy={endY} r={2.6} fill={stroke} stroke="var(--chart-surface)" strokeWidth={1.5} />
    </svg>
  );
}
