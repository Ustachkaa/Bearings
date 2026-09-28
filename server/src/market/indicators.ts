/**
 * Pure indicator math. Every function takes an array of closing prices
 * (oldest first) and returns either a number or an aligned array where
 * positions without enough history are null.
 */

export type Series = (number | null)[];

export function sma(values: number[], n: number): Series {
  const out: Series = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= n) sum -= values[i - n];
    if (i >= n - 1) out[i] = sum / n;
  }
  return out;
}

export function ema(values: number[], n: number): Series {
  const out: Series = new Array(values.length).fill(null);
  if (values.length < n) return out;
  const k = 2 / (n + 1);
  let seed = 0;
  for (let i = 0; i < n; i++) seed += values[i];
  let prev = seed / n;
  out[n - 1] = prev;
  for (let i = n; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

/** Relative Strength Index (Wilder smoothing). */
export function rsi(values: number[], n = 14): Series {
  const out: Series = new Array(values.length).fill(null);
  if (values.length <= n) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= n; i++) {
    const d = values[i] - values[i - 1];
    if (d >= 0) gain += d;
    else loss -= d;
  }
  let avgGain = gain / n;
  let avgLoss = loss / n;
  out[n] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  for (let i = n + 1; i < values.length; i++) {
    const d = values[i] - values[i - 1];
    avgGain = (avgGain * (n - 1) + Math.max(d, 0)) / n;
    avgLoss = (avgLoss * (n - 1) + Math.max(-d, 0)) / n;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

export interface MacdPoint {
  macd: number | null;
  signal: number | null;
  hist: number | null;
}

export function macd(values: number[], fast = 12, slow = 26, signalN = 9): MacdPoint[] {
  const f = ema(values, fast);
  const s = ema(values, slow);
  const line: number[] = [];
  const lineIdx: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (f[i] !== null && s[i] !== null) {
      line.push((f[i] as number) - (s[i] as number));
      lineIdx.push(i);
    }
  }
  const sig = ema(line, signalN);
  const out: MacdPoint[] = values.map(() => ({ macd: null, signal: null, hist: null }));
  line.forEach((m, j) => {
    const i = lineIdx[j];
    const sg = sig[j];
    out[i] = { macd: m, signal: sg, hist: sg === null ? null : m - sg };
  });
  return out;
}

export function bollinger(values: number[], n = 20, k = 2) {
  const mid = sma(values, n);
  const upper: Series = new Array(values.length).fill(null);
  const lower: Series = new Array(values.length).fill(null);
  for (let i = n - 1; i < values.length; i++) {
    const m = mid[i] as number;
    let ss = 0;
    for (let j = i - n + 1; j <= i; j++) ss += (values[j] - m) ** 2;
    const sd = Math.sqrt(ss / n);
    upper[i] = m + k * sd;
    lower[i] = m - k * sd;
  }
  return { mid, upper, lower };
}

export function dailyReturns(values: number[]): number[] {
  const r: number[] = [];
  for (let i = 1; i < values.length; i++) r.push(values[i] / values[i - 1] - 1);
  return r;
}

export function stdev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(v);
}

/** Annualised volatility from the last `window` daily log returns. */
export function annualizedVol(values: number[], window = 30, periodsPerYear = 252): number | null {
  if (values.length < window + 1) return null;
  const slice = values.slice(-(window + 1));
  const logs: number[] = [];
  for (let i = 1; i < slice.length; i++) logs.push(Math.log(slice[i] / slice[i - 1]));
  return stdev(logs) * Math.sqrt(periodsPerYear);
}

/** Annualised mean return (arithmetic, from daily returns) over the whole series. */
export function annualizedReturn(values: number[], periodsPerYear = 252): number | null {
  if (values.length < 30) return null;
  const r = dailyReturns(values);
  const mean = r.reduce((a, b) => a + b, 0) / r.length;
  return mean * periodsPerYear;
}

export function maxDrawdown(values: number[]): { drawdown: number; peakIdx: number; troughIdx: number } {
  let peak = -Infinity;
  let peakIdx = 0;
  let worst = 0;
  let worstPeak = 0;
  let worstTrough = 0;
  values.forEach((v, i) => {
    if (v > peak) {
      peak = v;
      peakIdx = i;
    }
    const dd = v / peak - 1;
    if (dd < worst) {
      worst = dd;
      worstPeak = peakIdx;
      worstTrough = i;
    }
  });
  return { drawdown: worst, peakIdx: worstPeak, troughIdx: worstTrough };
}

/** Distance of the last price from the highest close in the lookback window (negative = below high). */
export function drawdownFromHigh(values: number[], lookback = 252): { drawdown: number; high: number; low: number } {
  const slice = values.slice(-lookback);
  const high = Math.max(...slice);
  const low = Math.min(...slice);
  const last = values[values.length - 1];
  return { drawdown: last / high - 1, high, low };
}

/** Simple return over the last `days` trading days. */
export function periodReturn(values: number[], days: number): number | null {
  if (values.length <= days) return null;
  const a = values[values.length - 1 - days];
  const b = values[values.length - 1];
  return a > 0 ? b / a - 1 : null;
}

export function cagr(start: number, end: number, years: number): number | null {
  if (start <= 0 || end <= 0 || years <= 0) return null;
  return Math.pow(end / start, 1 / years) - 1;
}

export function last<T>(arr: T[]): T | undefined {
  return arr.length ? arr[arr.length - 1] : undefined;
}

export function lastNonNull(arr: Series): number | null {
  for (let i = arr.length - 1; i >= 0; i--) if (arr[i] !== null) return arr[i] as number;
  return null;
}

/** Find the index of the most recent crossover between two series; returns null if none. */
export function lastCross(a: Series, b: Series): { index: number; direction: "up" | "down" } | null {
  for (let i = a.length - 1; i > 0; i--) {
    const a0 = a[i - 1], a1 = a[i], b0 = b[i - 1], b1 = b[i];
    if (a0 === null || a1 === null || b0 === null || b1 === null) continue;
    if (a0 <= b0 && a1 > b1) return { index: i, direction: "up" };
    if (a0 >= b0 && a1 < b1) return { index: i, direction: "down" };
  }
  return null;
}
