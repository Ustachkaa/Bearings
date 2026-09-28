import { useState } from "react";
import { Badge, Slider, StatTile } from "@/components/ui";
import { BarChart } from "@/components/charts/Bars";
import { money } from "@/lib/format";

function band(v: number): { label: string; tone: "good" | "info" | "warn" | "bad" } {
  if (v < 15) return { label: "Calm", tone: "good" };
  if (v < 30) return { label: "Normal", tone: "info" };
  if (v < 60) return { label: "Bumpy", tone: "warn" };
  return { label: "Wild", tone: "bad" };
}

const REF = [10, 18, 30, 60];

export function Volatility({ vol = 18, amount = 10000 }: { vol?: number; amount?: number }) {
  const [v, setV] = useState(vol);
  const [amt, setAmt] = useState(amount);
  const monthly = (amt * v) / 100 / Math.sqrt(12);
  const yearly = (amt * v) / 100;
  const b = band(v);

  const items = REF.map((r) => ({ label: `${r}% vol`, value: (amt * r) / 100 / Math.sqrt(12), color: r === v ? "var(--brass)" : "var(--s1)" }));
  if (!REF.includes(v)) items.push({ label: `${v}% vol`, value: monthly, color: "var(--brass)" });
  items.sort((a, b2) => a.value - b2.value);

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Slider label="Yearly volatility" value={v} min={5} max={120} step={1} onChange={setV} format={(x) => `${x}%`} hint="Broad stock funds sit around 15 to 20%. Bitcoin is often 60 to 100%." />
          <Slider label="Amount invested" value={amt} min={1000} max={200000} step={1000} onChange={setAmt} format={(x) => money(x, "USD", { digits: 0 })} />
        </div>
        <div className="widget-outputs">
          <div className="widget-tiles">
            <StatTile hero label="Typical monthly swing" value={`±${money(monthly, "USD", { digits: 0 })}`} sub={`${v}% ÷ √12 = ${(v / Math.sqrt(12)).toFixed(1)}% a month`}>
              <div style={{ marginTop: 6 }}>
                <Badge tone={b.tone} dot>
                  {b.label}
                </Badge>
              </div>
            </StatTile>
            <StatTile label="Typical yearly swing" value={`±${money(yearly, "USD", { digits: 0 })}`} />
            <StatTile label="A bad month (about 2 in 100)" value={`−${money(2 * monthly, "USD", { digits: 0 })}`} sub="two standard deviations" deltaTone="bad" />
            <StatTile label="A bad year (about 2 in 100)" value={`−${money(2 * yearly, "USD", { digits: 0 })}`} sub="two standard deviations" deltaTone="bad" />
          </div>
          <BarChart items={items} format={(x) => `±${money(x, "USD", { digits: 0 })}`} ariaLabel="Typical monthly swing for different volatility levels" labelWidth={80} />
        </div>
      </div>
      <p className="widget-note">
        Volatility is the size of the swings, not the direction. A "typical" swing is one standard deviation: roughly two months in three land inside it, and about one month in fifty lands beyond twice that. If the bad-month figure would make you sell, <strong>the position is too big</strong>, not the market too scary.
      </p>
    </div>
  );
}
