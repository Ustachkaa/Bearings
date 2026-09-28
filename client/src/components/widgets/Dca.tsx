import { useState } from "react";
import { Callout, ErrorNote, Skeleton, Slider, StatTile, Tabs } from "@/components/ui";
import { LineChart } from "@/components/charts/LineChart";
import { useDca } from "@/lib/queries";
import { dateLong, money, num, pct } from "@/lib/format";
import type { HistoryRange } from "@/lib/types";
import { SymbolInput } from "./SymbolInput";

type Range = "5y" | "10y" | "max";

export function Dca({ symbol = "VOO", monthly = 100, range = "10y" }: { symbol?: string; monthly?: number; range?: Range }) {
  const [sym, setSym] = useState(symbol.toUpperCase());
  const [mo, setMo] = useState(monthly);
  const [rng, setRng] = useState<Range>(range);
  const q = useDca(sym, mo, rng as HistoryRange);
  const d = q.data;
  const cur = "USD";

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <SymbolInput value={sym} onCommit={setSym} />
          <Slider label="Invested every month" value={mo} min={10} max={2000} step={10} onChange={setMo} format={(v) => money(v, cur, { digits: 0 })} />
          <div className="field">
            <label>Period</label>
            <Tabs tabs={[{ id: "5y", label: "5 years" }, { id: "10y", label: "10 years" }, { id: "max", label: "All history" }]} value={rng} onChange={setRng} />
          </div>
        </div>
        <div className={`widget-outputs ${q.isFetching && d ? "faded" : ""}`}>
          {q.isError && <ErrorNote error={q.error} retry={() => q.refetch()} />}
          {!d && !q.isError && (
            <>
              <Skeleton h={54} w={220} />
              <Skeleton h={120} />
              <Skeleton h={220} />
            </>
          )}
          {d && (
            <>
              <div className="widget-tiles">
                <StatTile hero label="Worth today" value={money(d.finalValue, cur, { digits: 0 })} delta={pct(d.gainPct, 1)} deltaTone={d.gain >= 0 ? "good" : "bad"} />
                <StatTile label="You put in" value={money(d.totalInvested, cur, { digits: 0 })} sub={`${d.months} monthly purchases`} />
                <StatTile label="Gain" value={money(d.gain, cur, { digits: 0 })} deltaTone={d.gain >= 0 ? "good" : "bad"} />
                <StatTile label="Average price you paid" value={money(d.averagePrice, cur)} sub={`price today ${money(d.finalPrice, cur)}`} />
              </div>
              <LineChart
                x={d.points.map((p) => p.date)}
                series={[
                  { id: "value", label: "Value", data: d.points.map((p) => p.value), area: true },
                  { id: "in", label: "Money put in", data: d.points.map((p) => p.invested), muted: true },
                ]}
                yFormat={(v) => money(v, cur, { compact: v >= 100000, digits: 0 })}
                includeZero
                height={240}
                ariaLabel={`Value of investing ${money(mo, cur, { digits: 0 })} a month in ${sym} versus money put in`}
              />
              <Callout tone="note" title="Honest comparison with a lump sum">
                Putting the whole {money(d.totalInvested, cur, { digits: 0 })} in on day one would be worth {money(d.lumpSum.finalValue, cur, { digits: 0 })} today ({pct(d.lumpSum.gainPct, 0)}).
                {d.lumpSum.finalValue > d.finalValue ? " Lump sum usually wins on average, simply because markets rise more often than they fall. " : " This time the monthly approach came out ahead, which happens when prices dip after the start. "}
                Monthly investing wins on sleep, and it is what a salary actually allows. Your cheapest purchase was {money(d.bestBuy.price, cur)} on {dateLong(d.bestBuy.date)}, your dearest {money(d.worstBuy.price, cur)} on {dateLong(d.worstBuy.date)}, and you never had to guess which was coming.
              </Callout>
            </>
          )}
        </div>
      </div>
      <p className="widget-note">
        This replays real prices: on the first trading day of each month you buy {money(mo, cur, { digits: 0 })} worth of {sym}, more units when it is cheap and fewer when it is dear. {d?.cagr !== null && d?.cagr !== undefined ? `The money-weighted growth rate works out to roughly ${num(d.cagr * 100, 1)}% a year.` : ""} History does not repeat exactly, so read it as a lesson in habit, not a promise.
      </p>
    </div>
  );
}
