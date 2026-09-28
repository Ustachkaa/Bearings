import { useMemo, useState } from "react";
import { Slider, StatTile } from "@/components/ui";
import { LineChart } from "@/components/charts/LineChart";
import { money, pct } from "@/lib/format";
import { yearlyPath } from "./math";

export function FeeDrag({ initial = 0, monthly = 200, years = 30, rate = 7, feeA = 0.2, feeB = 1.5 }: { initial?: number; monthly?: number; years?: number; rate?: number; feeA?: number; feeB?: number }) {
  const [init, setInit] = useState(initial);
  const [mo, setMo] = useState(monthly);
  const [yrs, setYrs] = useState(years);
  const [r, setR] = useState(rate);
  const [fa, setFa] = useState(feeA);
  const [fb, setFb] = useState(feeB);

  const a = useMemo(() => yearlyPath(init, mo, yrs, (r - fa) / 100), [init, mo, yrs, r, fa]);
  const b = useMemo(() => yearlyPath(init, mo, yrs, (r - fb) / 100), [init, mo, yrs, r, fb]);
  const finalA = a.value[yrs];
  const finalB = b.value[yrs];
  const cost = finalA - finalB;
  const lostShare = finalA > 0 ? cost / finalA : 0;
  const x = a.value.map((_, i) => (i === 0 ? "Now" : `Yr ${i}`));
  const labelA = `${fa.toFixed(2)}% fee fund`;
  const labelB = `${fb.toFixed(2)}% fee fund`;

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Slider label="Starting amount" value={init} min={0} max={50000} step={500} onChange={setInit} format={(v) => money(v, "USD", { digits: 0 })} />
          <Slider label="Monthly contribution" value={mo} min={0} max={2000} step={10} onChange={setMo} format={(v) => money(v, "USD", { digits: 0 })} />
          <Slider label="Years" value={yrs} min={1} max={50} onChange={setYrs} format={(v) => `${v} yr`} />
          <Slider label="Return before fees" value={r} min={0} max={15} step={0.5} onChange={setR} format={(v) => `${v.toFixed(1)}%`} />
          <Slider label="Low fee (yearly)" value={fa} min={0} max={3} step={0.05} onChange={setFa} format={(v) => `${v.toFixed(2)}%`} />
          <Slider label="High fee (yearly)" value={fb} min={0} max={3} step={0.05} onChange={setFb} format={(v) => `${v.toFixed(2)}%`} />
        </div>
        <div className="widget-outputs">
          <div className="widget-tiles">
            <StatTile hero label="Cost of the higher fee" value={money(Math.abs(cost), "USD", { digits: 0 })} sub={`${pct(Math.abs(lostShare), 0, false)} of the final pot`} />
            <StatTile label={`Final value at ${fa.toFixed(2)}%`} value={money(finalA, "USD", { digits: 0 })} />
            <StatTile label={`Final value at ${fb.toFixed(2)}%`} value={money(finalB, "USD", { digits: 0 })} />
            <StatTile label="Total you put in" value={money(a.putIn[yrs], "USD", { digits: 0 })} />
          </div>
          <LineChart
            x={x}
            series={[
              { id: "a", label: labelA, data: a.value, area: true },
              { id: "b", label: labelB, data: b.value },
            ]}
            yFormat={(v) => money(v, "USD", { compact: v >= 100000, digits: 0 })}
            includeZero
            height={240}
            ariaLabel="Portfolio value under a low fee versus a high fee, year by year"
          />
        </div>
      </div>
      <p className="widget-note">
        A fee is taken from your pot every year, so it <strong>compounds against you</strong> exactly as returns compound for you. The difference looks tiny on a statement (1.3% a year) and enormous after decades. Look for the expense ratio (TER) before you buy any fund.
      </p>
    </div>
  );
}
