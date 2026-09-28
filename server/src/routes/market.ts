import { Router } from "express";
import { z } from "zod";
import { bad, num } from "../lib/http.js";
import { getHistory, getProfile, getQuote, getQuotes, search } from "../market/provider.js";
import { HISTORY_RANGES, type HistoryRange } from "../market/types.js";
import { analyze } from "../market/signals.js";
import { dcaBacktest, historyStats, monteCarlo } from "../market/projections.js";
import { getAnalysis } from "../alerts/scheduler.js";

export const marketRouter = Router();

const PULSE = [
  { symbol: "^GSPC", label: "S&P 500", region: "US" },
  { symbol: "^IXIC", label: "Nasdaq", region: "US" },
  { symbol: "^STOXX50E", label: "Euro Stoxx 50", region: "EU" },
  { symbol: "^GDAXI", label: "DAX", region: "EU" },
  { symbol: "^FTSE", label: "FTSE 100", region: "UK" },
  { symbol: "BTC-USD", label: "Bitcoin", region: "Crypto" },
  { symbol: "ETH-USD", label: "Ethereum", region: "Crypto" },
  { symbol: "GC=F", label: "Gold", region: "Commodity" },
  { symbol: "EURUSD=X", label: "EUR / USD", region: "FX" },
  { symbol: "GEL=X", label: "USD / GEL", region: "FX" },
];

marketRouter.get("/pulse", async (_req, res) => {
  const quotes = await getQuotes(PULSE.map((p) => p.symbol));
  const bySymbol = new Map(quotes.map((q) => [q.symbol, q]));
  res.json(
    PULSE.map((p) => ({ ...p, quote: bySymbol.get(p.symbol) ?? null })).filter((p) => p.quote),
  );
});

marketRouter.get("/search", async (req, res) => {
  const q = String(req.query.q ?? "");
  if (q.trim().length < 1) return res.json([]);
  res.json(await search(q));
});

marketRouter.get("/quotes", async (req, res) => {
  const symbols = String(req.query.symbols ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  res.json(await getQuotes(symbols));
});

marketRouter.get("/quote/:symbol", async (req, res) => {
  res.json(await getQuote(req.params.symbol));
});

marketRouter.get("/profile/:symbol", async (req, res) => {
  res.json(await getProfile(req.params.symbol));
});

marketRouter.get("/history/:symbol", async (req, res) => {
  const range = String(req.query.range ?? "1y") as HistoryRange;
  if (!HISTORY_RANGES.includes(range)) throw bad(`range must be one of ${HISTORY_RANGES.join(", ")}`);
  res.json(await getHistory(req.params.symbol, range));
});

marketRouter.get("/analysis/:symbol", async (req, res) => {
  res.json(await getAnalysis(req.params.symbol));
});

marketRouter.get("/stats/:symbol", async (req, res) => {
  const range = String(req.query.range ?? "10y") as HistoryRange;
  if (!HISTORY_RANGES.includes(range)) throw bad("invalid range");
  const candles = await getHistory(req.params.symbol, range);
  res.json({ symbol: req.params.symbol.toUpperCase(), range, ...historyStats(candles) });
});

const projectionSchema = z.object({
  initial: z.number().min(0),
  monthly: z.number().min(0),
  years: z.number().min(1).max(50),
  annualReturn: z.number().min(-0.5).max(0.5),
  annualVol: z.number().min(0.001).max(2),
  paths: z.number().min(200).max(5000).optional(),
  seed: z.number().optional(),
});

marketRouter.post("/projection", (req, res) => {
  const parsed = projectionSchema.safeParse(req.body);
  if (!parsed.success) throw bad(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  res.json(monteCarlo(parsed.data));
});

marketRouter.get("/dca/:symbol", async (req, res) => {
  const monthly = num(req.query.monthly, 100) as number;
  const range = String(req.query.range ?? "10y") as HistoryRange;
  if (!HISTORY_RANGES.includes(range)) throw bad("invalid range");
  if (monthly <= 0) throw bad("monthly must be positive");
  const candles = await getHistory(req.params.symbol, range);
  if (candles.length < 40) throw bad("Not enough history for a backtest.");
  res.json(dcaBacktest(req.params.symbol.toUpperCase(), candles, monthly));
});

// Kept for completeness: analyse arbitrary candles supplied by the client (used by the chart-reading lesson).
marketRouter.post("/analyze-sample", async (req, res) => {
  const symbol = String(req.body?.symbol ?? "SPY");
  const [quote, candles, profile] = await Promise.all([getQuote(symbol), getHistory(symbol, "2y"), getProfile(symbol)]);
  res.json(analyze(quote, candles, profile));
});
