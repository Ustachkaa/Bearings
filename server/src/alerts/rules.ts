import type { AlertRule } from "../db.js";
import type { Analysis } from "../market/signals.js";
import type { Quote } from "../market/types.js";

export type RuleType =
  | "price_below"
  | "price_above"
  | "drop_from_high"
  | "rsi_below"
  | "rsi_above"
  | "cross_sma200"
  | "golden_cross"
  | "death_cross"
  | "day_move"
  | "smart"
  | "dca_reminder";

export interface RuleParamMeta {
  key: string;
  label: string;
  type: "number" | "select";
  default: number | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { value: string; label: string }[];
}

export interface RuleMeta {
  type: RuleType;
  label: string;
  description: string;
  needsSymbol: boolean;
  level: "opportunity" | "caution" | "info" | "reminder";
  params: RuleParamMeta[];
  defaultCooldownHours: number;
  lesson?: string;
}

export const RULE_META: RuleMeta[] = [
  {
    type: "smart",
    label: "Bearings signal changes",
    description: "Email me when the overall stance for this asset turns to Accumulate (a favourable moment to add) or drops to Caution.",
    needsSymbol: true,
    level: "opportunity",
    params: [],
    defaultCooldownHours: 0,
    lesson: "how-to-think",
  },
  {
    type: "drop_from_high",
    label: "Dip from 52-week high",
    description: "Fires when the price is at least this far below its 52-week high. Good for buying broad funds on sale.",
    needsSymbol: true,
    level: "opportunity",
    params: [{ key: "pct", label: "Drop of at least", type: "number", default: 10, min: 1, max: 90, step: 1, unit: "%" }],
    defaultCooldownHours: 168,
    lesson: "drawdowns",
  },
  {
    type: "price_below",
    label: "Price falls below",
    description: "Fires when the price closes below a level you choose.",
    needsSymbol: true,
    level: "opportunity",
    params: [{ key: "target", label: "Price", type: "number", default: 0, min: 0, step: 0.01 }],
    defaultCooldownHours: 24,
  },
  {
    type: "price_above",
    label: "Price rises above",
    description: "Fires when the price rises above a level you choose. Useful for taking some profit or rebalancing.",
    needsSymbol: true,
    level: "info",
    params: [{ key: "target", label: "Price", type: "number", default: 0, min: 0, step: 0.01 }],
    defaultCooldownHours: 24,
  },
  {
    type: "rsi_below",
    label: "Oversold (RSI below)",
    description: "Fires when the 14-day RSI falls below a threshold. Below 30 is the classic oversold level.",
    needsSymbol: true,
    level: "opportunity",
    params: [{ key: "value", label: "RSI below", type: "number", default: 30, min: 5, max: 50, step: 1 }],
    defaultCooldownHours: 72,
    lesson: "rsi",
  },
  {
    type: "rsi_above",
    label: "Overbought (RSI above)",
    description: "Fires when the 14-day RSI rises above a threshold. Above 70 is the classic overbought level.",
    needsSymbol: true,
    level: "caution",
    params: [{ key: "value", label: "RSI above", type: "number", default: 70, min: 50, max: 95, step: 1 }],
    defaultCooldownHours: 72,
    lesson: "rsi",
  },
  {
    type: "cross_sma200",
    label: "Crosses the 200-day average",
    description: "Fires when the price moves from one side of its 200-day average to the other. Fires only on the change.",
    needsSymbol: true,
    level: "info",
    params: [
      {
        key: "direction",
        label: "Direction",
        type: "select",
        default: "both",
        options: [
          { value: "both", label: "Either way" },
          { value: "below", label: "Falls below" },
          { value: "above", label: "Rises above" },
        ],
      },
    ],
    defaultCooldownHours: 0,
    lesson: "moving-averages",
  },
  {
    type: "golden_cross",
    label: "Golden cross",
    description: "Fires when the 50-day average crosses above the 200-day average. A slow signal that momentum has turned positive.",
    needsSymbol: true,
    level: "opportunity",
    params: [],
    defaultCooldownHours: 0,
    lesson: "moving-averages",
  },
  {
    type: "death_cross",
    label: "Death cross",
    description: "Fires when the 50-day average crosses below the 200-day average.",
    needsSymbol: true,
    level: "caution",
    params: [],
    defaultCooldownHours: 0,
    lesson: "moving-averages",
  },
  {
    type: "day_move",
    label: "Big one-day move",
    description: "Fires when the price moves more than this much in a single day, either direction.",
    needsSymbol: true,
    level: "info",
    params: [{ key: "pct", label: "Move of at least", type: "number", default: 5, min: 1, max: 50, step: 0.5, unit: "%" }],
    defaultCooldownHours: 20,
    lesson: "volatility",
  },
  {
    type: "dca_reminder",
    label: "Monthly investing reminder",
    description: "A reminder on a chosen day each month to make your regular contribution, with a snapshot of your watchlist.",
    needsSymbol: false,
    level: "reminder",
    params: [
      { key: "dayOfMonth", label: "Day of month", type: "number", default: 1, min: 1, max: 28, step: 1 },
      { key: "amount", label: "Amount", type: "number", default: 100, min: 0, step: 10 },
    ],
    defaultCooldownHours: 0,
    lesson: "dollar-cost-averaging",
  },
];

