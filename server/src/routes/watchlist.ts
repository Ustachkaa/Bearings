import { Router } from "express";
import { z } from "zod";
import { data, nextId, nowIso, save, type WatchItem } from "../db.js";
import { bad, notFound } from "../lib/http.js";
import { getQuote, normalizeSymbol } from "../market/provider.js";
import { getAnalysis } from "../alerts/scheduler.js";

export const watchlistRouter = Router();

watchlistRouter.get("/", (_req, res) => {
  res.json(data.watchlist);
});

watchlistRouter.post("/", async (req, res) => {
  const body = z.object({ symbol: z.string().min(1), notes: z.string().optional(), thesis: z.string().optional() }).safeParse(req.body);
  if (!body.success) throw bad("symbol is required");
  const symbol = normalizeSymbol(body.data.symbol);
  const existing = data.watchlist.find((w) => w.symbol === symbol);
  if (existing) return res.json(existing);
  const q = await getQuote(symbol);
  const item: WatchItem = {
    id: nextId("watchlist"),
    symbol: q.symbol,
    name: q.name,
    type: q.type,
    currency: q.currency,
    notes: body.data.notes ?? "",
    thesis: body.data.thesis ?? "",
    addedAt: nowIso(),
  };
  data.watchlist.push(item);
  save();
  res.status(201).json(item);
});

watchlistRouter.patch("/:id", (req, res) => {
  const item = data.watchlist.find((w) => w.id === Number(req.params.id));
  if (!item) throw notFound("Watchlist item not found");
  const body = z.object({ notes: z.string().optional(), thesis: z.string().optional() }).safeParse(req.body);
  if (!body.success) throw bad("invalid body");
  if (body.data.notes !== undefined) item.notes = body.data.notes;
  if (body.data.thesis !== undefined) item.thesis = body.data.thesis;
  save();
  res.json(item);
});

watchlistRouter.delete("/:id", (req, res) => {
  const idx = data.watchlist.findIndex((w) => w.id === Number(req.params.id));
  if (idx === -1) throw notFound("Watchlist item not found");
  const [removed] = data.watchlist.splice(idx, 1);
  // Remove rules that only make sense with the item.
  data.alertRules = data.alertRules.filter((r) => r.symbol !== removed.symbol);
  save();
  res.json({ ok: true });
});

/** Everything the watchlist page needs in one call. Analyses are cached upstream. */
watchlistRouter.get("/overview", async (_req, res) => {
  const rows = await Promise.all(
    data.watchlist.map(async (item) => {
      try {
        const a = await getAnalysis(item.symbol);
        const closes = a.chart.map((c) => c.close);
        return {
          item,
          ok: true,
          quote: a.quote,
          verdict: a.verdict,
          indicators: {
            drawdownFromHigh: a.indicators.drawdownFromHigh,
            pctFromSma200: a.indicators.pctFromSma200,
            rsi14: a.indicators.rsi14,
            ret1y: a.indicators.ret1y,
            vol30: a.indicators.vol30,
          },
          spark: closes.slice(-60),
          rules: data.alertRules.filter((r) => r.symbol === item.symbol).length,
        };
      } catch (err) {
        return { item, ok: false, error: err instanceof Error ? err.message : String(err) };
      }
    }),
  );
  res.json(rows);
});
