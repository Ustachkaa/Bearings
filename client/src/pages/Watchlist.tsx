import { useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlistMutations, useWatchlistOverview } from "@/lib/queries";
import type { WatchRow } from "@/lib/types";
import { money, pct, pctRaw, signClass } from "@/lib/format";
import { Button, Card, Confirm, Empty, Field, Modal, PageHeader, Skeleton, StanceBadge, useToast } from "@/components/ui";
import { Sparkline } from "@/components/charts/Sparkline";
import { TickerSearch } from "@/components/TickerSearch";
import { AlertRuleForm } from "@/components/AlertRuleForm";
import { IcBell, IcTrash } from "@/components/icons";
import "./pages.css";

export function WatchlistPage() {
  const { data: rows, isLoading, isFetching, refetch } = useWatchlistOverview();
  const { add, remove, update } = useWatchlistMutations();
  const toast = useToast();
  const [alertFor, setAlertFor] = useState<string | null>(null);
  const [removing, setRemoving] = useState<WatchRow | null>(null);
  const [editing, setEditing] = useState<WatchRow | null>(null);
  const [thesis, setThesis] = useState("");

  return (
    <div>
      <PageHeader
        eyebrow="Your bearings"
        title="Watchlist"
        lede="The assets you follow, with today's stance for each. The alert engine checks these on schedule."
        actions={<Button size="sm" variant="ghost" onClick={() => refetch()} loading={isFetching}>Refresh</Button>}
      />
      <Card className="rise d1" style={{ marginBottom: 18 }}>
        <div className="row wrap between">
          <div className="grow" style={{ maxWidth: 520 }}>
            <TickerSearch placeholder="Add a stock, fund or coin to follow…" onPick={(h) => add.mutate(h.symbol, { onSuccess: () => toast.success(`${h.symbol} added`), onError: (e) => toast.error(e.message) })} />
          </div>
          <span className="tiny muted-3">Tip: European ETFs need a suffix, e.g. VWCE.DE or IWDA.AS</span>
        </div>
      </Card>

      <Card className="rise d2" tight>
        {isLoading && <Skeleton h={160} />}
        {rows && rows.length === 0 && (
          <Empty title="Nothing here yet" text="Search above to add your first asset. A whole-world fund such as VWCE.DE is a sensible first entry." action={<Button to="/explore/VWCE.DE">Look at VWCE.DE</Button>} />
        )}
        {rows && rows.length > 0 && (
          <div className={`table-wrap ${isFetching ? "faded" : ""}`}>
            <table className="table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>60 days</th>
                  <th className="num">Price</th>
                  <th className="num">Today</th>
                  <th className="num">From high</th>
                  <th className="num">Vs 200d</th>
                  <th className="num">RSI</th>
                  <th>Stance</th>
                  <th>Why I follow it</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.item.id}>
                    <td>
                      <Link to={`/explore/${encodeURIComponent(r.item.symbol)}`} style={{ textDecoration: "none" }}>
                        <div className="sym">{r.item.symbol}</div>
                        <div className="name" style={{ maxWidth: 220 }}>
                          {r.item.name}
                        </div>
                      </Link>
                    </td>
                    <td>{r.spark ? <Sparkline data={r.spark} width={90} height={26} /> : <span className="tiny muted-3">—</span>}</td>
                    <td className="num" style={{ fontWeight: 600 }}>
                      {r.quote ? money(r.quote.price, r.quote.currency) : "—"}
                    </td>
                    <td className={`num ${signClass(r.quote?.changePct)}`}>{r.quote ? pctRaw(r.quote.changePct) : "—"}</td>
                    <td className={`num ${signClass(r.indicators?.drawdownFromHigh)}`}>{pct(r.indicators?.drawdownFromHigh)}</td>
                    <td className={`num ${signClass(r.indicators?.pctFromSma200)}`}>{pct(r.indicators?.pctFromSma200)}</td>
                    <td className="num">{r.indicators?.rsi14 === null || r.indicators?.rsi14 === undefined ? "—" : r.indicators.rsi14.toFixed(0)}</td>
                    <td>{r.verdict ? <StanceBadge stance={r.verdict.stance} /> : <span className="tiny bad">{r.error ? "no data" : ""}</span>}</td>
                    <td>
                      <button
                        className="thesis-cell"
                        style={{ background: "none", border: 0, padding: 0, textAlign: "left", cursor: "pointer" }}
                        title="Edit"
                        onClick={() => {
                          setEditing(r);
                          setThesis(r.item.thesis);
                        }}
                      >
                        {r.item.thesis || <span className="muted-3">Write one sentence…</span>}
                      </button>
                    </td>
                    <td>
                      <div className="row" style={{ gap: 4, justifyContent: "flex-end" }}>
                        <button className="btn ghost icon" title={`Alerts (${r.rules ?? 0})`} onClick={() => setAlertFor(r.item.symbol)}>
                          <IcBell size={15} />
                        </button>
                        <button className="btn ghost icon" title="Remove" onClick={() => setRemoving(r)}>
                          <IcTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AlertRuleForm open={alertFor !== null} onClose={() => setAlertFor(null)} defaultSymbol={alertFor} />
      <Confirm
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={`Remove ${removing?.item.symbol}?`}
        text="It leaves your watchlist and its alert rules are deleted. Your practice portfolio is untouched."
        confirmLabel="Remove"
        danger
        onConfirm={() => removing && remove.mutate(removing.item.id)}
      />
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={`Why do you follow ${editing?.item.symbol}?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={update.isPending}
              onClick={() => editing && update.mutate({ id: editing.item.id, thesis }, { onSuccess: () => setEditing(null) })}
            >
              Save
            </Button>
          </>
        }
      >
        <Field label="Your one-sentence thesis" hint="If you cannot write it, you are not ready to buy it. That is the whole point of this box.">
          <textarea className="textarea" value={thesis} onChange={(e) => setThesis(e.target.value)} placeholder="e.g. Owns the whole world's stock market for 0.22% a year; my core holding for 20+ years." />
        </Field>
      </Modal>
    </div>
  );
}
