import { useMemo, useState } from "react";
import { Slider, StatTile, Toggle } from "@/components/ui";
import { LineChart, type LineSeries } from "@/components/charts/LineChart";
import { money, pct } from "@/lib/format";

export function Inflation({ amount = 10000, years = 20, inflation = 3 }: { amount?: number; years?: number; inflation?: number }) {
  const [amt, setAmt] = useState(amount);
  const [yrs, setYrs] = useState(years);
  const [inf, setInf] = useState(inflation);
  const [compare, setCompare] = useState(false);

  const real = useMemo(() => Array.from({ length: yrs + 1 }, (_, y) => amt / Math.pow(1 + inf / 100, y)), [amt, yrs, inf]);
  const invested = useMemo(() => Array.from({ length: yrs + 1 }, (_, y) => (amt * Math.pow(1.06, y)) / Math.pow(1 + inf / 100, y)), [amt, yrs, inf]);
  const finalReal = real[yrs];
  const priceOf100 = 100 * Math.pow(1 + inf / 100, yrs);
  const x = real.map((_, i) => (i === 0 ? "Now" : `Yr ${i}`));

  const series: LineSeries[] = [{ id: "cash", label: "Cash under the mattress", data: real, area: true }];
  if (compare) series.push({ id: "inv", label: "Invested at 6% a year", data: invested });

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Slider label="Amount today" value={amt} min={100} max={100000} step={100} onChange={setAmt} format={(v) => money(v, "USD", { digits: 0 })} />
          <Slider label="Years" value={yrs} min={1} max={40} onChange={setYrs} format={(v) => `${v} yr`} />
          <Slider label="Yearly inflation" value={inf} min={0} max={15} step={0.5} onChange={setInf} format={(v) => `${v.toFixed(1)}%`} hint="Rich economies aim for about 2%. Georgia has seen years well above that." />
          <Toggle checked={compare} onChange={setCompare} label="Compare with investing at 6%" />
        </div>
        <div className="widget-outputs">
          <div className="widget-tiles">
            <StatTile hero label={`What ${money(amt, "USD", { digits: 0 })} will buy in ${yrs} years`} value={money(finalReal, "USD", { digits: 0 })} sub="in today's prices" />
            <StatTile label="Price of something costing 100 today" value={money(priceOf100, "USD", { digits: 0 })} />
            <StatTile label="Yearly loss of purchasing power" value={pct(-inf / 100, 1)} deltaTone="bad" />
            <StatTile label="Total purchasing power lost" value={pct(-(1 - finalReal / amt), 0)} deltaTone="bad" />
          </div>
          <LineChart x={x} series={series} yFormat={(v) => money(v, "USD", { compact: v >= 100000, digits: 0 })} includeZero height={230} ariaLabel="Purchasing power of cash over time, in today's money" />
        </div>
      </div>
      <p className="widget-note">
        The number on your bank statement does not change; what it <strong>buys</strong> does. This is why cash is for emergencies and near-term spending, and why long-term savings need a return above inflation just to stand still.
      </p>
    </div>
  );
}
