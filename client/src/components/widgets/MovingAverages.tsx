import { useMemo, useState } from "react";
import { Badge, ErrorNote, Skeleton, StatTile } from "@/components/ui";
import { LineChart } from "@/components/charts/LineChart";
import { useHistory } from "@/lib/queries";
import { dateLong, money, pct } from "@/lib/format";
import { lastCross, lastNonNull, sma } from "./math";
import { SymbolInput } from "./SymbolInput";

export function MovingAverages({ symbol = "MSFT" }: { symbol?: string }) {
  const [sym, setSym] = useState(symbol.toUpperCase());
  const q = useHistory(sym, "2y");
  const candles = q.data;

  const calc = useMemo(() => {
    if (!candles || candles.length === 0) return null;
    const closes = candles.map((c) => c.close);
    const s50 = sma(closes, 50);
    const s200 = sma(closes, 200);
    const price = closes[closes.length - 1];
    const sma50 = lastNonNull(s50);
    const sma200 = lastNonNull(s200);
    const cross = lastCross(s50, s200);
    return { closes, s50, s200, price, sma50, sma200, cross, x: candles.map((c) => c.date) };
  }, [candles]);

  const cur = "USD";
  const above200 = calc?.sma200 !== null && calc?.sma200 !== undefined ? calc.price >= calc.sma200 : null;
  const fiftyAbove = calc?.sma50 !== null && calc?.sma200 !== null && calc?.sma50 !== undefined && calc?.sma200 !== undefined ? calc.sma50 >= calc.sma200 : null;

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <SymbolInput value={sym} onCommit={setSym} />
          <div className="tiny muted">The 50-day average is the mean of the last 50 closes; the 200-day covers roughly a trading year. Both need history: the 200-day line appears only after 200 days of data.</div>
        </div>
        <div className={`widget-outputs ${q.isFetching && calc ? "faded" : ""}`}>
          {q.isError && <ErrorNote error={q.error} retry={() => q.refetch()} />}
          {!calc && !q.isError && (
            <>
              <Skeleton h={54} w={220} />
              <Skeleton h={260} />
            </>
          )}
          {calc && (
            <>
              <div className="widget-tiles">
                <StatTile hero label="Price vs 200-day average" value={calc.sma200 === null ? "n/a" : pct(calc.price / calc.sma200 - 1, 1)} sub={calc.sma200 === null ? "not enough history" : `${money(calc.price, cur)} vs ${money(calc.sma200, cur)}`}>
                  {above200 !== null && (
                    <div style={{ marginTop: 6 }}>
                      <Badge tone={above200 ? "good" : "warn"} dot>
                        {above200 ? "Above its long-term trend" : "Below its long-term trend"}
                      </Badge>
                    </div>
                  )}
                </StatTile>
                <StatTile
                  label="50-day vs 200-day"
                  value={fiftyAbove === null ? "n/a" : fiftyAbove ? "Above" : "Below"}
                  sub={calc.cross ? `last ${calc.cross.direction === "up" ? "golden" : "death"} cross ${dateLong(calc.x[calc.cross.index])}` : "no cross in this window"}
                />
                <StatTile label="Price vs 50-day average" value={calc.sma50 === null ? "n/a" : pct(calc.price / calc.sma50 - 1, 1)} />
              </div>
              <LineChart
                x={calc.x}
                series={[
                  { id: "price", label: "Price", data: calc.closes, area: true },
                  { id: "s50", label: "50-day average", data: calc.s50, color: "var(--s2)" },
                  { id: "s200", label: "200-day average", data: calc.s200, muted: true },
                ]}
                yFormat={(v) => money(v, cur, { digits: v < 10 ? 3 : 0 })}
                height={280}
                ariaLabel={`${sym} price with 50-day and 200-day moving averages over two years`}
              />
            </>
          )}
        </div>
      </div>
      <p className="widget-note">
        Above the 200-day line means the long march has been upward. For a <strong>broad fund</strong>, dipping below it is more of a discount than a danger: the whole market rarely stays down for long. For a <strong>single company</strong>, the same dip deserves homework, because a downtrend can reflect real problems and not just mood. A golden cross (50 over 200) is a slow, lagging sign that momentum turned positive.
      </p>
    </div>
  );
}
