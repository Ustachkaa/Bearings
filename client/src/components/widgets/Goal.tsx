import { useMemo, useState } from "react";
import { Field, NumberInput, Slider, StatTile } from "@/components/ui";
import { LineChart } from "@/components/charts/LineChart";
import { money } from "@/lib/format";
import { monthlyRate, pmt, yearlyPath } from "./math";

export function Goal({ target = 100000, years = 20, rate = 7, initial = 0 }: { target?: number; years?: number; rate?: number; initial?: number }) {
  const [tgt, setTgt] = useState(target);
  const [yrs, setYrs] = useState(years);
  const [r, setR] = useState(rate);
  const [init, setInit] = useState(initial);

  const mr = monthlyRate(r / 100);
  const monthly = pmt(tgt, init, yrs * 12, mr);
  const later = yrs > 5 ? pmt(tgt, init, (yrs - 5) * 12, mr) : null;
  const contributed = init + monthly * 12 * yrs;
  const growth = Math.max(0, tgt - contributed);
  const path = useMemo(() => yearlyPath(init, monthly, yrs, r / 100), [init, monthly, yrs, r]);
  const x = path.value.map((_, i) => (i === 0 ? "Now" : `Yr ${i}`));

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Field label="Goal amount">
            <NumberInput value={tgt} onChange={setTgt} min={100} step={1000} prefix="$" />
          </Field>
          <Field label="Already saved">
            <NumberInput value={init} onChange={setInit} min={0} step={100} prefix="$" />
          </Field>
          <Slider label="Years to reach it" value={yrs} min={1} max={50} onChange={setYrs} format={(v) => `${v} yr`} />
          <Slider label="Average yearly return" value={r} min={0} max={15} step={0.5} onChange={setR} format={(v) => `${v.toFixed(1)}%`} />
        </div>
        <div className="widget-outputs">
          <div className="widget-tiles">
            <StatTile hero label="Save per month" value={money(monthly, "USD", { digits: 0 })} sub={`to reach ${money(tgt, "USD", { digits: 0 })} in ${yrs} years`} />
            <StatTile label="Total you will contribute" value={money(contributed, "USD", { digits: 0 })} />
            <StatTile label="Growth does the rest" value={money(growth, "USD", { digits: 0 })} deltaTone="good" />
            <StatTile label="If you start 5 years later" value={later === null ? "n/a" : money(later, "USD", { digits: 0 })} sub={later === null ? "goal is under 5 years away" : "per month, for the same goal"} />
          </div>
          <LineChart
            x={x}
            series={[{ id: "pf", label: "Portfolio", data: path.value, area: true }]}
            refLines={[{ value: tgt, label: "Goal" }]}
            yFormat={(v) => money(v, "USD", { compact: v >= 100000, digits: 0 })}
            includeZero
            height={230}
            ariaLabel="Path of the portfolio towards the goal, year by year"
          />
        </div>
      </div>
      <p className="widget-note">
        This uses monthly compounding: each contribution earns the monthly slice of the yearly return from the moment it goes in. The "start later" tile is the real cost of waiting: <strong>the same goal, fewer years, a much bigger monthly number.</strong>
      </p>
    </div>
  );
}
