import YahooFinance from "yahoo-finance2";
import { TtlCache } from "../lib/cache.js";
import { notFound } from "../lib/http.js";
import type { AssetType, Candle, HistoryRange, Profile, Quote, SearchHit } from "./types.js";

// yahoo-finance2 v3+ is instantiated. We silence its survey notice and schema chatter.
const yf: any = new (YahooFinance as any)({
  suppressNotices: ["yahooSurvey", "ripHistorical"],
  validation: { logErrors: false, logOptionsErrors: false },
});

const quoteCache = new TtlCache<Quote>(60_000);
const historyCache = new TtlCache<Candle[]>(15 * 60_000);
const profileCache = new TtlCache<Profile | null>(6 * 3600_000);
const searchCache = new TtlCache<SearchHit[]>(10 * 60_000);

const n = (v: unknown): number | undefined => {
  if (v === null || v === undefined) return undefined;
  if (typeof v === "object" && v && "raw" in (v as any)) return n((v as any).raw);
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
};

export function normalizeSymbol(raw: string): string {
  return raw.trim().toUpperCase();
}

export function mapType(quoteType?: string, symbol = ""): AssetType {
  switch ((quoteType || "").toUpperCase()) {
    case "EQUITY":
      return "EQUITY";
    case "ETF":
      return "ETF";
    case "CRYPTOCURRENCY":
      return "CRYPTO";
    case "INDEX":
      return "INDEX";
    case "MUTUALFUND":
      return "FUND";
    case "CURRENCY":
      return "CURRENCY";
    case "FUTURE":
      return "COMMODITY";
    default:
      if (symbol.startsWith("^")) return "INDEX";
      if (symbol.endsWith("=X")) return "CURRENCY";
      if (symbol.endsWith("=F")) return "COMMODITY";
      return "OTHER";
  }
}

function toQuote(q: Record<string, any>): Quote {
  const symbol = String(q.symbol);
  const price = n(q.regularMarketPrice) ?? n(q.postMarketPrice) ?? n(q.preMarketPrice) ?? 0;
  // Yahoo reports dividendYield as a percentage (1.5) and trailingAnnualDividendYield as a fraction.
  let dividendYield: number | undefined;
  if (n(q.dividendYield) !== undefined) dividendYield = (n(q.dividendYield) as number) / 100;
  else if (n(q.trailingAnnualDividendYield) !== undefined) dividendYield = n(q.trailingAnnualDividendYield);
  return {
    symbol,
    name: q.longName || q.shortName || q.displayName || symbol,
    type: mapType(q.quoteType, symbol),
    currency: q.currency || "USD",
    exchange: q.fullExchangeName || q.exchange || "",
    price,
    change: n(q.regularMarketChange) ?? 0,
    changePct: n(q.regularMarketChangePercent) ?? 0,
    previousClose: n(q.regularMarketPreviousClose),
    open: n(q.regularMarketOpen),
    dayHigh: n(q.regularMarketDayHigh),
    dayLow: n(q.regularMarketDayLow),
    volume: n(q.regularMarketVolume),
    avgVolume: n(q.averageDailyVolume3Month),
    marketCap: n(q.marketCap),
    pe: n(q.trailingPE),
    forwardPe: n(q.forwardPE),
    pb: n(q.priceToBook),
    eps: n(q.epsTrailingTwelveMonths),
    dividendYield,
    high52: n(q.fiftyTwoWeekHigh),
    low52: n(q.fiftyTwoWeekLow),
    avg50: n(q.fiftyDayAverage),
    avg200: n(q.twoHundredDayAverage),
    marketState: q.marketState,
    updatedAt: new Date().toISOString(),
  };
}

export async function getQuote(symbolRaw: string): Promise<Quote> {
  const symbol = normalizeSymbol(symbolRaw);
  return quoteCache.getOrLoad(symbol, async () => {
    const q = await yf.quote(symbol).catch(() => null);
    if (!q || (q.regularMarketPrice === undefined && q.postMarketPrice === undefined)) {
      throw notFound(`No quote found for "${symbol}". Check the ticker (for example AAPL, VWCE.DE or BTC-USD).`);
    }
    return toQuote(q);
  });
}

export async function getQuotes(symbolsRaw: string[]): Promise<Quote[]> {
  const symbols = [...new Set(symbolsRaw.map(normalizeSymbol).filter(Boolean))];
  if (symbols.length === 0) return [];
  const missing = symbols.filter((s) => !quoteCache.get(s));
  if (missing.length) {
    const rows: any[] = await yf.quote(missing).catch(() => []);
    for (const r of rows || []) {
      if (r?.symbol && r.regularMarketPrice !== undefined) quoteCache.set(r.symbol, toQuote(r));
    }
    // Anything the batch call missed, try one by one (Yahoo drops unknown tickers silently).
    await Promise.all(
      missing.filter((s) => !quoteCache.get(s)).map((s) => getQuote(s).catch(() => null)),
    );
  }
  return symbols.map((s) => quoteCache.get(s)).filter((q): q is Quote => Boolean(q));
}

