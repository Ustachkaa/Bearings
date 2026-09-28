import { useState } from "react";
import { ErrorNote, Field, NumberInput, Select, Skeleton, StatTile } from "@/components/ui";
import { useQuote } from "@/lib/queries";
import { money, num } from "@/lib/format";

const CURRENCIES = ["GEL", "USD", "EUR", "GBP"];
const OPTIONS = CURRENCIES.map((c) => ({ value: c, label: c }));

function pairSymbol(from: string, to: string): { symbol: string; invert: boolean } | null {
  if (from === to) return null;
  if (from === "USD") return { symbol: `${to}=X`, invert: false };
  if (to === "USD") return { symbol: `${from}=X`, invert: true };
  return { symbol: `${from}${to}=X`, invert: false };
}

export function Currency({ amount = 1000, from = "GEL", to = "USD" }: { amount?: number; from?: string; to?: string }) {
  const [amt, setAmt] = useState(amount);
  const [f, setF] = useState(CURRENCIES.includes(from) ? from : "GEL");
  const [t, setT] = useState(CURRENCIES.includes(to) ? to : "USD");
  const pair = pairSymbol(f, t);
  const q = useQuote(pair?.symbol);
  const gel = useQuote("GEL=X");

  const rate = pair === null ? 1 : q.data ? (pair.invert ? 1 / q.data.price : q.data.price) : null;
  const converted = rate === null ? null : amt * rate;
  const usdGel = gel.data?.price ?? null;

  return (
    <div className="widget">
      <div className="widget-grid">
        <div className="widget-inputs">
          <Field label="Amount">
            <NumberInput value={amt} onChange={setAmt} min={0} step={10} />
          </Field>
          <Field label="From">
            <Select value={f} onChange={setF} options={OPTIONS} />
          </Field>
          <Field label="To">
            <Select value={t} onChange={setT} options={OPTIONS} />
          </Field>
        </div>
        <div className="widget-outputs">
          {pair && q.isError && <ErrorNote error={q.error} retry={() => q.refetch()} />}
          {pair && !q.data && !q.isError ? (
            <Skeleton h={60} w={260} />
          ) : (
            <div className="widget-tiles">
              <StatTile hero label={`${money(amt, f, { digits: 0 })} is worth`} value={converted === null ? "…" : money(converted, t)} sub={rate === null ? "" : `1 ${f} = ${num(rate, 4)} ${t}`} />
              <StatTile label="Reverse rate" value={rate === null ? "…" : `1 ${t} = ${num(1 / rate, 4)} ${f}`} sub="live from Yahoo Finance" />
            </div>
          )}
          {usdGel !== null && (
            <>
              <table className="widget-table">
                <thead>
                  <tr>
                    <th>If GEL moves against USD</th>
                    <th className="num">USD / GEL rate</th>
                    <th className="num">1,000 USD in GEL</th>
                  </tr>
                </thead>
                <tbody>
                  {[-20, -10, -5, 0, 5, 10, 20].map((m) => {
                    // GEL strengthening by m% means one USD buys m% fewer GEL.
                    const r = usdGel / (1 + m / 100);
                    return (
                      <tr key={m} className={m === 0 ? "hl" : ""}>
                        <td>{m === 0 ? "Today" : m > 0 ? `GEL strengthens ${m}%` : `GEL weakens ${Math.abs(m)}%`}</td>
                        <td className="num">{num(r, 3)}</td>
                        <td className="num">{money(1000 * r, "GEL", { digits: 0 })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="widget-caption">Your USD investments look smaller in GEL when the lari strengthens, and larger when it weakens, even if nothing happened in the market.</div>
            </>
          )}
        </div>
      </div>
      <p className="widget-note">
        A Georgian investor carries <strong>three layers</strong> of currency exposure: a salary in GEL, an account in USD or EUR, and underlying companies that earn in dozens of currencies. A world fund already spreads the third layer. For a horizon of ten years or more, most people simply accept the first two and do not hedge.
      </p>
    </div>
  );
}
