import { useMemo, useState } from "react";
import { Slider, StatTile } from "@/components/ui";
import { BarChart } from "@/components/charts/Bars";
import { money, num } from "@/lib/format";
import { yearsToDoubleExact, yearsToDoubleRule72 } from "./math";

export function Rule72({ rate = 7 }: { rate?: number }) {
  const [r, setR] = useState(rate);
  const approx = yearsToDoubleRule72(r);
  const exact = yearsToDoubleExact(r / 100);

  const doublings = useMemo(() => {
    const out: { year: number; value: number }[] = [];
    let v = 1000;
    let y = 0;
    while (y <= 40 && out.length < 8) {
      out.push({ year: y, value: v });
      v *= 2;
      y += exact;
    }
    return out;
  }, [exact]);

  const bars = [10, 20, 30, 40].map((y) => ({ label: `Year ${y}`, value: 1000 * Math.pow(1 + r / 100, y) }));

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Slider label="Yearly return" value={r} min={1} max={20} step={0.5} onChange={setR} format={(v) => `${v.toFixed(1)}%`} />
        </div>
        <div className="widget-outputs">
          <div className="widget-tiles">
            <StatTile hero label="Years to double (Rule of 72)" value={`${num(approx, 1)} yr`} sub={`72 ÷ ${r} = ${num(approx, 1)}`} />
            <StatTile label="Exact years to double" value={`${num(exact, 1)} yr`} sub="ln 2 ÷ ln(1 + rate)" />
            <StatTile label="1,000 becomes, after 40 years" value={money(1000 * Math.pow(1 + r / 100, 40), "USD", { digits: 0 })} />
          </div>
          <div>
            <div className="label" style={{ marginBottom: 8 }}>Doublings of 1,000 over 40 years</div>
            <div className="widget-timeline">
              {doublings.map((d) => (
                <div className="step" key={d.year}>
                  <div className="yr">{d.year === 0 ? "Start" : `Year ${num(d.year, 0)}`}</div>
                  <div className="val">{money(d.value, "USD", { digits: 0 })}</div>
                </div>
              ))}
            </div>
          </div>
          <BarChart items={bars} format={(v) => money(v, "USD", { digits: 0 })} ariaLabel="Value of 1,000 at years 10, 20, 30 and 40" labelWidth={70} />
        </div>
      </div>
      <p className="widget-note">
        The Rule of 72 is a mental shortcut: divide 72 by the yearly return to get the years it takes money to double. It is an approximation, closest between 6% and 10%, and the exact figure sits beside it. Each doubling adds more than all the previous ones combined.
      </p>
    </div>
  );
}
