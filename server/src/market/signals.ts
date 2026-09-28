/**
 * The Bearings signals engine.
 *
 * Rule-based, transparent and tuned for a long-term investor who adds money
 * regularly. Nothing here predicts prices. Each signal explains what it sees,
 * shows the arithmetic, and says what a patient investor might do with it.
 */
import type { AssetType, Candle, Profile, Quote } from "./types.js";
import * as I from "./indicators.js";

export type SignalLevel = "opportunity" | "neutral" | "caution";
export type SignalCategory = "trend" | "dip" | "momentum" | "value" | "risk" | "income" | "structure";
export type Stance = "accumulate" | "steady" | "patience" | "caution";

export interface Signal {
  id: string;
  category: SignalCategory;
  level: SignalLevel;
  /** Contribution to the composite score. */
  score: number;
  title: string;
  detail: string;
  math?: string;
  lesson?: string;
}

export interface Indicators {
  price: number;
  sma50: number | null;
  sma200: number | null;
  pctFromSma50: number | null;
  pctFromSma200: number | null;
  rsi14: number | null;
  macd: number | null;
  macdSignal: number | null;
  macdHist: number | null;
  drawdownFromHigh: number;
  high52: number;
  low52: number;
  vol30: number | null;
  ret1m: number | null;
  ret3m: number | null;
  ret6m: number | null;
  ret1y: number | null;
  maxDrawdown1y: number;
  cagr: number | null;
  cagrYears: number;
  lastCross: { date: string; direction: "up" | "down"; daysAgo: number } | null;
}

export interface Verdict {
  stance: Stance;
  score: number;
  headline: string;
  summary: string;
  nextStep: string;
  caveat: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail" | "na";
  note: string;
  lesson?: string;
}

export interface ChartPoint {
  date: string;
  close: number;
  sma50: number | null;
  sma200: number | null;
}

export interface Analysis {
  symbol: string;
  name: string;
  type: AssetType;
  currency: string;
  asOf: string;
  quote: Quote;
  profile: Profile | null;
  indicators: Indicators;
  signals: Signal[];
  verdict: Verdict;
  checklist: ChecklistItem[];
  chart: ChartPoint[];
  historyDays: number;
}

const pct = (x: number, digits = 1) => `${x >= 0 ? "+" : ""}${(x * 100).toFixed(digits)}%`;
const abs = (x: number, digits = 1) => `${Math.abs(x * 100).toFixed(digits)}%`;
const money = (x: number, cur: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur || "USD", maximumFractionDigits: x < 10 ? 4 : 2 }).format(x);

const isDiversified = (t: AssetType) => t === "ETF" || t === "FUND" || t === "INDEX";

export function computeIndicators(candles: Candle[]): Indicators {
  const closes = candles.map((c) => c.close);
  const adj = candles.map((c) => c.adjClose);
  const price = closes[closes.length - 1];
  const s50 = I.sma(closes, 50);
  const s200 = I.sma(closes, 200);
  const sma50 = I.lastNonNull(s50);
  const sma200 = I.lastNonNull(s200);
  const r = I.lastNonNull(I.rsi(closes, 14));
  const m = I.last(I.macd(closes));
  const dd = I.drawdownFromHigh(closes, 252);
  const cross = I.lastCross(s50, s200);
  const years = Math.max(candles.length / 252, 0.1);
  return {
    price,
    sma50,
    sma200,
    pctFromSma50: sma50 ? price / sma50 - 1 : null,
    pctFromSma200: sma200 ? price / sma200 - 1 : null,
    rsi14: r,
    macd: m?.macd ?? null,
    macdSignal: m?.signal ?? null,
    macdHist: m?.hist ?? null,
    drawdownFromHigh: dd.drawdown,
    high52: dd.high,
    low52: dd.low,
    vol30: I.annualizedVol(closes, 30),
    ret1m: I.periodReturn(adj, 21),
    ret3m: I.periodReturn(adj, 63),
    ret6m: I.periodReturn(adj, 126),
    ret1y: I.periodReturn(adj, 252),
    maxDrawdown1y: I.maxDrawdown(closes.slice(-252)).drawdown,
    cagr: candles.length > 260 ? I.cagr(adj[0], adj[adj.length - 1], years) : null,
    cagrYears: years,
    lastCross: cross
      ? { date: candles[cross.index].date, direction: cross.direction, daysAgo: candles.length - 1 - cross.index }
      : null,
  };
}

