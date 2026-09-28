import { useMemo, useState } from "react";
import { ErrorNote, Skeleton, StatTile, Tabs } from "@/components/ui";
import { LineChart } from "@/components/charts/LineChart";
import { useHistory } from "@/lib/queries";
import { dateLong, money, pct } from "@/lib/format";
import type { HistoryRange } from "@/lib/types";
import { maxDrawdown } from "./math";
import { SymbolInput } from "./SymbolInput";

const RANGES: { id: HistoryRange; label: string }[] = [
  { id: "1mo", label: "1m" },
  { id: "3mo", label: "3m" },
  { id: "6mo", label: "6m" },
  { id: "1y", label: "1y" },
  { id: "2y", label: "2y" },
  { id: "5y", label: "5y" },
  { id: "10y", label: "10y" },
  { id: "max", label: "Max" },
];

export function LiveChart({ symbol = "VOO", range = "1y" }: { symbol?: string; range?: HistoryRange }) {
  const [sym, setSym] = useState(symbol.toUpperCase());
  const [rng, setRng] = useState<HistoryRange>(range);
  const q = useHistory(sym, rng);
  const candles = q.data;

  const calc = useMemo(() => {
    if (!candles || candles.length === 0) return null;
    const closes = candles.map((c) => c.close);
    let hiIdx = 0;
    let loIdx = 0;
    closes.forEach((v, i) => {
      if (v > closes[hiIdx]) hiIdx = i;
      if (v < closes[loIdx]) loIdx = i;
    });
    return {
      x: candles.map((c) => c.date),
      closes,
      change: closes[closes.length - 1] / closes[0] - 1,
      hi: { v: closes[hiIdx], d: candles[hiIdx].date },
      lo: { v: closes[loIdx], d: candles[loIdx].date },
      mdd: maxDrawdown(closes),
    };
  }, [candles]);

  const cur = "USD";
  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <SymbolInput value={sym} onCommit={setSym} />
          <div className="field">
            <label>Period</label>
            <Tabs tabs={RANGES} value={rng} onChange={setRng} />
          </div>
        </div>
        <div className={`widget-outputs ${q.isFetching && calc ? "faded" : ""}`}>
          {q.isError && <ErrorNote error={q.error} retry={() => q.refetch()} />}
          {!calc && !q.isError && (
            <>
              <Skeleton h={54} w={200} />
              <Skeleton h={260} />
            </>
          )}
          {calc && (
            <>
              <div className="widget-tiles">
                <StatTile hero label="Change over the period" value={pct(calc.change, 1)} deltaTone={calc.change >= 0 ? "good" : "bad"} sub={`${money(calc.closes[0], cur)} to ${money(calc.closes[calc.closes.length - 1], cur)}`} />
                <StatTile label="Highest close" value={money(calc.hi.v, cur)} sub={dateLong(calc.hi.d)} />
                <StatTile label="Lowest close" value={money(calc.lo.v, cur)} sub={dateLong(calc.lo.d)} />
                <StatTile label="Biggest fall from a peak" value={pct(calc.mdd, 1)} deltaTone="bad" sub="peak to trough inside this period" />
              </div>
              <LineChart x={calc.x} series={[{ id: "p", label: `${sym} close`, data: calc.closes, area: true }]} yFormat={(v) => money(v, cur, { digits: v < 10 ? 3 : 0 })} height={270} ariaLabel={`${sym} closing price over ${rng}`} />
            </>
          )}
        </div>
      </div>
      <p className="widget-note">
        Try switching between <strong>1m</strong> and <strong>10y</strong> for the same ticker. Over a month the line looks like a heart monitor; over a decade the same asset is a slope with a few bumps. One day tells you about mood, ten years tell you about the business.
      </p>
    </div>
  );
}