const RANGE_DAYS: Record<HistoryRange, number> = {
  "1mo": 31,
  "3mo": 93,
  "6mo": 186,
  "1y": 366,
  "2y": 732,
  "5y": 1830,
  "10y": 3660,
  max: 365 * 40,
};

export async function getHistory(symbolRaw: string, range: HistoryRange = "1y"): Promise<Candle[]> {
  const symbol = normalizeSymbol(symbolRaw);
  const key = `${symbol}:${range}`;
  return historyCache.getOrLoad(key, async () => {
    const period1 = new Date(Date.now() - RANGE_DAYS[range] * 86400_000);
    let candles: Candle[] = [];
    try {
      const res = await yf.chart(symbol, { period1, interval: "1d" });
      candles = (res?.quotes || [])
        .filter((q: any) => q.close !== null && q.close !== undefined)
        .map((q: any) => ({
          date: new Date(q.date).toISOString().slice(0, 10),
          open: q.open ?? q.close,
          high: q.high ?? q.close,
          low: q.low ?? q.close,
          close: q.close,
          adjClose: q.adjclose ?? q.close,
          volume: q.volume ?? 0,
        }));
    } catch {
      candles = await stooqFallback(symbol, period1);
    }
    if (!candles.length) throw notFound(`No price history found for "${symbol}".`);
    return candles;
  });
}

/** Fallback for plain US tickers via the free Stooq CSV endpoint (daily, unadjusted). */
async function stooqFallback(symbol: string, since: Date): Promise<Candle[]> {
  if (/[.^=\-]/.test(symbol)) return [];
  try {
    const url = `https://stooq.com/q/d/l/?s=${symbol.toLowerCase()}.us&i=d`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split("\n").slice(1);
    const sinceIso = since.toISOString().slice(0, 10);
    return lines
      .map((l) => l.split(","))
      .filter((c) => c.length >= 5 && c[0] >= sinceIso)
      .map((c) => ({
        date: c[0],
        open: Number(c[1]),
        high: Number(c[2]),
        low: Number(c[3]),
        close: Number(c[4]),
        adjClose: Number(c[4]),
        volume: Number(c[5] || 0),
      }))
      .filter((c) => Number.isFinite(c.close));
  } catch {
    return [];
  }
}

export async function getProfile(symbolRaw: string): Promise<Profile | null> {
  const symbol = normalizeSymbol(symbolRaw);
  return profileCache.getOrLoad(symbol, async () => {
    try {
      const r: any = await yf.quoteSummary(symbol, {
        modules: ["assetProfile", "summaryDetail", "defaultKeyStatistics", "financialData", "fundProfile"],
      });
      const ap = r?.assetProfile || {};
      const ks = r?.defaultKeyStatistics || {};
      const fd = r?.financialData || {};
      const sd = r?.summaryDetail || {};
      const fp = r?.fundProfile || {};
      const profile: Profile = {
        sector: ap.sector,
        industry: ap.industry,
        country: ap.country,
        website: ap.website,
        summary: ap.longBusinessSummary,
        employees: n(ap.fullTimeEmployees),
        beta: n(ks.beta) ?? n(sd.beta),
        profitMargin: n(fd.profitMargins) ?? n(ks.profitMargins),
        revenueGrowth: n(fd.revenueGrowth),
        returnOnEquity: n(fd.returnOnEquity),
        debtToEquity: n(fd.debtToEquity),
        payoutRatio: n(sd.payoutRatio),
        targetMeanPrice: n(fd.targetMeanPrice),
        recommendation: fd.recommendationKey,
        totalAssets: n(sd.totalAssets),
        expenseRatio: n(fp?.feesExpensesInvestment?.annualReportExpenseRatio),
        category: fp?.categoryName,
      };
      return profile;
    } catch {
      return null;
    }
  });
}

export async function search(query: string): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  return searchCache.getOrLoad(q.toLowerCase(), async () => {
    const res: any = await yf
      .search(q, { quotesCount: 12, newsCount: 0, enableFuzzyQuery: true })
      .catch(() => null);
    const hits: SearchHit[] = (res?.quotes || [])
      .filter((h: any) => h.symbol && h.quoteType && !["OPTION", "FUTURE"].includes(h.quoteType))
      .map((h: any) => ({
        symbol: h.symbol,
        name: h.longname || h.shortname || h.symbol,
        exchange: h.exchDisp || h.exchange || "",
        type: mapType(h.quoteType, h.symbol),
      }));
    // If the query looks like a ticker that search did not return, try it directly.
    const upper = q.toUpperCase();
    if (/^[A-Z0-9.^=\-]{1,12}$/.test(upper) && !hits.some((h) => h.symbol === upper)) {
      const direct = await getQuote(upper).catch(() => null);
      if (direct) hits.unshift({ symbol: direct.symbol, name: direct.name, exchange: direct.exchange, type: direct.type });
    }
    return hits;
  });
}

export function clearMarketCaches() {
  quoteCache.clear();
  historyCache.clear();
  profileCache.clear();
  searchCache.clear();
}
