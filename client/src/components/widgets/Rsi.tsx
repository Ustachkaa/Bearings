import { useMemo, useState } from "react";
import { Badge, ErrorNote, Skeleton, StatTile } from "@/components/ui";
import { LineChart } from "@/components/charts/LineChart";
import { useHistory } from "@/lib/queries";
import { money, num } from "@/lib/format";
import { lastNonNull, rsi14 } from "./math";
import { SymbolInput } from "./SymbolInput";

export function Rsi({ symbol = "BTC-USD" }: { symbol?: string }) {
  const [sym, setSym] = useState(symbol.toUpperCase());
  const q = useHistory(sym, "1y");
  const candles = q.data;

  const calc = useMemo(() => {
    if (!candles || candles.length === 0) return null;
    const closes = candles.map((c) => c.close);
    const r = rsi14(closes);
    return { x: candles.map((c) => c.date), r, today: lastNonNull(r), price: closes[closes.length - 1], daysBelow30: r.filter((v) => v !== null && v < 30).length, daysAbove70: r.filter((v) => v !== null && v > 70).length };
  }, [candles]);

  const state = calc?.today === null || calc?.today === undefined ? null : calc.today < 30 ? { label: "Oversold", tone: "good" as const } : calc.today > 70 ? { label: "Overbought", tone: "bad" as const } : { label: "Balanced", tone: "info" as const };

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <SymbolInput value={sym} onCommit={setSym} />
          <div className="tiny muted">RSI compares the size of recent up-days with recent down-days over 14 days and squeezes the answer into 0 to 100. Below 30 the selling has been intense; above 70 the buying has.</div>
        </div>
        <div className={`widget-outputs ${q.isFetching && calc ? "faded" : ""}`}>
          {q.isError && <ErrorNote error={q.error} retry={() => q.refetch()} />}
          {!calc && !q.isError && (
            <>
              <Skeleton h={54} w={200} />
              <Skeleton h={220} />
            </>
          )}
          {calc && (
            <>
              <div className="widget-tiles">
                <StatTile hero label="RSI today" value={calc.today === null ? "n/a" : num(calc.today, 0)} sub={`price ${money(calc.price, "USD")}`}>
                  {state && (
                    <div style={{ marginTop: 6 }}>
                      <Badge tone={state.tone} dot>
                        {state.label}
                      </Badge>
                    </div>
                  )}
                </StatTile>
                <StatTile label="Days oversold in the past year" value={String(calc.daysBelow30)} sub="RSI under 30" />
                <StatTile label="Days overbought in the past year" value={String(calc.daysAbove70)} sub="RSI over 70" />
              </div>
              <LineChart
                x={calc.x}
                series={[{ id: "rsi", label: "RSI (14)", data: calc.r }]}
                refLines={[
                  { value: 70, label: "Overbought" },
                  { value: 30, label: "Oversold" },
                ]}
                yFormat={(v) => String(Math.round(v))}
                height={230}
                ariaLabel={`14-day RSI of ${sym} over the past year with oversold and overbought lines`}
              />
            </>
          )}
        </div>
      </div>
      <p className="widget-note">
        Treat RSI as a <strong>nudge for timing extra contributions</strong>, not a command. Oversold can stay oversold for weeks in a real downtrend, and overbought assets often keep rising. Your regular monthly plan continues whatever this line says.
      </p>
    </div>
  );
}
