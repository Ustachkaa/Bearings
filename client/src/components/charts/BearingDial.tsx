import type { Stance } from "@/lib/types";
import "./charts.css";

const ZONES: { stance: Stance; from: number; to: number; label: string; color: string }[] = [
  { stance: "caution", from: -4, to: -1, label: "Caution", color: "var(--stance-caution)" },
  { stance: "patience", from: -1, to: 0.5, label: "Patience", color: "var(--stance-patience)" },
  { stance: "steady", from: 0.5, to: 2, label: "Steady", color: "var(--stance-steady)" },
  { stance: "accumulate", from: 2, to: 4, label: "Accumulate", color: "var(--stance-accumulate)" },
];

const toAngle = (score: number) => 180 - ((Math.max(-4, Math.min(4, score)) + 4) / 8) * 180; // degrees, 180=left, 0=right
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
};
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  const large = Math.abs(a0 - a1) > 180 ? 1 : 0;
  return `M${p0.x.toFixed(2)},${p0.y.toFixed(2)}A${r},${r} 0 ${large} 1 ${p1.x.toFixed(2)},${p1.y.toFixed(2)}`;
}

/** The Bearings dial: a semicircular gauge from Caution to Accumulate with a needle at the composite score. */
export function BearingDial({ score, stance, headline, size = 300 }: { score: number; stance: Stance; headline: string; size?: number }) {
  const w = size;
  const h = size * 0.56;
  const cx = w / 2;
  const cy = h - 14;
  const r = w / 2 - 52;
  const needleAngle = toAngle(score);
  return (
    <div className="dial">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Stance: ${headline} (score ${score > 0 ? "+" : ""}${score})`}>
        {ZONES.map((z) => {
          const a0 = toAngle(z.from);
          const a1 = toAngle(z.to);
          const active = z.stance === stance;
          // shave a small gap between zones
          const gap = 1.6;
          const mid = polar(cx, cy, r + 24, (a0 + a1) / 2);
          return (
            <g key={z.stance}>
              <path d={arc(cx, cy, r, a0 - gap, a1 + gap)} stroke={z.color} strokeWidth={active ? 18 : 12} fill="none" opacity={active ? 0.95 : 0.28} strokeLinecap="butt" />
              <text className={`dial-zone-label ${active ? "active" : ""}`} x={mid.x} y={mid.y + 3} textAnchor="middle">
                {z.label}
              </text>
            </g>
          );
        })}
        {/* ticks at zone boundaries */}
        {[-1, 0.5, 2].map((b) => {
          const a = toAngle(b);
          const p0 = polar(cx, cy, r - 14, a);
          const p1 = polar(cx, cy, r - 20, a);
          return <line key={b} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="var(--ink-3)" strokeWidth={1.2} />;
        })}
        {/* needle */}
        <g className="dial-needle" style={{ transform: `rotate(${90 - needleAngle}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
          <path d={`M${cx - 5},${cy} L${cx},${cy - (r - 6)} L${cx + 5},${cy} Z`} fill="var(--brass)" />
          <path d={`M${cx - 5},${cy} L${cx},${cy + 10} L${cx + 5},${cy} Z`} fill="var(--ink-3)" />
        </g>
        <circle cx={cx} cy={cy} r={7} fill="var(--bg-ink)" stroke="var(--brass-2)" strokeWidth={2} />
      </svg>
      <div className="dial-headline">{headline}</div>
      <div className="dial-score">
        score {score > 0 ? "+" : ""}
        {score.toFixed(1)} of ±4
      </div>
    </div>
  );
}
