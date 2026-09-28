import { useState } from "react";
import { Badge, Callout, Field, NumberInput, Slider, StatTile } from "@/components/ui";
import { money, num, pct } from "@/lib/format";

function band(pe: number): { label: string; tone: "good" | "info" | "warn" | "bad" } {
  if (pe < 12) return { label: "Cheap, or troubled", tone: "good" };
  if (pe <= 20) return { label: "Reasonable", tone: "info" };
  if (pe <= 35) return { label: "Growth premium", tone: "warn" };
  return { label: "Priced for perfection", tone: "bad" };
}

const SECTORS = [
  ["Banks", "8 to 14"],
  ["Utilities", "12 to 18"],
  ["Consumer staples", "18 to 25"],
  ["Software", "25 to 45"],
  ["High-growth tech", "40 and up"],
];

export function Pe({ price = 150, eps = 6 }: { price?: number; eps?: number }) {
  const [p, setP] = useState(price);
  const [e, setE] = useState(eps);
  const [g, setG] = useState(10);
  const valid = p > 0 && e > 0;
  const pe = valid ? p / e : NaN;
  const fwd = valid ? p / (e * (1 + g / 100)) : NaN;
  const b = valid ? band(pe) : null;

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Field label="Share price">
            <NumberInput value={p} onChange={setP} min={0} step={1} prefix="$" />
          </Field>
          <Field label="Earnings per share (last 12 months)" hint="Profit divided by the number of shares. Negative means the company lost money.">
            <NumberInput value={e} onChange={setE} step={0.1} prefix="$" />
          </Field>
          <Slider label="Expected profit growth next year" value={g} min={-30} max={60} step={1} onChange={setG} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
        </div>
        <div className="widget-outputs">
          {!valid ? (
            <Callout tone="warn" title="No P/E: the company loses money">
              With earnings at or below zero there is nothing to divide by. Loss-making companies can still be good investments, but you are betting on future profits that do not exist yet.
            </Callout>
          ) : (
            <>
              <div className="widget-tiles">
                <StatTile hero label="P/E ratio" value={num(pe, 1)} sub={`${money(p, "USD")} ÷ ${money(e, "USD")}`}>
                  <div style={{ marginTop: 6 }}>{b && <Badge tone={b.tone} dot>{b.label}</Badge>}</div>
                </StatTile>
                <StatTile label="Earnings yield" value={pct(1 / pe, 1, false)} sub="profit per $ of price" />
                <StatTile label="Years of profit to pay back the price" value={`${num(pe, 1)} yr`} sub="if profits stayed flat" />
                <StatTile label={`Forward P/E at ${g > 0 ? "+" : ""}${g}% growth`} value={num(fwd, 1)} sub={`${money(p, "USD")} ÷ ${money(e * (1 + g / 100), "USD")}`} />
              </div>
            </>
          )}
          <table className="widget-table">
            <thead>
              <tr>
                <th>Sector</th>
                <th className="num">Typical P/E</th>
              </tr>
            </thead>
            <tbody>
              {SECTORS.map(([s, r]) => (
                <tr key={s}>
                  <td>{s}</td>
                  <td className="num">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="widget-caption">Rough ranges that change over time. Compare a company with its own sector, not with the whole market.</div>
        </div>
      </div>
      <p className="widget-note">
        P/E answers one question: <strong>how many years of today's profit am I paying for?</strong> A high number is not automatically bad (it can mean fast growth is expected) and a low number is not automatically good (it can mean the market expects profits to shrink). Ask which story fits.
      </p>
    </div>
  );
}