export function buildSignals(quote: Quote, ind: Indicators, profile: Profile | null): Signal[] {
  const out: Signal[] = [];
  const t = quote.type;
  const cur = quote.currency;
  const div = isDiversified(t);
  const crypto = t === "CRYPTO";
  const label = div ? "this fund" : crypto ? "this coin" : "this company";

  // ── Structure ─────────────────────────────────────────────────────────────
  if (div) {
    out.push({
      id: "diversified",
      category: "structure",
      level: "opportunity",
      score: 0.5,
      title: "Diversified holding",
      detail:
        "A fund spreads your money across many companies, so one bad apple cannot sink you. This is the backbone of a long-term plan.",
      lesson: "index-funds",
    });
    if (profile?.expenseRatio !== undefined) {
      const er = profile.expenseRatio;
      out.push(
        er <= 0.002
          ? {
              id: "low-cost",
              category: "value",
              level: "opportunity",
              score: 0.5,
              title: `Low-cost fund (${abs(er, 2)} a year)`,
              detail: "Fees compound against you just like returns compound for you. Under 0.20% a year is excellent.",
              math: `On 10,000 invested, ${abs(er, 2)} costs about ${money(10000 * er, cur)} per year.`,
              lesson: "fees",
            }
          : er >= 0.0075
            ? {
                id: "high-cost",
                category: "value",
                level: "caution",
                score: -1,
                title: `Expensive fund (${abs(er, 2)} a year)`,
                detail: "Over 0.75% a year is a heavy drag for a passive investor. Cheaper funds tracking the same thing usually exist.",
                math: `Over 30 years, ${abs(er, 2)} a year can eat roughly ${abs(1 - Math.pow(1 - er, 30), 0)} of your final pot.`,
                lesson: "fees",
              }
            : {
                id: "mid-cost",
                category: "value",
                level: "neutral",
                score: 0,
                title: `Fund cost ${abs(er, 2)} a year`,
                detail: "Moderate fee. Fine, but check whether a cheaper fund tracks the same market.",
                lesson: "fees",
              },
      );
    }
  } else if (crypto) {
    out.push({
      id: "crypto-structure",
      category: "structure",
      level: "caution",
      score: -0.5,
      title: "Speculative asset",
      detail:
        "Crypto has no earnings, dividends or cash flow. Its price is set purely by what the next buyer will pay. Treat it as a small satellite position (a few percent), never the core.",
      lesson: "crypto",
    });
  } else {
    out.push({
      id: "single-stock",
      category: "structure",
      level: "neutral",
      score: 0,
      title: "Single company",
      detail:
        "Owning one company means you carry its specific risks. A common rule for beginners is to keep any single stock under about 5% of the portfolio.",
      lesson: "diversification",
    });
  }

  // ── Trend: price vs 200-day average ───────────────────────────────────────
  if (ind.sma200 !== null && ind.pctFromSma200 !== null) {
    const p = ind.pctFromSma200;
    const math = `200-day average = ${money(ind.sma200, cur)}. Price ${money(ind.price, cur)} ÷ ${money(ind.sma200, cur)} − 1 = ${pct(p)}.`;
    if (p > 0.25) {
      out.push({
        id: "stretched",
        category: "trend",
        level: "caution",
        score: -1,
        title: `Stretched ${abs(p, 0)} above its long-term trend`,
        detail:
          "The 200-day average is a slow line that smooths a year of prices. Being far above it means a lot of good news is already in the price; pauses or pullbacks are common from here. Patience tends to pay when adding.",
        math,
        lesson: "moving-averages",
      });
    } else if (p >= 0) {
      out.push({
        id: "uptrend",
        category: "trend",
        level: "neutral",
        score: 0.5,
        title: `Long-term trend is up (${pct(p)} vs 200-day average)`,
        detail: "Prices are above their one-year average line, which means the long march has been upward. Healthy, unexciting, exactly what a patient investor likes.",
        math,
        lesson: "moving-averages",
      });
    } else if (div) {
      out.push({
        id: "below-trend-fund",
        category: "trend",
        level: "opportunity",
        score: 1,
        title: `Below its long-term average (${pct(p)})`,
        detail:
          "For a broad fund, trading below the 200-day average has historically been a decent moment to keep buying: you get more units for the same money and the whole market rarely stays down for long.",
        math,
        lesson: "moving-averages",
      });
    } else {
      out.push({
        id: "below-trend",
        category: "trend",
        level: "caution",
        score: -1,
        title: `Below its long-term average (${pct(p)})`,
        detail: `For a single ${crypto ? "coin" : "company"} a downtrend can reflect real problems, not just mood. Read the news and the numbers before adding to it.`,
        math,
        lesson: "moving-averages",
      });
    }
  }

  // ── Golden / death cross ─────────────────────────────────────────────────
  if (ind.lastCross && ind.lastCross.daysAgo <= 40) {
    const up = ind.lastCross.direction === "up";
    out.push({
      id: up ? "golden-cross" : "death-cross",
      category: "trend",
      level: up ? "neutral" : div ? "neutral" : "caution",
      score: up ? 0.5 : div ? 0 : -0.5,
      title: `${up ? "Golden" : "Death"} cross ${ind.lastCross.daysAgo} trading days ago`,
      detail: up
        ? "The 50-day average crossed above the 200-day average. Traders read this as momentum turning positive. It is a slow, lagging signal, but a mildly good sign."
        : div
          ? "The 50-day average dropped below the 200-day average. Historically a mediocre timing tool; for regular investors in broad funds it is mostly noise."
          : "The 50-day average dropped below the 200-day average, meaning the recent months have been weaker than the past year. Worth understanding why.",
      math: `50-day ${money(ind.sma50 ?? 0, cur)} vs 200-day ${money(ind.sma200 ?? 0, cur)}.`,
      lesson: "moving-averages",
    });
  }

  // ── Dip from 52-week high ─────────────────────────────────────────────────
  {
    const d = ind.drawdownFromHigh;
    const math = `52-week high ${money(ind.high52, cur)}. Price ${money(ind.price, cur)} ÷ ${money(ind.high52, cur)} − 1 = ${pct(d)}.`;
    if (d > -0.05) {
      out.push({
        id: "near-high",
        category: "dip",
        level: "neutral",
        score: 0,
        title: "Near its 52-week high",
        detail: div
          ? "No discount right now. That is completely normal: markets spend a lot of time near highs, and buying at highs is fine for a regular monthly plan."
          : "No discount right now. Not a reason to avoid it, but not a special bargain either.",
        math,
        lesson: "drawdowns",
      });
    } else if (d > -0.1) {
      out.push({
        id: "pullback",
        category: "dip",
        level: "neutral",
        score: 0.5,
        title: `Small pullback (${pct(d)} from high)`,
        detail: "A 5-10% dip is everyday weather in markets. Slightly better prices than a month ago, nothing dramatic.",
        math,
        lesson: "drawdowns",
      });
    } else if (d > -0.2) {
      out.push({
        id: "correction",
        category: "dip",
        level: "opportunity",
        score: 1,
        title: `In a correction (${pct(d)} from high)`,
        detail: `A 10-20% drop is called a correction. They happen in most years. For ${label}, it means you buy the same thing cheaper than recent buyers did.`,
        math,
        lesson: "drawdowns",
      });
    } else if (d > -0.4) {
      out.push({
        id: "bear",
        category: "dip",
        level: "opportunity",
        score: div ? 1.5 : 1,
        title: `Deep discount (${pct(d)} from high)`,
        detail: div
          ? "A 20%+ drop is called a bear market. Scary in the moment, but for broad funds these have consistently been the best buying moments of each decade."
          : "Down more than 20%. Could be a bargain or a warning. Before adding, make sure the reason for the fall is temporary (mood) and not permanent (a broken business).",
        math,
        lesson: "drawdowns",
      });
    } else {
      out.push({
        id: "crash",
        category: "dip",
        level: div ? "opportunity" : "caution",
        score: div ? 1.5 : -0.5,
        title: `Down ${abs(d, 0)} from its high`,
        detail: div
          ? "A crash of this size is rare for a broad fund and has historically rewarded people who kept buying. Still, only invest money you will not need for years."
          : "A fall of this size often means something fundamental changed. Cheap can get cheaper. Do your homework before catching this knife.",
        math,
        lesson: "drawdowns",
      });
    }
  }

  // ── RSI ───────────────────────────────────────────────────────────────────
  if (ind.rsi14 !== null) {
    const r = ind.rsi14;
    const math = `RSI(14) = ${r.toFixed(0)}. Below 30 = oversold, above 70 = overbought.`;
    if (r < 30) {
      out.push({
        id: "oversold",
        category: "momentum",
        level: "opportunity",
        score: 1,
        title: `Oversold (RSI ${r.toFixed(0)})`,
        detail: "Recent selling has been intense. Oversold readings often precede a bounce; for a buyer this is a friendlier moment than a euphoric one.",
        math,
        lesson: "rsi",
      });
    } else if (r > 70) {
      out.push({
        id: "overbought",
        category: "momentum",
        level: "caution",
        score: -1,
        title: `Overbought (RSI ${r.toFixed(0)})`,
        detail: "Buyers have been piling in fast. Overbought does not mean it will fall, but it does mean you are paying after a rush. Waiting a few weeks often gets a calmer price.",
        math,
        lesson: "rsi",
      });
    } else {
      out.push({
        id: "rsi-mid",
        category: "momentum",
        level: "neutral",
        score: 0,
        title: `Momentum is balanced (RSI ${r.toFixed(0)})`,
        detail: "Neither a buying frenzy nor a panic. Nothing to act on here.",
        math,
        lesson: "rsi",
      });
    }
  }

  // ── 12-month momentum ─────────────────────────────────────────────────────
  if (ind.ret1y !== null) {
    const r = ind.ret1y;
    if (r < -0.35 && !div) {
      out.push({
        id: "sharp-decline",
        category: "momentum",
        level: "caution",
        score: -1,
        title: `Sharp one-year decline (${pct(r)})`,
        detail: "Falling this far in a year usually means the market has lost confidence in the story. That can be an opportunity, but only if you understand what changed.",
        lesson: "behavioural-traps",
      });
    } else if (r > 1) {
      out.push({
        id: "big-runup",
        category: "momentum",
        level: "caution",
        score: -0.5,
        title: `More than doubled in a year (${pct(r)})`,
        detail: "After a huge run, expectations are sky-high and disappointments are punished. Fear of missing out is the most expensive emotion in investing.",
        lesson: "behavioural-traps",
      });
    } else {
      out.push({
        id: "ret-1y",
        category: "momentum",
        level: "neutral",
        score: 0,
        title: `${pct(r)} over the past 12 months`,
        detail: "Total return including dividends, for context. One year tells you about mood; ten years tells you about the business.",
      });
    }
  }

  // ── Value ─────────────────────────────────────────────────────────────────
  if (t === "EQUITY") {
    const pe = quote.pe;
    const eps = quote.eps;
    const fwd = quote.forwardPe ? ` Forward P/E (next year's expected profit) is ${quote.forwardPe.toFixed(1)}.` : "";
    if ((pe === undefined || pe <= 0) && eps !== undefined && eps <= 0) {
      out.push({
        id: "unprofitable",
        category: "value",
        level: "caution",
        score: -1,
        title: "Not currently profitable",
        detail: "Earnings per share are negative, so there is no P/E ratio. Loss-making companies can be great investments, but they are bets on a future that has not arrived. Beginners usually do better with businesses that already make money.",
        math: `EPS (earnings per share, last 12 months) = ${money(eps, cur)}.`,
        lesson: "valuation",
      });
    } else if (pe !== undefined && pe > 0) {
      const math = `P/E = price ÷ earnings per share = ${money(quote.price, cur)} ÷ ${money(eps ?? quote.price / pe, cur)} = ${pe.toFixed(1)}. You pay ${pe.toFixed(0)} units of money for every 1 of yearly profit.${fwd}`;
      if (pe < 12) {
        out.push({
          id: "cheap",
          category: "value",
          level: "opportunity",
          score: 1,
          title: `Cheap on earnings (P/E ${pe.toFixed(1)})`,
          detail: "A low P/E means you pay little for each unit of profit. Sometimes that is a bargain, sometimes the market expects profits to shrink. Ask which.",
          math,
          lesson: "valuation",
        });
      } else if (pe <= 20) {
        out.push({
          id: "fair",
          category: "value",
          level: "neutral",
          score: 0.5,
          title: `Reasonably priced (P/E ${pe.toFixed(1)})`,
          detail: "Roughly in line with long-run market averages (15-20). You are paying a fair price for the profits.",
          math,
          lesson: "valuation",
        });
      } else if (pe <= 35) {
        out.push({
          id: "premium",
          category: "value",
          level: "neutral",
          score: 0,
          title: `Growth premium (P/E ${pe.toFixed(1)})`,
          detail: "Investors are paying extra because they expect profits to grow. Fine if growth arrives; painful if it stalls.",
          math,
          lesson: "valuation",
        });
      } else {
        out.push({
          id: "expensive",
          category: "value",
          level: "caution",
          score: -1,
          title: `Priced for perfection (P/E ${pe.toFixed(1)})`,
          detail: "At this price the company needs years of strong growth just to justify today's valuation. Any stumble tends to be punished hard.",
          math,
          lesson: "valuation",
        });
      }
    }
  } else if (crypto) {
    out.push({
      id: "no-valuation",
      category: "value",
      level: "neutral",
      score: 0,
      title: "No earnings to value",
      detail: "There is no P/E or dividend here. Price is driven by supply, demand and sentiment, which is why swings are so large.",
      lesson: "crypto",
    });
  }

  // ── Risk: volatility ──────────────────────────────────────────────────────
  if (ind.vol30 !== null) {
    const v = ind.vol30;
    const monthly = v / Math.sqrt(12);
    const math = `Annualised volatility (last 30 days) = ${abs(v, 0)}. A typical month moves about ±${abs(monthly, 0)}.`;
    if (v < 0.15) {
      out.push({ id: "calm", category: "risk", level: "neutral", score: 0, title: `Calm (volatility ${abs(v, 0)})`, detail: "Price swings are gentle. Easy to hold through.", math, lesson: "volatility" });
    } else if (v < 0.3) {
      out.push({ id: "normal-vol", category: "risk", level: "neutral", score: 0, title: `Normal swings (volatility ${abs(v, 0)})`, detail: "Typical for stocks. Expect months where you are down 5-8% and shrug.", math, lesson: "volatility" });
    } else if (v < 0.6) {
      out.push({ id: "bumpy", category: "risk", level: "caution", score: -0.5, title: `Bumpy ride (volatility ${abs(v, 0)})`, detail: "Expect big swings both ways. Size the position so a 30% drop would annoy you, not ruin you.", math, lesson: "volatility" });
    } else {
      out.push({ id: "wild", category: "risk", level: "caution", score: -1, title: `Very volatile (volatility ${abs(v, 0)})`, detail: "Moves of 10% in a day are normal here. Only money you can afford to see halve belongs in something this wild.", math, lesson: "volatility" });
    }
  }

  // ── Income ────────────────────────────────────────────────────────────────
  if (quote.dividendYield !== undefined && quote.dividendYield > 0) {
    const y = quote.dividendYield;
    const math = `Dividend yield = yearly dividends ÷ price = ${abs(y, 2)}. On 1,000 invested that is about ${money(1000 * y, cur)} a year in cash.`;
    if (y > 0.06) {
      out.push({ id: "high-yield", category: "income", level: "caution", score: -0.5, title: `Very high dividend yield (${abs(y, 1)})`, detail: "Yields this high often mean the price has fallen because investors fear the dividend will be cut. Verify the payout is sustainable.", math, lesson: "dividends" });
    } else {
      out.push({ id: "dividend", category: "income", level: "neutral", score: 0.25, title: `Pays a ${abs(y, 1)} dividend`, detail: "Part of your return arrives as cash you can reinvest. Reinvested dividends have historically been a large share of total stock returns.", math, lesson: "dividends" });
    }
  }

  return out;
}

