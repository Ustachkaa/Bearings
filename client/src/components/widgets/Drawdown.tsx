import { useState } from "react";
import { Slider, StatTile } from "@/components/ui";
import { BarChart } from "@/components/charts/Bars";
import { money, pct } from "@/lib/format";
import { recoveryNeeded } from "./math";

const STEPS = [10, 20, 30, 50, 70, 90];

export function Drawdown({ drop = 30 }: { drop?: number }) {
  const [d, setD] = useState(drop);
  const need = recoveryNeeded(d / 100);
  const after = 1000 * (1 - d / 100);

  const items = STEPS.map((s) => ({
    label: `−${s}%`,
    value: recoveryNeeded(s / 100) * 100,
    color: s === d ? "var(--brass)" : "var(--s1)",
    sub: `needs +${Math.round(recoveryNeeded(s / 100) * 100)}% to recover`,
  }));
  if (!STEPS.includes(d)) items.push({ label: `−${d}%`, value: need * 100, color: "var(--brass)", sub: "your selection" });
  items.sort((a, b) => a.value - b.value);

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Slider label="Size of the fall" value={d} min={5} max={95} step={5} onChange={setD} format={(v) => `−${v}%`} />
        </div>
        <div className="widget-outputs">
          <div className="widget-tiles">
            <StatTile hero label="Gain needed to recover" value={pct(need, 0)} sub={`${d}% ÷ (100% − ${d}%)`} />
            <StatTile label="1,000 becomes" value={money(after, "USD", { digits: 0 })} deltaTone="bad" />
            <StatTile label="…then needs to grow by" value={money(1000 - after, "USD", { digits: 0 })} sub={`${pct(need, 0)} of ${money(after, "USD", { digits: 0 })}`} />
          </div>
          <BarChart items={items} format={(v) => `+${Math.round(v)}%`} ariaLabel="Gain required to recover from falls of different sizes" labelWidth={64} />
        </div>
      </div>
      <p className="widget-note">
        Losses and gains are not symmetric. A fall of half needs a doubling just to get back to zero. This is why <strong>avoiding permanent losses matters more than chasing the biggest gains</strong>: a broad fund that falls 30% in a bad year historically recovers; a single company that falls 90% often does not.
      </p>
    </div>
  );
}
