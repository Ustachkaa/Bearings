import { Router } from "express";
import { z } from "zod";
import { data, nextId, nowIso, save, type Txn } from "../db.js";
import { bad, notFound } from "../lib/http.js";
import { getQuote, getQuotes, normalizeSymbol } from "../market/provider.js";
import { getAppSettings, updateAppSettings } from "../settings.js";

export const portfolioRouter = Router();

/** Conversion rate from `cur` to USD, using Yahoo FX pairs. Pence (GBp) handled. */
export async function toUsdRate(cur: string): Promise<number> {
  const c = cur === "GBp" ? "GBP" : cur;
  if (c === "USD") return cur === "GBp" ? 0.01 : 1;
  try {
    const q = await getQuote(`${c}USD=X`);
    const rate = q.price || 1;
    return cur === "GBp" ? rate / 100 : rate;
  } catch {
    return 1;
  }
}

export interface Holding {
  symbol: string;
  name: string;
  currency: string;
  qty: number;
  avgCost: number;
  cost: number;
  price: number;
  value: number;
  gain: number;
  gainPct: number;
  weight: number;
  dayChangePct: number;
  valueUsd: number;
  costUsd: number;
}

export async function computePortfolio() {
  const s = getAppSettings();
  const startingCash = s.paper.startingCash;
  // Average-cost method per symbol.
  const pos = new Map<string, { qty: number; cost: number; name: string; currency: string; costUsd: number }>();
  let cash = startingCash;
  for (const t of [...data.txns].sort((a, b) => a.at.localeCompare(b.at))) {
    const p = pos.get(t.symbol) ?? { qty: 0, cost: 0, name: t.name, currency: t.currency, costUsd: 0 };
    const gross = t.qty * t.price;
    const fx = Number((t as any).fx ?? 1);
    if (t.side === "buy") {
      p.qty += t.qty;
      p.cost += gross;
      p.costUsd += gross * fx;
      cash -= gross * fx + t.fee;
    } else {
      const avg = p.qty ? p.cost / p.qty : t.price;
      const avgUsd = p.qty ? p.costUsd / p.qty : t.price * fx;
      p.qty -= t.qty;
      p.cost -= avg * t.qty;
      p.costUsd -= avgUsd * t.qty;
      cash += gross * fx - t.fee;
    }
    if (p.qty <= 1e-9) pos.delete(t.symbol);
    else pos.set(t.symbol, p);
  }
  const symbols = [...pos.keys()];
  const quotes = await getQuotes(symbols);
  const qmap = new Map(quotes.map((q) => [q.symbol, q]));
  const rates = new Map<string, number>();
  for (const [, p] of pos) if (!rates.has(p.currency)) rates.set(p.currency, await toUsdRate(p.currency));

  const holdings: Holding[] = [];
  let valueUsd = 0;
  let costUsd = 0;
  for (const [symbol, p] of pos) {
    const q = qmap.get(symbol);
    const price = q?.price ?? p.cost / p.qty;
    const fx = rates.get(p.currency) ?? 1;
    const value = p.qty * price;
    const h: Holding = {
      symbol,
      name: q?.name ?? p.name,
      currency: p.currency,
      qty: p.qty,
      avgCost: p.cost / p.qty,
      cost: p.cost,
      price,
      value,
      gain: value - p.cost,
      gainPct: p.cost ? value / p.cost - 1 : 0,
      weight: 0,
      dayChangePct: q?.changePct ?? 0,
      valueUsd: value * fx,
      costUsd: p.costUsd,
    };
    valueUsd += h.valueUsd;
    costUsd += h.costUsd;
    holdings.push(h);
  }
  const equity = cash + valueUsd;
  for (const h of holdings) h.weight = equity ? h.valueUsd / equity : 0;
  holdings.sort((a, b) => b.valueUsd - a.valueUsd);
  return {
    cash,
    startingCash,
    holdings,
    totals: {
      invested: costUsd,
      value: valueUsd,
      gain: valueUsd - costUsd,
      gainPct: costUsd ? valueUsd / costUsd - 1 : 0,
      equity,
      totalReturnPct: startingCash ? equity / startingCash - 1 : 0,
    },
    txnCount: data.txns.length,
  };
}

portfolioRouter.get("/", async (_req, res) => {
  res.json(await computePortfolio());
});

portfolioRouter.get("/transactions", (_req, res) => {
  res.json([...data.txns].sort((a, b) => b.at.localeCompare(a.at)));
});

const tradeSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(["buy", "sell"]),
  qty: z.number().positive().optional(),
  amount: z.number().positive().optional(),
  price: z.number().positive().optional(),
  fee: z.number().min(0).optional(),
  note: z.string().max(2000).optional(),
});

portfolioRouter.post("/trade", async (req, res) => {
  const parsed = tradeSchema.safeParse(req.body);
  if (!parsed.success) throw bad(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  const b = parsed.data;
  const q = await getQuote(normalizeSymbol(b.symbol));
  const price = b.price ?? q.price;
  if (!price) throw bad("No price available");
  const fx = await toUsdRate(q.currency);
  let qty = b.qty;
  if (!qty && b.amount) qty = b.amount / fx / price; // amount is in USD
  if (!qty || qty <= 0) throw bad("Provide a quantity or an amount");
  const fee = b.fee ?? 0;
  const pf = await computePortfolio();
  if (b.side === "buy") {
    const cost = qty * price * fx + fee;
    if (cost > pf.cash + 1e-6) throw bad(`Not enough practice cash. This costs $${cost.toFixed(2)} but you have $${pf.cash.toFixed(2)}.`);
  } else {
    const h = pf.holdings.find((x) => x.symbol === q.symbol);
    if (!h) throw bad(`You do not hold ${q.symbol}.`);
    if (qty > h.qty + 1e-9) throw bad(`You only hold ${h.qty.toFixed(6)} ${q.symbol}.`);
  }
  const txn: Txn & { fx: number } = {
    id: nextId("txns"),
    symbol: q.symbol,
    name: q.name,
    side: b.side,
    qty,
    price,
    fee,
    currency: q.currency,
    note: b.note ?? "",
    at: nowIso(),
    fx,
  };
  data.txns.push(txn);
  save();
  res.status(201).json({ txn, portfolio: await computePortfolio() });
});

portfolioRouter.delete("/transactions/:id", (req, res) => {
  const idx = data.txns.findIndex((t) => t.id === Number(req.params.id));
  if (idx === -1) throw notFound("Transaction not found");
  data.txns.splice(idx, 1);
  save();
  res.json({ ok: true });
});

portfolioRouter.post("/reset", (req, res) => {
  const cash = Number(req.body?.startingCash ?? 10000);
  if (!Number.isFinite(cash) || cash < 0) throw bad("startingCash must be a positive number");
  data.txns = [];
  updateAppSettings({ paper: { startingCash: cash } });
  save();
  res.json({ ok: true });
});