export function buildVerdict(quote: Quote, ind: Indicators, signals: Signal[]): Verdict {
  const score = Math.max(-4, Math.min(4, signals.reduce((a, s) => a + s.score, 0)));
  const div = isDiversified(quote.type);
  let stance: Stance;
  if (score >= 2) stance = "accumulate";
  else if (score >= 0.5) stance = "steady";
  else if (score > -1) stance = "patience";
  else stance = "caution";

  const headline: Record<Stance, string> = {
    accumulate: "Favourable moment to add",
    steady: "Steady as she goes",
    patience: "No rush",
    caution: "Warning lights on",
  };

  const above = ind.pctFromSma200 === null ? "" : ind.pctFromSma200 >= 0 ? "above" : "below";
  const parts: string[] = [];
  parts.push(`${quote.name} sits ${abs(ind.drawdownFromHigh, 0)} below its 52-week high`);
  if (above) parts.push(`${above} its 200-day trend line`);
  if (ind.rsi14 !== null) parts.push(`with momentum reading ${ind.rsi14.toFixed(0)} on RSI`);
  const summary = parts.join(", ") + ".";

  const nextStep: Record<Stance, string> = {
    accumulate: div
      ? "If this fund is part of your plan, this is a reasonable time for your regular contribution plus a little extra. Never more than you would be calm seeing drop another 20%."
      : "Conditions are friendlier than usual for buying. Still, keep any single holding a small slice of the whole, and write down why you are buying before you click.",
    steady: "Nothing special about today's price. Keep your regular monthly contribution going and ignore the noise.",
    patience: "The price is not offering a discount and may be a bit stretched. Your scheduled contribution still goes in; extra money can wait for a better moment.",
    caution: div
      ? "Several caution flags, mostly about price being stretched. Stick to your plan, skip extra contributions for now."
      : "Several warning lights. Understand each one before putting new money in. Skipping is a perfectly good decision.",
  };

  return {
    stance,
    score: Math.round(score * 10) / 10,
    headline: headline[stance],
    summary,
    nextStep: nextStep[stance],
    caveat:
      "These are rule-based observations about the current price, not a forecast. Nobody can predict where prices go next. Use them to time extra contributions, never to replace your plan.",
  };
}

