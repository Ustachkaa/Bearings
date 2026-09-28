const CURRENCY_FALLBACK = "USD";

export function money(x: number | null | undefined, currency = CURRENCY_FALLBACK, opts: { compact?: boolean; digits?: number } = {}) {
  if (x === null || x === undefined || !Number.isFinite(x)) return "—";
  const cur = currency === "GBp" ? "GBP" : currency || CURRENCY_FALLBACK;
  const value = currency === "GBp" ? x / 100 : x;
  if (opts.compact) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, notation: "compact", maximumFractionDigits: 1 }).format(value);
  }
  const digits = opts.digits ?? (Math.abs(value) < 1 ? 4 : Math.abs(value) < 10 ? 3 : 2);
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: digits, minimumFractionDigits: Math.min(2, digits) }).format(value);
  } catch {
    return `${value.toFixed(2)} ${cur}`;
  }
}

export function num(x: number | null | undefined, digits = 2) {
  if (x === null || x === undefined || !Number.isFinite(x)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(x);
}

export function compact(x: number | null | undefined) {
  if (x === null || x === undefined || !Number.isFinite(x)) return "—";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(x);
}

/** x is a fraction (0.052 → +5.2%) */
export function pct(x: number | null | undefined, digits = 1, signed = true) {
  if (x === null || x === undefined || !Number.isFinite(x)) return "—";
  const v = (x * 100).toFixed(digits);
  return `${signed && x > 0 ? "+" : ""}${v}%`;
}

/** x is already in percent units (5.2 → +5.2%) */
export function pctRaw(x: number | null | undefined, digits = 1, signed = true) {
  if (x === null || x === undefined || !Number.isFinite(x)) return "—";
  return `${signed && x > 0 ? "+" : ""}${x.toFixed(digits)}%`;
}

export function signClass(x: number | null | undefined) {
  if (x === null || x === undefined || !Number.isFinite(x) || x === 0) return "";
  return x > 0 ? "good" : "bad";
}

export function dateShort(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function dateLong(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function dateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(iso: string | null | undefined) {
  if (!iso) return "never";
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

export const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

export function typeLabel(t: string) {
  switch (t) {
    case "EQUITY":
      return "Stock";
    case "ETF":
      return "ETF";
    case "FUND":
      return "Fund";
    case "CRYPTO":
      return "Crypto";
    case "INDEX":
      return "Index";
    case "CURRENCY":
      return "Currency";
    case "COMMODITY":
      return "Commodity";
    default:
      return "Asset";
  }
}
