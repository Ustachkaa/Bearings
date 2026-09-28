import { useMemo, useState } from "react";
import { Slider, StatTile } from "@/components/ui";
import { LineChart } from "@/components/charts/LineChart";
import { money, pct } from "@/lib/format";
import { yearlyPath } from "./math";

export function Compound({ initial = 1000, monthly = 100, years = 30, rate = 7 }: { initial?: number; monthly?: number; years?: number; rate?: number }) {
  const [init, setInit] = useState(initial);
  const [mo, setMo] = useState(monthly);
  const [yrs, setYrs] = useState(years);
  const [r, setR] = useState(rate);

  const path = useMemo(() => yearlyPath(init, mo, yrs, r / 100), [init, mo, yrs, r]);
  const final = path.value[yrs];
  const putIn = path.putIn[yrs];
  const growth = final - putIn;
  const share = final > 0 ? growth / final : 0;
  const x = path.value.map((_, i) => (i === 0 ? "Now" : `Year ${i}`));
  const fmt = (v: number) => money(v, "USD", { compact: v >= 100000 });

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Slider label="Starting amount" value={init} min={0} max={50000} step={100} onChange={setInit} format={(v) => money(v, "USD", { digits: 0 })} />
          <Slider label="Monthly contribution" value={mo} min={0} max={2000} step={10} onChange={setMo} format={(v) => money(v, "USD", { digits: 0 })} />
          <Slider label="Years" value={yrs} min={1} max={50} onChange={setYrs} format={(v) => `${v} yr`} />
          <Slider label="Average yearly return" value={r} min={0} max={15} step={0.5} onChange={setR} format={(v) => `${v.toFixed(1)}%`} hint="Broad stock funds have averaged roughly 7 to 10% a year over long periods, with big swings along the way." />
        </div>
        <div className="widget-outputs">
          <div className="widget-tiles">
            <StatTile hero label={`Final value after ${yrs} years`} value={money(final, "USD", { digits: 0 })} />
            <StatTile label="You put in" value={money(putIn, "USD", { digits: 0 })} />
            <StatTile label="Growth earned" value={money(growth, "USD", { digits: 0 })} deltaTone={growth >= 0 ? "good" : "bad"} />
            <StatTile label="Share of the pot that is growth" value={pct(share, 0, false)} />
          </div>
          <LineChart
            x={x}
            series={[
              { id: "value", label: "Portfolio value", data: path.value, area: true },
              { id: "putIn", label: "Money put in", data: path.putIn, muted: true },
            ]}
            yFormat={fmt}
            xFormat={(v) => v.replace("Year ", "Yr ")}
            includeZero
            height={240}
            ariaLabel="Portfolio value versus money put in, year by year"
          />
        </div>
      </div>
      <p className="widget-note">
        Notice the gap between the two lines widening over time. Early on, almost everything you have is money you put in. Later, most of it is growth on growth: <strong>compounding accelerates</strong>, which is why starting early matters more than starting big.
      </p>
    </div>
  );
}