export function buildChecklist(quote: Quote, ind: Indicators, profile: Profile | null): ChecklistItem[] {
  const t = quote.type;
  const div = isDiversified(t);
  const items: ChecklistItem[] = [];

  items.push(
    div
      ? { id: "diversified", label: "Diversified across many companies", status: "pass", note: "A fund. One company failing barely dents you.", lesson: "index-funds" }
      : t === "CRYPTO"
        ? { id: "diversified", label: "Diversified across many companies", status: "warn", note: "A single speculative asset. Keep it to a few percent of the whole.", lesson: "crypto" }
        : { id: "diversified", label: "Diversified across many companies", status: "warn", note: "A single company. Keep it under about 5% of your portfolio.", lesson: "diversification" },
  );

  if (ind.pctFromSma200 !== null) {
    items.push({
      id: "trend",
      label: "Long-term trend intact (above 200-day average)",
      status: ind.pctFromSma200 >= 0 ? "pass" : div ? "warn" : "fail",
      note: `${pct(ind.pctFromSma200)} versus the 200-day average.`,
      lesson: "moving-averages",
    });
    items.push({
      id: "not-stretched",
      label: "Not overextended (less than 15% above trend)",
      status: ind.pctFromSma200 < 0.15 ? "pass" : "warn",
      note: ind.pctFromSma200 < 0.15 ? "Price is close to its long-term line." : "A lot of optimism is already in the price.",
      lesson: "moving-averages",
    });
  }

  if (t === "EQUITY") {
    const eps = quote.eps;
    items.push({
      id: "profitable",
      label: "Profitable business",
      status: eps === undefined ? "na" : eps > 0 ? "pass" : "fail",
      note: eps === undefined ? "No earnings data." : `Earnings per share ${money(eps, quote.currency)} over the last year.`,
      lesson: "valuation",
    });
    items.push({
      id: "valuation",
      label: "Reasonable valuation (P/E under 30)",
      status: quote.pe === undefined || quote.pe <= 0 ? "na" : quote.pe < 30 ? "pass" : "warn",
      note: quote.pe === undefined || quote.pe <= 0 ? "No P/E (no profit or no data)." : `P/E ${quote.pe.toFixed(1)}.`,
      lesson: "valuation",
    });
  } else if (div) {
    items.push({
      id: "cost",
      label: "Low cost (expense ratio under 0.5%)",
      status: profile?.expenseRatio === undefined ? "na" : profile.expenseRatio < 0.005 ? "pass" : "warn",
      note: profile?.expenseRatio === undefined ? "Expense ratio not reported. Check the fund's factsheet." : `${abs(profile.expenseRatio, 2)} a year.`,
      lesson: "fees",
    });
  } else {
    items.push({ id: "profitable", label: "Profitable business", status: "na", note: "Not a business. No earnings exist.", lesson: "crypto" });
  }

  if (ind.vol30 !== null) {
    items.push({
      id: "volatility",
      label: "Volatility you can live with (under 40%)",
      status: ind.vol30 < 0.4 ? "pass" : "warn",
      note: `About ±${abs(ind.vol30 / Math.sqrt(12), 0)} in a typical month.`,
      lesson: "volatility",
    });
  }

  items.push({
    id: "discount",
    label: "Buying at a discount (10%+ below 52-week high)",
    status: ind.drawdownFromHigh <= -0.1 ? "pass" : "na",
    note: ind.drawdownFromHigh <= -0.1 ? `${pct(ind.drawdownFromHigh)} from the high.` : "No discount. Fine for a regular plan, not a special moment.",
    lesson: "drawdowns",
  });

  items.push({
    id: "thesis",
    label: "You can explain in one sentence how it makes money",
    status: "na",
    note: "Only you can tick this one. If you cannot, read more before buying.",
    lesson: "how-to-think",
  });

  return items;
}

