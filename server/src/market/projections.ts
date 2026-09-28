/**
 * Projections: ranges of plausible outcomes, never forecasts.
 *
 *  - monteCarlo(): simulates thousands of possible futures from an assumed
 *    average return and volatility, and reports the spread (percentiles).
 *  - dcaBacktest(): replays "what if I had invested X every month" on real
 *    price history.
 */
import type { Candle } from "./types.js";
import * as I from "./indicators.js";

export interface ProjectionInput {
  initial: number;
  monthly: number;
  years: number;
  /** Expected average yearly return as a fraction, e.g. 0.07 */
  annualReturn: number;
  /** Yearly volatility as a fraction, e.g. 0.18 */
  annualVol: number;
  paths?: number;
  seed?: number;
}

export interface ProjectionResult {
  input: Required<ProjectionInput>;
  years: number[];
  contributions: number[];
  deterministic: number[];
  percentiles: { p10: number[]; p25: number[]; p50: number[]; p75: number[]; p90: number[] };
  /** Share of simulated futures that ended below the money put in. */
  probLoss: number;
  finalMedian: number;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rng: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function percentile(sorted: number[], p: number) {
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function monteCarlo(raw: ProjectionInput): ProjectionResult {
  const input: Required<ProjectionInput> = {
    initial: Math.max(0, raw.initial),
    monthly: Math.max(0, raw.monthly),
    years: Math.min(50, Math.max(1, Math.round(raw.years))),
    annualReturn: Math.min(0.5, Math.max(-0.5, raw.annualReturn)),
    annualVol: Math.min(2, Math.max(0.001, raw.annualVol)),
    paths: Math.min(5000, Math.max(200, raw.paths ?? 2000)),
    seed: raw.seed ?? 42,
  };
  const rng = mulberry32(input.seed);
  const months = input.years * 12;
  const dt = 1 / 12;
  const drift = (input.annualReturn - (input.annualVol ** 2) / 2) * dt;
  const shock = input.annualVol * Math.sqrt(dt);

  // finals[year][path]
  const perYear: number[][] = Array.from({ length: input.years + 1 }, () => []);
  for (let p = 0; p < input.paths; p++) {
    let v = input.initial;
    perYear[0].push(v);
    for (let m = 1; m <= months; m++) {
      v = v * Math.exp(drift + shock * gaussian(rng)) + input.monthly;
      if (m % 12 === 0) perYear[m / 12].push(v);
    }
  }

  const years = Array.from({ length: input.years + 1 }, (_, i) => i);
  const contributions = years.map((y) => input.initial + input.monthly * 12 * y);
  const rMonthly = Math.pow(1 + input.annualReturn, 1 / 12) - 1;
  const deterministic = years.map((y) => {
    const n = y * 12;
    const lump = input.initial * Math.pow(1 + rMonthly, n);
    const ann = rMonthly === 0 ? input.monthly * n : input.monthly * ((Math.pow(1 + rMonthly, n) - 1) / rMonthly);
    return lump + ann;
  });

  const pct = (p: number) => perYear.map((arr) => percentile([...arr].sort((a, b) => a - b), p));
  const percentiles = { p10: pct(0.1), p25: pct(0.25), p50: pct(0.5), p75: pct(0.75), p90: pct(0.9) };
  const finals = perYear[input.years];
  const probLoss = finals.filter((v) => v < contributions[input.years]).length / finals.length;

  return { input, years, contributions, deterministic, percentiles, probLoss, finalMedian: percentiles.p50[input.years] };
}

export interface HistoryStats {
  years: number;
  cagr: number | null;
  annualVol: number | null;
  maxDrawdown: number;
  /** A tempered return assumption suitable for planning. */
  suggestedReturn: number;
  suggestedVol: number;
}

export function historyStats(candles: Candle[]): HistoryStats {
  const adj = candles.map((c) => c.adjClose);
  const years = candles.length / 252;
  const cagr = years >= 1 ? I.cagr(adj[0], adj[adj.length - 1], years) : null;
  const vol = I.annualizedVol(adj, Math.min(adj.length - 1, 750));
  const mdd = I.maxDrawdown(adj).drawdown;
  // Plan with the smaller of history and 10%: long-run equity markets have returned ~7-10% a year.
  const suggestedReturn = cagr === null ? 0.07 : Math.max(0.02, Math.min(cagr, 0.1));
  const suggestedVol = vol === null ? 0.18 : Math.max(0.08, Math.min(vol, 1.2));
  return { years, cagr, annualVol: vol, maxDrawdown: mdd, suggestedReturn, suggestedVol };
}

export interface DcaPoint {
  date: string;
  invested: number;
  value: number;
  units: number;
  price: number;
}

export interface DcaResult {
  symbol: string;
  monthly: number;
  months: number;
  points: DcaPoint[];
  totalInvested: number;
  finalValue: number;
  gain: number;
  gainPct: number;
  cagr: number | null;
  lumpSum: { invested: number; finalValue: number; gainPct: number };
  bestBuy: { date: string; price: number };
  worstBuy: { date: string; price: number };
  averagePrice: number;
  finalPrice: number;
}

/**
 * Money-weighted (internal) rate of return, annualised. Solves for the yearly
 * rate at which the present value of all purchases equals the final value.
 */
export function moneyWeightedReturn(buyDates: string[], amount: number, endDate: string, finalValue: number): number | null {
  if (!buyDates.length || finalValue <= 0) return null;
  const end = new Date(endDate).getTime();
  const t = buyDates.map((d) => Math.max(0, (end - new Date(d).getTime()) / (365.25 * 86400_000))); // years until the end
  const f = (r: number) => t.reduce((acc, yrs) => acc + amount * Math.pow(1 + r, yrs), 0) - finalValue;
  let lo = -0.95;
  let hi = 5;
  if (f(lo) > 0 || f(hi) < 0) return null;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

/** Replays a fixed monthly purchase on the first trading day of each month. */
export function dcaBacktest(symbol: string, candles: Candle[], monthly: number): DcaResult {
  const buys: DcaPoint[] = [];
  let invested = 0;
  let units = 0;
  let lastMonth = "";
  const points: DcaPoint[] = [];
  for (const c of candles) {
    const month = c.date.slice(0, 7);
    if (month !== lastMonth) {
      lastMonth = month;
      const price = c.adjClose;
      units += monthly / price;
      invested += monthly;
      buys.push({ date: c.date, invested, value: units * price, units, price });
    }
    points.push({ date: c.date, invested, value: units * c.adjClose, units, price: c.adjClose });
  }
  const finalPrice = candles[candles.length - 1].adjClose;
  const finalValue = units * finalPrice;
  const years = candles.length / 252;
  const irr = moneyWeightedReturn(buys.map((b) => b.date), monthly, candles[candles.length - 1].date, finalValue);
  const lumpUnits = invested / candles[0].adjClose;
  const lumpFinal = lumpUnits * finalPrice;
  const sortedBuys = [...buys].sort((a, b) => a.price - b.price);
  // Thin the point series so the payload stays small (weekly resolution).
  const step = Math.max(1, Math.floor(points.length / 260));
  const thinned = points.filter((_, i) => i % step === 0 || i === points.length - 1);
  return {
    symbol,
    monthly,
    months: buys.length,
    points: thinned,
    totalInvested: invested,
    finalValue,
    gain: finalValue - invested,
    gainPct: invested ? finalValue / invested - 1 : 0,
    cagr: years >= 1 ? irr : null,
    lumpSum: { invested, finalValue: lumpFinal, gainPct: lumpFinal / invested - 1 },
    bestBuy: { date: sortedBuys[0].date, price: sortedBuys[0].price },
    worstBuy: { date: sortedBuys[sortedBuys.length - 1].date, price: sortedBuys[sortedBuys.length - 1].price },
    averagePrice: invested / units,
    finalPrice,
  };
}
