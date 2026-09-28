import { useState } from "react";
import { Slider, StatTile } from "@/components/ui";
import { StackedBar } from "@/components/charts/Bars";
import { pct } from "@/lib/format";

const ASSUME = {
  stocks: { ret: 0.08, vol: 0.16 },
  bonds: { ret: 0.035, vol: 0.05 },
  cash: { ret: 0.02, vol: 0.005 },
};

type Mix = { stocks: number; bonds: number; cash: number };

/** Move one slider and scale the other two so the total stays 100. */
function rebalance(mix: Mix, key: keyof Mix, value: number): Mix {
  const v = Math.max(0, Math.min(100, value));
  const others = (Object.keys(mix) as (keyof Mix)[]).filter((k) => k !== key);
  const otherTotal = others.reduce((a, k) => a + mix[k], 0);
  const remaining = 100 - v;
  const next: Mix = { ...mix, [key]: v };
  if (otherTotal <= 0) {
    next[others[0]] = remaining;
    next[others[1]] = 0;
  } else {
    next[others[0]] = Math.round((mix[others[0]] / otherTotal) * remaining);
    next[others[1]] = remaining - next[others[0]];
  }
  return next;
}

export function Allocation({ stocks = 80, bonds = 15, cash = 5 }: { stocks?: number; bonds?: number; cash?: number }) {
  const total = stocks + bonds + cash || 100;
  const [mix, setMix] = useState<Mix>({ stocks: Math.round((stocks / total) * 100), bonds: Math.round((bonds / total) * 100), cash: 100 - Math.round((stocks / total) * 100) - Math.round((bonds / total) * 100) });

  const w = { stocks: mix.stocks / 100, bonds: mix.bonds / 100, cash: mix.cash / 100 };
  const ret = w.stocks * ASSUME.stocks.ret + w.bonds * ASSUME.bonds.ret + w.cash * ASSUME.cash.ret;
  // Treat the assets as independent (a simplification that slightly understates risk).
  const vol = Math.sqrt((w.stocks * ASSUME.stocks.vol) ** 2 + (w.bonds * ASSUME.bonds.vol) ** 2 + (w.cash * ASSUME.cash.vol) ** 2);
  const worst = ret - 2 * vol;
  const suits = mix.stocks >= 85 ? "Adventurous: a horizon of 15+ years and a calm stomach." : mix.stocks >= 65 ? "Growth: a horizon of 10+ years and room to ride out bad years." : mix.stocks >= 45 ? "Balanced: medium horizons or people who dislike big swings." : "Cautious: short horizons or money you will need within a few years.";

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Slider label="Stocks" value={mix.stocks} min={0} max={100} onChange={(v) => setMix((m) => rebalance(m, "stocks", v))} format={(v) => `${v}%`} />
          <Slider label="Bonds" value={mix.bonds} min={0} max={100} onChange={(v) => setMix((m) => rebalance(m, "bonds", v))} format={(v) => `${v}%`} />
          <Slider label="Cash" value={mix.cash} min={0} max={100} onChange={(v) => setMix((m) => rebalance(m, "cash", v))} format={(v) => `${v}%`} />
        </div>
        <div className="widget-outputs">
          <StackedBar
            segments={[
              { label: "Stocks", value: mix.stocks, color: "var(--s1)" },
              { label: "Bonds", value: mix.bonds, color: "var(--s3)" },
              { label: "Cash", value: mix.cash, color: "var(--s2)" },
            ]}
            format={(v) => `${v.toFixed(0)}%`}
            ariaLabel="Portfolio mix of stocks, bonds and cash"
          />
          <div className="widget-tiles">
            <StatTile hero label="Expected yearly return" value={pct(ret, 1, false)} sub="long-run average, not any single year" />
            <StatTile label="Typical yearly swing" value={`±${pct(vol, 1, false)}`} />
            <StatTile label="Rough worst year (2 in 100)" value={pct(worst, 0)} deltaTone={worst < 0 ? "bad" : "good"} />
            <StatTile label="Who this suits" value={<span style={{ fontSize: "1rem", fontWeight: 500, lineHeight: 1.35 }}>{suits}</span>} />
          </div>
        </div>
      </div>
      <p className="widget-note">
        Assumptions: stocks 8% a year with 16% volatility, bonds 3.5% with 5%, cash 2% with almost none. Move the stock slider and watch return and swing rise together. <strong>You cannot raise the return without raising the swings</strong>; the only free lunch is spreading across many holdings within each slice.
      </p>
    </div>
  );
}