export function analyze(quote: Quote, candles: Candle[], profile: Profile | null): Analysis {
  const closes = candles.map((c) => c.close);
  const ind = computeIndicators(candles);
  // Use live price for the very latest point if the history is a day behind.
  if (quote.price > 0) ind.price = quote.price;
  if (ind.sma200) ind.pctFromSma200 = ind.price / ind.sma200 - 1;
  if (ind.sma50) ind.pctFromSma50 = ind.price / ind.sma50 - 1;
  ind.high52 = Math.max(ind.high52, quote.high52 ?? 0, ind.price);
  ind.drawdownFromHigh = ind.price / ind.high52 - 1;

  const signals = buildSignals(quote, ind, profile);
  const verdict = buildVerdict(quote, ind, signals);
  const checklist = buildChecklist(quote, ind, profile);
  const s50 = I.sma(closes, 50);
  const s200 = I.sma(closes, 200);
  const chart: ChartPoint[] = candles.map((c, i) => ({ date: c.date, close: c.close, sma50: s50[i], sma200: s200[i] }));
  return {
    symbol: quote.symbol,
    name: quote.name,
    type: quote.type,
    currency: quote.currency,
    asOf: new Date().toISOString(),
    quote,
    profile,
    indicators: ind,
    signals,
    verdict,
    checklist,
    chart,
    historyDays: candles.length,
  };
}
