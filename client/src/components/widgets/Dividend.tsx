import { useMemo, useState } from "react";
import { Slider, StatTile, Toggle } from "@/components/ui";
import { LineChart } from "@/components/charts/LineChart";
import { money } from "@/lib/format";

/**
 * Simple dividend model: price per share and dividend per share both grow at `growth`,
 * so the yield stays constant. Reinvesting buys more shares each year.
 */
function simulate(amount: number, yieldPct: number, growth: number, years: number, reinvest: boolean) {
  const y = yieldPct / 100;
  const g = growth / 100;
  let shares = amount; // price starts at $1 per share
  let price = 1;
  let dps = y; // dividend per share
  const income: number[] = [];
  let total = 0;
  for (let t = 1; t <= years; t++) {
    const cash = shares * dps;
    income.push(cash);
    total += cash;
    if (reinvest) shares += cash / price;
    price *= 1 + g;
    dps *= 1 + g;
  }
  return { income, total, value: shares * price };
}

export function Dividend({ amount = 10000, yieldPct = 3, growth = 5, years = 20 }: { amount?: number; yieldPct?: number; growth?: number; years?: number }) {
  const [amt, setAmt] = useState(amount);
  const [yl, setYl] = useState(yieldPct);
  const [gr, setGr] = useState(growth);
  const [yrs, setYrs] = useState(years);
  const [reinvest, setReinvest] = useState(true);

  const re = useMemo(() => simulate(amt, yl, gr, yrs, true), [amt, yl, gr, yrs]);
  const cash = useMemo(() => simulate(amt, yl, gr, yrs, false), [amt, yl, gr, yrs]);
  const chosen = reinvest ? re : cash;
  const x = re.income.map((_, i) => `Yr ${i + 1}`);

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Slider label="Amount invested" value={amt} min={1000} max={200000} step={1000} onChange={setAmt} format={(v) => money(v, "USD", { digits: 0 })} />
          <Slider label="Dividend yield" value={yl} min={0.5} max={10} step={0.1} onChange={setYl} format={(v) => `${v.toFixed(1)}%`} />
          <Slider label="Dividend growth per year" value={gr} min={0} max={15} step={0.5} onChange={setGr} format={(v) => `${v.toFixed(1)}%`} />
          <Slider label="Years" value={yrs} min={1} max={40} onChange={setYrs} format={(v) => `${v} yr`} />
          <Toggle checked={reinvest} onChange={setReinvest} label="Reinvest dividends" />
        </div>
        <div className="widget-outputs">
          <div className="widget-tiles">
            <StatTile hero label={`Yearly dividend income in year ${yrs}`} value={money(chosen.income[yrs - 1], "USD", { digits: 0 })} />
            <StatTile label="Income today (year 1)" value={money(chosen.income[0], "USD", { digits: 0 })} />
            <StatTile label="Total dividends collected" value={money(chosen.total, "USD", { digits: 0 })} />
            <StatTile label={`Portfolio value in year ${yrs}`} value={money(chosen.value, "USD", { digits: 0 })} />
          </div>
          <LineChart
            x={x}
            series={[
              { id: "re", label: "Reinvested", data: re.income, area: reinvest },
              { id: "cash", label: "Taken as cash", data: cash.income, muted: !reinvest ? false : true },
            ]}
            yFormat={(v) => money(v, "USD", { digits: 0 })}
            includeZero
            height={230}
            ariaLabel="Yearly dividend income when reinvested versus taken as cash"
          />
        </div>
      </div>
      <p className="widget-note">
        Assumption: the share price grows at the same rate as the dividend, so the yield stays put. Reinvested dividends buy more shares, which pay more dividends, which buy more shares. <strong>That loop is most of the long-run return of stock markets.</strong> Accumulating ETFs do the reinvesting for you.
      </p>
    </div>
  );
}
