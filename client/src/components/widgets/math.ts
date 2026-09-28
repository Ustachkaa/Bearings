/** Pure maths shared by the widgets. Rates are fractions (0.07 = 7%). Compounding is monthly unless stated. */

export const monthlyRate = (annual: number) => annual / 12;

/** Future value of a lump sum plus a fixed monthly contribution after `months` months at monthly rate `r`. */
export function futureValue(initial: number, monthly: number, months: number, r: number): number {
  if (months <= 0) return initial;
  if (Math.abs(r) < 1e-12) return initial + monthly * months;
  const g = Math.pow(1 + r, months);
  return initial * g + monthly * ((g - 1) / r);
}

/** Monthly payment needed to reach `target` from `initial` after `months` months at monthly rate `r`. */
export function pmt(target: number, initial: number, months: number, r: number): number {
  if (months <= 0) return Math.max(0, target - initial);
  if (Math.abs(r) < 1e-12) return Math.max(0, (target - initial) / months);
  const g = Math.pow(1 + r, months);
  return Math.max(0, ((target - initial * g) * r) / (g - 1));
}

/** Year-by-year path (index = year, 0..years) of value and money put in. */
export function yearlyPath(initial: number, monthly: number, years: number, annual: number) {
  const r = monthlyRate(annual);
  const value: number[] = [];
  const putIn: number[] = [];
  for (let y = 0; y <= years; y++) {
    value.push(futureValue(initial, monthly, y * 12, r));
    putIn.push(initial + monthly * 12 * y);
  }
  return { value, putIn };
}

export function yearsToDoubleExact(annual: number): number {
  if (annual <= 0) return Infinity;
  return Math.log(2) / Math.log(1 + annual);
}

export function yearsToDoubleRule72(annualPct: number): number {
  if (annualPct <= 0) return Infinity;
  return 72 / annualPct;
}

/** Simple moving average aligned to the input; nulls where there is not enough history. */
export function sma(values: number[], n: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= n) sum -= values[i - n];
    if (i >= n - 1) out[i] = sum / n;
  }
  return out;
}

/** Wilder RSI, aligned to the input. */
export function rsi14(values: number[], n = 14): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
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

/** Largest peak-to-trough fall in a series, as a negative fraction. */
export function maxDrawdown(values: number[]): number {
  let peak = -Infinity;
  let worst = 0;
  for (const v of values) {
    if (v > peak) peak = v;
    const dd = v / peak - 1;
    if (dd < worst) worst = dd;
  }
  return worst;
}

/** Most recent crossover of series a over/under series b. */
export function lastCross(a: (number | null)[], b: (number | null)[]): { index: number; direction: "up" | "down" } | null {
  for (let i = a.length - 1; i > 0; i--) {
    const a0 = a[i - 1], a1 = a[i], b0 = b[i - 1], b1 = b[i];
    if (a0 === null || a1 === null || b0 === null || b1 === null) continue;
    if (a0 <= b0 && a1 > b1) return { index: i, direction: "up" };
    if (a0 >= b0 && a1 < b1) return { index: i, direction: "down" };
  }
  return null;
}

export function lastNonNull(arr: (number | null)[]): number | null {
  for (let i = arr.length - 1; i >= 0; i--) if (arr[i] !== null) return arr[i] as number;
  return null;
}

/** Gain required to recover from a fractional drop (0.3 → 0.4286). */
export const recoveryNeeded = (drop: number) => (drop >= 1 ? Infinity : drop / (1 - drop));

export const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
