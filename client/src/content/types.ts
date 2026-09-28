/**
 * Lesson content schema. Lessons are plain data so they can be rendered,
 * searched and linked from the signals engine (each signal names a lesson id).
 *
 * Inline text supports a tiny markdown subset: **bold**, *italic*, `code`
 * and [links](/learn/lesson-id) or [links](https://…).
 */

export type WidgetId =
  | "compound" // compound growth calculator
  | "rule-72" // years to double
  | "dca" // dollar-cost averaging with a real-history backtest
  | "position-size" // how much to buy given risk tolerance
  | "fee-drag" // cost of fees over time
  | "inflation" // purchasing power erosion
  | "pe" // price-to-earnings explorer
  | "dividend" // dividend yield & reinvestment
  | "drawdown" // recovery math: -50% needs +100%
  | "volatility" // typical swing sizes from annualised volatility
  | "currency" // GEL / USD / EUR exposure
  | "allocation" // stocks/bonds/cash mix explorer
  | "goal" // goal planner: how much per month to reach X
  | "moving-averages" // live 50/200-day chart on a chosen ticker
  | "rsi" // live RSI on a chosen ticker
  | "live-chart" // live price chart reader
  | "risk-quiz" // short risk-tolerance questionnaire
  | "emergency-fund"; // months of expenses calculator

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; tone: "tip" | "warn" | "note" | "key"; title?: string; text: string }
  /** A worked numeric example: each step is one line of arithmetic in words. */
  | { type: "example"; title: string; steps: string[]; result: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "terms"; terms: { term: string; def: string }[] }
  | { type: "quote"; text: string; by?: string }
  | { type: "steps"; title?: string; steps: { title: string; text: string }[] }
  | { type: "widget"; widget: WidgetId; props?: Record<string, unknown>; caption?: string };

export interface QuizQuestion {
  q: string;
  options: string[];
  /** Index into options */
  answer: number;
  explain: string;
}

export interface Lesson {
  /** URL slug. Signals in the server reference these ids. */
  id: string;
  module: ModuleId;
  title: string;
  subtitle: string;
  minutes: number;
  blocks: Block[];
  quiz: QuizQuestion[];
  takeaways: string[];
}

export type ModuleId = "foundations" | "plan" | "numbers" | "mindset";

export interface Module {
  id: ModuleId;
  number: number;
  title: string;
  tagline: string;
  description: string;
  lessonIds: string[];
}
