import { useEffect, useMemo, useState } from "react";
import { useAlertMeta, useAlertMutations, useQuote } from "@/lib/queries";
import type { RuleMeta } from "@/lib/types";
import { money } from "@/lib/format";
import { Button, Field, Modal, NumberInput, Select, useToast, Badge } from "./ui";
import { TickerSearch } from "./TickerSearch";
import { IcX } from "./icons";

export function AlertRuleForm({ open, onClose, defaultSymbol, defaultType }: { open: boolean; onClose: () => void; defaultSymbol?: string | null; defaultType?: string }) {
  const { data: metas } = useAlertMeta();
  const { create } = useAlertMutations();
  const toast = useToast();
  const [type, setType] = useState<string>(defaultType ?? "");
  const [symbol, setSymbol] = useState<string>(defaultSymbol ?? "");
  const [params, setParams] = useState<Record<string, number | string>>({});
  const [cooldown, setCooldown] = useState<number | null>(null);
  const meta: RuleMeta | undefined = useMemo(() => metas?.find((m) => m.type === type), [metas, type]);
  const { data: quote } = useQuote(meta?.needsSymbol && symbol ? symbol : undefined);

  useEffect(() => {
    if (open) {
      setType(defaultType ?? "");
      setSymbol(defaultSymbol ?? "");
      setParams({});
      setCooldown(null);
    }
  }, [open, defaultType, defaultSymbol]);

  useEffect(() => {
    if (!meta) return;
    const next: Record<string, number | string> = {};
    for (const p of meta.params) next[p.key] = p.default;
    // Sensible price defaults: 10% below / above the current price.
    if (quote) {
      if (meta.type === "price_below") next.target = Number((quote.price * 0.9).toPrecision(4));
      if (meta.type === "price_above") next.target = Number((quote.price * 1.1).toPrecision(4));
    }
    setParams(next);
    setCooldown(meta.defaultCooldownHours);
  }, [meta, quote]);

  const submit = () => {
    if (!meta) return;
    create.mutate(
      { type: meta.type, symbol: meta.needsSymbol ? symbol : null, params, cooldownHours: cooldown ?? undefined },
      {
        onSuccess: () => {
          toast.success("Alert rule created");
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
      title={meta ? meta.label : "New alert"}
      width={640}
      footer={
        meta && (
          <>
            <Button variant="ghost" onClick={() => setType("")}>
              Back
            </Button>
            <Button variant="primary" loading={create.isPending} disabled={meta.needsSymbol && !symbol} onClick={submit}>
              Create rule
            </Button>
          </>
        )
      }
    >
      {!meta && (
        <div className="col" style={{ gap: 12 }}>
          <p className="muted small">Pick what you want the app to watch for. Every rule sends an email (if connected) and appears in the ship's log.</p>
          <div className="rule-type-grid">
            {(metas ?? []).map((m) => (
              <button key={m.type} type="button" className="rule-type" onClick={() => setType(m.type)}>
                <strong>{m.label}</strong>
                <span>{m.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {meta && (
        <div className="col" style={{ gap: 16 }}>
          <p className="muted small">{meta.description}</p>
          {meta.needsSymbol && (
            <Field label="Which asset">
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
                <TickerSearch onPick={(h) => setSymbol(h.symbol)} placeholder="Search a ticker, e.g. VWCE.DE" autoFocus />
              )}
            </Field>
          )}
          {meta.params.length > 0 && (
            <div className="grid cols-2">
              {meta.params.map((p) => (
                <Field key={p.key} label={p.label} hint={p.key === "target" && quote ? `Current price ${money(quote.price, quote.currency)}` : undefined}>
                  {p.type === "select" ? (
                    <Select value={String(params[p.key] ?? p.default)} onChange={(v) => setParams((s) => ({ ...s, [p.key]: v }))} options={p.options ?? []} />
                  ) : (
                    <NumberInput value={Number(params[p.key] ?? p.default)} onChange={(v) => setParams((s) => ({ ...s, [p.key]: v }))} min={p.min} max={p.max} step={p.step} addon={p.unit} />
                  )}
                </Field>
              ))}
            </div>
          )}
          {meta.defaultCooldownHours > 0 && (
            <Field label="Quiet period between repeats" hint="Once it fires, the rule waits this long before telling you again, so a price that stays low does not spam you.">
              <NumberInput value={cooldown ?? meta.defaultCooldownHours} onChange={setCooldown} min={0} max={24 * 90} step={1} addon="hours" width={200} />
            </Field>
          )}
        </div>
      )}
    </Modal>
  );
}