export const ruleMeta = (type: string) => RULE_META.find((m) => m.type === type);

export interface EvalContext {
  quote?: Quote;
  analysis?: Analysis;
  now: Date;
}

export interface EvalResult {
  fire: boolean;
  level: "info" | "opportunity" | "caution" | "reminder";
  title: string;
  message: string;
  data?: Record<string, any>;
  /** Persisted back to the rule for stateful checks. */
  newState?: Record<string, any>;
}

const fmt = (x: number, cur = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: x < 10 ? 4 : 2 }).format(x);
const pct = (x: number, d = 1) => `${x >= 0 ? "+" : ""}${(x * 100).toFixed(d)}%`;

function inCooldown(rule: AlertRule, now: Date) {
  if (!rule.lastFiredAt || rule.cooldownHours <= 0) return false;
  return now.getTime() - new Date(rule.lastFiredAt).getTime() < rule.cooldownHours * 3600_000;
}

export function evaluateRule(rule: AlertRule, ctx: EvalContext): EvalResult | null {
  const q = ctx.quote;
  const a = ctx.analysis;
  const p = rule.params || {};
  const st = rule.state || {};
  const now = ctx.now;
  const cur = q?.currency ?? "USD";
  const name = q?.name ?? rule.symbol ?? "";

  switch (rule.type as RuleType) {
    case "price_below": {
      if (!q) return null;
      const hit = q.price < Number(p.target);
      if (!hit || inCooldown(rule, now)) return { fire: false, level: "info", title: "", message: "" };
      return {
        fire: true,
        level: "opportunity",
        title: `${q.symbol} fell below ${fmt(Number(p.target), cur)}`,
        message: `${name} is trading at ${fmt(q.price, cur)}, below your ${fmt(Number(p.target), cur)} level. Check the analysis before acting: a lower price is only a bargain if the reasons for owning it have not changed.`,
        data: { price: q.price, target: p.target },
      };
    }
    case "price_above": {
      if (!q) return null;
      const hit = q.price > Number(p.target);
      if (!hit || inCooldown(rule, now)) return { fire: false, level: "info", title: "", message: "" };
      return {
        fire: true,
        level: "info",
        title: `${q.symbol} rose above ${fmt(Number(p.target), cur)}`,
        message: `${name} is trading at ${fmt(q.price, cur)}, above your ${fmt(Number(p.target), cur)} level. If this holding has grown into too large a slice of your portfolio, this may be a moment to rebalance.`,
        data: { price: q.price, target: p.target },
      };
    }
    case "drop_from_high": {
      if (!a) return null;
      const dd = a.indicators.drawdownFromHigh;
      const hit = dd <= -Number(p.pct) / 100;
      if (!hit || inCooldown(rule, now)) return { fire: false, level: "info", title: "", message: "" };
      return {
        fire: true,
        level: "opportunity",
        title: `${a.symbol} is ${Math.abs(dd * 100).toFixed(0)}% below its 52-week high`,
        message: `${name} is at ${fmt(a.indicators.price, cur)} versus a high of ${fmt(a.indicators.high52, cur)}. You asked to hear about dips of ${p.pct}% or more. The Bearings stance is "${a.verdict.headline}". ${a.verdict.nextStep}`,
        data: { drawdown: dd, price: a.indicators.price, high: a.indicators.high52 },
      };
    }
    case "rsi_below":
    case "rsi_above": {
      if (!a || a.indicators.rsi14 === null) return null;
      const r = a.indicators.rsi14;
      const below = rule.type === "rsi_below";
      const hit = below ? r < Number(p.value) : r > Number(p.value);
      if (!hit || inCooldown(rule, now)) return { fire: false, level: "info", title: "", message: "" };
      return {
        fire: true,
        level: below ? "opportunity" : "caution",
        title: `${a.symbol} RSI is ${r.toFixed(0)} (${below ? "oversold" : "overbought"})`,
        message: below
          ? `Selling in ${name} has been intense: RSI ${r.toFixed(0)} is below your ${p.value} threshold. Oversold readings often precede a bounce. Price ${fmt(a.indicators.price, cur)}.`
          : `Buying in ${name} has been frantic: RSI ${r.toFixed(0)} is above your ${p.value} threshold. Not a sell signal, but a poor moment to chase. Price ${fmt(a.indicators.price, cur)}.`,
        data: { rsi: r, price: a.indicators.price },
      };
    }
    case "cross_sma200": {
      if (!a || a.indicators.sma200 === null) return null;
      const side = a.indicators.price >= a.indicators.sma200 ? "above" : "below";
      const prev = st.side as string | undefined;
      const newState = { side };
      if (!prev || prev === side) return { fire: false, level: "info", title: "", message: "", newState };
      const dir = p.direction ?? "both";
      if (dir !== "both" && dir !== side) return { fire: false, level: "info", title: "", message: "", newState };
      return {
        fire: true,
        level: side === "above" ? "opportunity" : "info",
        title: `${a.symbol} crossed ${side} its 200-day average`,
        message: `${name} moved from ${prev} to ${side} its 200-day average (${fmt(a.indicators.sma200, cur)}). Price ${fmt(a.indicators.price, cur)}. The 200-day line is a slow gauge of the long-term trend; a cross is worth noting, not panicking over.`,
        data: { side, sma200: a.indicators.sma200, price: a.indicators.price },
        newState,
      };
    }
    case "golden_cross":
    case "death_cross": {
      if (!a || a.indicators.sma50 === null || a.indicators.sma200 === null) return null;
      const rel = a.indicators.sma50 >= a.indicators.sma200 ? "above" : "below";
      const prev = st.rel as string | undefined;
      const newState = { rel };
      if (!prev || prev === rel) return { fire: false, level: "info", title: "", message: "", newState };
      const golden = rel === "above";
      if ((rule.type === "golden_cross") !== golden) return { fire: false, level: "info", title: "", message: "", newState };
      return {
        fire: true,
        level: golden ? "opportunity" : "caution",
        title: `${golden ? "Golden" : "Death"} cross on ${a.symbol}`,
        message: `${name}'s 50-day average (${fmt(a.indicators.sma50, cur)}) crossed ${rel} its 200-day average (${fmt(a.indicators.sma200, cur)}). ${
          golden ? "Momentum has turned positive over the past months." : "Recent months have been weaker than the past year."
        } This is a slow, lagging signal. Treat it as context, not a command.`,
        data: { sma50: a.indicators.sma50, sma200: a.indicators.sma200 },
        newState,
      };
    }
    case "day_move": {
      if (!q) return null;
      const hit = Math.abs(q.changePct) >= Number(p.pct);
      if (!hit || inCooldown(rule, now)) return { fire: false, level: "info", title: "", message: "" };
      const up = q.changePct > 0;
      return {
        fire: true,
        level: "info",
        title: `${q.symbol} ${up ? "jumped" : "dropped"} ${Math.abs(q.changePct).toFixed(1)}% today`,
        message: `${name} moved ${pct(q.changePct / 100)} today to ${fmt(q.price, cur)}. Big moves attract headlines. Before reacting, ask: has anything changed about why I own (or want) this?`,
        data: { changePct: q.changePct, price: q.price },
      };
    }
    case "smart": {
      if (!a) return null;
      const stance = a.verdict.stance;
      const prev = st.stance as string | undefined;
      const newState = { stance };
      if (!prev || prev === stance) return { fire: false, level: "info", title: "", message: "", newState };
      const toAccumulate = stance === "accumulate";
      const toCaution = stance === "caution";
      if (!toAccumulate && !toCaution) return { fire: false, level: "info", title: "", message: "", newState };
      const top = a.signals.filter((s) => s.level !== "neutral").slice(0, 3).map((s) => `• ${s.title}`).join("\n");
      return {
        fire: true,
        level: toAccumulate ? "opportunity" : "caution",
        title: `${a.symbol}: stance changed to "${a.verdict.headline}"`,
        message: `${a.verdict.summary}\n\n${top}\n\n${a.verdict.nextStep}`,
        data: { stance, prev, score: a.verdict.score },
        newState,
      };
    }
    case "dca_reminder": {
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const due = now.getDate() >= Number(p.dayOfMonth ?? 1);
      if (!due || st.lastMonth === month) return { fire: false, level: "reminder", title: "", message: "" };
      const amount = Number(p.amount ?? 0);
      return {
        fire: true,
        level: "reminder",
        title: "Time for your regular investment",
        message: `It is your investing day. Your plan: ${amount ? fmt(amount, String(p.currency ?? "USD")) : "your usual amount"} into ${rule.symbol ?? "your chosen funds"}. Whatever the market did this month, the plan is the plan. Open Bearings to see current stances before you buy.`,
        data: { amount, month },
        newState: { lastMonth: month },
      };
    }
    default:
      return null;
  }
}
