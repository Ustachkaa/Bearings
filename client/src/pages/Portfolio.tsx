import { useState } from "react";
import { Link } from "react-router-dom";
import { usePortfolio, usePortfolioMutations, useTransactions } from "@/lib/queries";
import { dateTime, money, num, pct, pctRaw, signClass } from "@/lib/format";
import { Badge, Button, Callout, Card, Confirm, Empty, Field, Modal, NumberInput, PageHeader, Skeleton, StatTile, useToast } from "@/components/ui";
import { StackedBar } from "@/components/charts/Bars";
import { SERIES } from "@/components/charts/scale";
import { TradeForm } from "@/components/TradeForm";
import { IcBriefcase, IcPlus, IcRefresh, IcTrash } from "@/components/icons";
import "./pages.css";

export function PortfolioPage() {
  const { data: pf, isLoading, isFetching } = usePortfolio();
  const { data: txns } = useTransactions();
  const { reset, removeTxn } = usePortfolioMutations();
  const toast = useToast();
  const [trade, setTrade] = useState<{ symbol?: string; side: "buy" | "sell" } | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [startCash, setStartCash] = useState(10000);
  const [deleting, setDeleting] = useState<number | null>(null);

  const segments = pf
    ? [
        ...pf.holdings.slice(0, 5).map((h, i) => ({ label: h.symbol, value: h.valueUsd, color: SERIES[i % SERIES.length] })),
        ...(pf.holdings.length > 5 ? [{ label: "Other", value: pf.holdings.slice(5).reduce((a, h) => a + h.valueUsd, 0), color: "var(--series-muted)" }] : []),
        { label: "Cash", value: Math.max(0, pf.cash), color: "var(--ink-4)" },
      ]
    : [];

  return (
    <div>
      <PageHeader
        eyebrow="Practice deck"
        title="Practice portfolio"
        lede="Pretend money, real prices. Make the mistakes here first. Every trade asks you to write down why, because that habit is worth more than any signal."
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<IcRefresh size={13} />} onClick={() => setResetOpen(true)}>
              Reset
            </Button>
            <Button variant="primary" icon={<IcPlus size={14} />} onClick={() => setTrade({ side: "buy" })}>
              New trade
            </Button>
          </>
        }
      />

      {isLoading && <Skeleton h={120} />}
      {pf && (
        <>
          <Card className="rise d1" style={{ marginBottom: 18 }}>
            <div className={`pf-summary ${isFetching ? "faded" : ""}`}>
              <StatTile hero label="Total value" value={money(pf.totals.equity, "USD", { digits: 0 })} delta={pct(pf.totals.totalReturnPct)} deltaTone={signClass(pf.totals.totalReturnPct) as "good" | "bad" | ""} sub={`started with ${money(pf.startingCash, "USD", { digits: 0 })}`} />
              <StatTile label="Cash" value={money(pf.cash, "USD", { digits: 0 })} sub="uninvested" />
              <StatTile label="Invested" value={money(pf.totals.value, "USD", { digits: 0 })} sub={`cost ${money(pf.totals.invested, "USD", { digits: 0 })}`} />
              <StatTile label="Gain on holdings" value={<span className={signClass(pf.totals.gain)}>{money(pf.totals.gain, "USD", { digits: 0 })}</span>} delta={pf.totals.invested ? pct(pf.totals.gainPct) : undefined} deltaTone={signClass(pf.totals.gainPct) as "good" | "bad" | ""} />
            </div>
            {pf.holdings.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  Where the money sits
                </div>
                <StackedBar segments={segments} ariaLabel="Portfolio allocation by value" format={(v, share) => `${money(v, "USD", { digits: 0 })} · ${(share * 100).toFixed(0)}%`} />
              </div>
            )}
          </Card>

          <Card className="rise d2" title="Holdings" eyebrow={`${pf.holdings.length} position${pf.holdings.length === 1 ? "" : "s"}`} tight style={{ marginBottom: 18 }}>
            {pf.holdings.length === 0 ? (
              <Empty
                title="Nothing bought yet"
                text="Try a first trade: put $500 into a whole-world fund and write one sentence about why. Then leave it alone for a week and watch what your feelings do."
                action={
                  <Button icon={<IcBriefcase size={14} />} onClick={() => setTrade({ symbol: "VWCE.DE", side: "buy" })}>
                    Buy VWCE.DE (pretend)
                  </Button>
                }
              />
            ) : (
              <div className={`table-wrap ${isFetching ? "faded" : ""}`}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th className="num">Units</th>
                      <th className="num">Avg cost</th>
                      <th className="num">Price</th>
                      <th className="num">Value</th>
                      <th className="num">Gain</th>
                      <th className="num">Today</th>
                      <th className="num">Weight</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {pf.holdings.map((h) => (
                      <tr key={h.symbol}>
                        <td>
                          <Link to={`/explore/${encodeURIComponent(h.symbol)}`} style={{ textDecoration: "none" }}>
                            <div className="sym">{h.symbol}</div>
                            <div className="name" style={{ maxWidth: 200 }}>
                              {h.name}
                            </div>
                          </Link>
                        </td>
                        <td className="num">{num(h.qty, 4)}</td>
                        <td className="num">{money(h.avgCost, h.currency)}</td>
                        <td className="num">{money(h.price, h.currency)}</td>
                        <td className="num" style={{ fontWeight: 600 }}>
                          {money(h.valueUsd, "USD", { digits: 0 })}
                        </td>
                        <td className={`num ${signClass(h.gain)}`}>
                          {money(h.gain, h.currency, { digits: 0 })}
                          <div className="tiny">{pct(h.gainPct)}</div>
                        </td>
                        <td className={`num ${signClass(h.dayChangePct)}`}>{pctRaw(h.dayChangePct)}</td>
                        <td className="num">
                          {pct(h.weight, 0, false)}
                          {h.weight > 0.25 && (
                            <div>
                              <Badge tone="warn">concentrated</Badge>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="row" style={{ gap: 4, justifyContent: "flex-end" }}>
                            <Button size="sm" onClick={() => setTrade({ symbol: h.symbol, side: "buy" })}>
                              Buy
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setTrade({ symbol: h.symbol, side: "sell" })}>
                              Sell
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      <Card className="rise d3" title="Journal" eyebrow={`${txns?.length ?? 0} trades`} subtitle="Every trade with the reason you gave at the time. Reread this before you sell anything.">
        {!txns && <Skeleton h={80} />}
        {txns && txns.length === 0 && <Empty title="Empty journal" text="Your reasons will appear here after your first practice trade." />}
        {txns && txns.length > 0 && (
          <div>
            {txns.map((t) => (
              <div className="event-row" key={t.id}>
                <span className={`event-mark ${t.side === "buy" ? "opportunity" : "info"}`} />
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="row wrap" style={{ gap: 8 }}>
                    <Badge tone={t.side === "buy" ? "good" : "info"}>{t.side}</Badge>
                    <span className="sym">{t.symbol}</span>
                    <span className="small">
                      {num(t.qty, 4)} × {money(t.price, t.currency)}
                      {t.fee ? ` + ${money(t.fee, "USD")} fee` : ""}
                    </span>
                    <span className="tiny muted-3">{dateTime(t.at)}</span>
                  </div>
                  <div className="event-msg" style={{ marginTop: 4, fontStyle: t.note ? "italic" : "normal" }}>
                    {t.note || <span className="muted-3">No reason recorded.</span>}
                  </div>
                </div>
                <button className="btn ghost icon" title="Delete entry" onClick={() => setDeleting(t.id)}>
                  <IcTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <Callout tone="tip" title="A rule for the journal">
          Sell only for one of three reasons: the reason you bought is no longer true, you need the money, or the position grew too large and you are rebalancing. "It went down" is not on the list.
        </Callout>
      </Card>

      <TradeForm open={trade !== null} onClose={() => setTrade(null)} defaultSymbol={trade?.symbol} defaultSide={trade?.side ?? "buy"} />
      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset the practice portfolio?"
        width={440}
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={reset.isPending}
              onClick={() =>
                reset.mutate(startCash, {
                  onSuccess: () => {
                    setResetOpen(false);
                    toast.info("Practice portfolio reset");
                  },
                })
              }
            >
              Reset
            </Button>
          </>
        }
      >
        <p className="muted small" style={{ marginBottom: 12 }}>
          All practice trades and journal entries are deleted and you start again with fresh pretend cash.
        </p>
        <Field label="Starting cash">
          <NumberInput value={startCash} onChange={setStartCash} min={100} step={500} prefix="$" />
        </Field>
      </Modal>
      <Confirm open={deleting !== null} onClose={() => setDeleting(null)} title="Delete this journal entry?" text="The trade is removed from your practice history, as if it never happened." confirmLabel="Delete" danger onConfirm={() => deleting !== null && removeTxn.mutate(deleting)} />
    </div>
  );
}
