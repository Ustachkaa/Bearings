import { useEffect, useMemo, useState } from "react";
import { usePortfolio, usePortfolioMutations, useQuote } from "@/lib/queries";
import { money, num } from "@/lib/format";
import { Badge, Button, Callout, Field, Modal, NumberInput, Tabs, useToast } from "./ui";
import { TickerSearch } from "./TickerSearch";
import { IcX } from "./icons";

export function TradeForm({ open, onClose, defaultSymbol, defaultSide = "buy" }: { open: boolean; onClose: () => void; defaultSymbol?: string; defaultSide?: "buy" | "sell" }) {
  const [symbol, setSymbol] = useState(defaultSymbol ?? "");
  const [side, setSide] = useState<"buy" | "sell">(defaultSide);
  const [mode, setMode] = useState<"amount" | "qty">("amount");
  const [amount, setAmount] = useState(500);
  const [qty, setQty] = useState(1);
  const [fee, setFee] = useState(0);
  const [note, setNote] = useState("");
  const { data: quote } = useQuote(symbol || undefined);
  const { data: pf } = usePortfolio();
  const { trade } = usePortfolioMutations();
  const toast = useToast();

  useEffect(() => {
    if (open) {
      setSymbol(defaultSymbol ?? "");
      setSide(defaultSide);
      setNote("");
      setMode("amount");
    }
  }, [open, defaultSymbol, defaultSide]);

  const holding = pf?.holdings.find((h) => h.symbol === symbol);
  const fx = useMemo(() => {
    if (!quote) return 1;
    // Rough on-screen estimate only; the server converts precisely.
    return quote.currency === "USD" ? 1 : quote.currency === "GBp" ? 0.0127 : quote.currency === "EUR" ? 1.15 : quote.currency === "GBP" ? 1.27 : 1;
  }, [quote]);
  const estQty = quote ? (mode === "amount" ? amount / fx / quote.price : qty) : 0;
  const estCost = quote ? estQty * quote.price * fx + fee : 0;

  const submit = () => {
    if (!symbol) return;
    trade.mutate(
      { symbol, side, qty: mode === "qty" ? qty : undefined, amount: mode === "amount" ? amount : undefined, fee, note },
      {
        onSuccess: () => {
          toast.success(`${side === "buy" ? "Bought" : "Sold"} ${symbol} in your practice portfolio`);
          onClose();
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Practice trade"
      width={560}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={trade.isPending} disabled={!symbol || !quote} onClick={submit}>
            {side === "buy" ? "Buy" : "Sell"} {symbol || ""}
          </Button>
        </>
      }
    >
      <div className="col" style={{ gap: 16 }}>
        <Tabs
          tabs={[
            { id: "buy", label: "Buy" },
            { id: "sell", label: "Sell" },
          ]}
          value={side}
          onChange={setSide}
        />
        <Field label="Asset">
          {symbol ? (
            <div className="row">
              <Badge tone="brass">{symbol}</Badge>
              {quote && (
                <span className="small muted">
                  {quote.name} · {money(quote.price, quote.currency)}
                </span>
              )}
              <button className="btn ghost icon" aria-label="Change symbol" onClick={() => setSymbol("")}>
                <IcX size={14} />
              </button>
            </div>
          ) : (
            <TickerSearch onPick={(h) => setSymbol(h.symbol)} autoFocus placeholder="Search a ticker" />
          )}
        </Field>
        <div className="row between wrap">
          <Tabs
            tabs={[
              { id: "amount", label: "By amount (USD)" },
              { id: "qty", label: "By quantity" },
            ]}
            value={mode}
            onChange={setMode}
          />
          <span className="tiny muted-3">
            Cash available {money(pf?.cash ?? 0, "USD")}
            {holding ? ` · you hold ${num(holding.qty, 4)}` : ""}
          </span>
        </div>
        <div className="grid cols-2">
          {mode === "amount" ? (
            <Field label="Amount">
              <NumberInput value={amount} onChange={setAmount} min={1} step={50} prefix="$" />
            </Field>
          ) : (
            <Field label="Quantity">
              <NumberInput value={qty} onChange={setQty} min={0.000001} step={1} />
            </Field>
          )}
          <Field label="Fee" hint="Brokers charge a little per trade. Try 1 or 2 dollars to feel it.">
            <NumberInput value={fee} onChange={setFee} min={0} step={0.5} prefix="$" />
          </Field>
        </div>
        {quote && (
          <div className="small muted">
            About <strong className="num">{num(estQty, 4)}</strong> units at {money(quote.price, quote.currency)} ≈ <strong className="num">{money(estCost, "USD")}</strong>
            {quote.currency !== "USD" && " (converted at the live rate on the server)"}
          </div>
        )}
        <Field label={side === "buy" ? "Why are you buying? One sentence." : "Why are you selling? One sentence."} hint="This is your journal. Future you will want to read it.">
          <textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder={side === "buy" ? "e.g. Core world fund, monthly plan, holding for 20+ years." : "e.g. Rebalancing: it grew past 10% of the portfolio."} />
        </Field>
        {side === "sell" && !holding && symbol && (
          <Callout tone="warn" title="You do not hold this">
            You can only sell what you own in the practice portfolio.
          </Callout>
        )}
      </div>
    </Modal>
  );
}
