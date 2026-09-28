// Mirrors of the server's response shapes.

export type AssetType = "EQUITY" | "ETF" | "CRYPTO" | "INDEX" | "FUND" | "CURRENCY" | "COMMODITY" | "OTHER";

export interface Quote {
  symbol: string;
  name: string;
  type: AssetType;
  currency: string;
  exchange: string;
  price: number;
  change: number;
  changePct: number;
  previousClose?: number;
  open?: number;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  avgVolume?: number;
  marketCap?: number;
  pe?: number;
  forwardPe?: number;
  pb?: number;
  eps?: number;
  dividendYield?: number;
  high52?: number;
  low52?: number;
  avg50?: number;
  avg200?: number;
  marketState?: string;
  updatedAt: string;
}

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

export interface Profile {
  sector?: string;
  industry?: string;
  country?: string;
  website?: string;
  summary?: string;
  employees?: number;
  beta?: number;
  profitMargin?: number;
  revenueGrowth?: number;
  returnOnEquity?: number;
  debtToEquity?: number;
  payoutRatio?: number;
  targetMeanPrice?: number;
  recommendation?: string;
  totalAssets?: number;
  expenseRatio?: number;
  category?: string;
}

export interface SearchHit {
  symbol: string;
  name: string;
  exchange: string;
  type: AssetType;
}

export type HistoryRange = "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y" | "10y" | "max";

export type SignalLevel = "opportunity" | "neutral" | "caution";
export type Stance = "accumulate" | "steady" | "patience" | "caution";

export interface Signal {
  id: string;
  category: "trend" | "dip" | "momentum" | "value" | "risk" | "income" | "structure";
  level: SignalLevel;
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

export interface PulseItem {
  symbol: string;
  label: string;
  region: string;
  quote: Quote;
}

export interface WatchItem {
  id: number;
  symbol: string;
  name: string;
  type: string;
  currency: string;
  notes: string;
  thesis: string;
  addedAt: string;
}

export interface WatchRow {
  item: WatchItem;
  ok: boolean;
  error?: string;
  quote?: Quote;
  verdict?: Verdict;
  indicators?: {
    drawdownFromHigh: number;
    pctFromSma200: number | null;
    rsi14: number | null;
    ret1y: number | null;
    vol30: number | null;
  };
  spark?: number[];
  rules?: number;
}

export interface AlertRule {
  id: number;
  symbol: string | null;
  type: string;
  params: Record<string, any>;
  state: Record<string, any>;
  enabled: boolean;
  cooldownHours: number;
  lastFiredAt: string | null;
  createdAt: string;
}

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
  type: string;
  label: string;
  description: string;
  needsSymbol: boolean;
  level: "opportunity" | "caution" | "info" | "reminder";
  params: RuleParamMeta[];
  defaultCooldownHours: number;
  lesson?: string;
}

export interface AlertEvent {
  id: number;
  ruleId: number | null;
  symbol: string | null;
  type: string;
  level: "info" | "opportunity" | "caution" | "reminder";
  title: string;
  message: string;
  data: Record<string, any>;
  emailed: boolean;
  read: boolean;
  createdAt: string;
}

export interface CheckRun {
  id: number;
  startedAt: string;
  finishedAt: string | null;
  rules: number;
  fired: number;
  emailed: number;
  error: string | null;
}

export interface SchedulerStatus {
  cron: string;
  running: boolean;
  lastCheckAt: string | null;
  lastDigestAt: string | null;
  emailConfigured: boolean;
  digest: { enabled: boolean; weekday: number; hour: number };
  recentRuns: CheckRun[];
}

export interface RunSummary {
  startedAt: string;
  finishedAt: string;
  rules: number;
  fired: number;
  emailed: number;
  errors: string[];
  events: AlertEvent[];
}

export interface Txn {
  id: number;
  symbol: string;
  name: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  fee: number;
  currency: string;
  note: string;
  at: string;
  fx?: number;
}

export interface Holding {
  symbol: string;
  name: string;
  currency: string;
  qty: number;
  avgCost: number;
  cost: number;
  price: number;
  value: number;
  gain: number;
  gainPct: number;
  weight: number;
  dayChangePct: number;
  valueUsd: number;
  costUsd: number;
}

export interface Portfolio {
  cash: number;
  startingCash: number;
  holdings: Holding[];
  totals: {
    invested: number;
    value: number;
    gain: number;
    gainPct: number;
    equity: number;
    totalReturnPct: number;
  };
  txnCount: number;
}

export interface Progress {
  lessonId: string;
  completed: boolean;
  quizScore: number | null;
  quizTotal: number | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface AppSettings {
  email: {
    enabled: boolean;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    passSet?: boolean;
    from: string;
    to: string;
  };
  schedule: { cron: string };
  digest: { enabled: boolean; weekday: number; hour: number };
  dca: { enabled: boolean; dayOfMonth: number; amount: number; currency: string; note: string };
  display: { name: string; currency: string; appUrl: string };
  paper: { startingCash: number };
  onboarding: { done: boolean };
}

export interface ProjectionInput {
  initial: number;
  monthly: number;
  years: number;
  annualReturn: number;
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
  probLoss: number;
  finalMedian: number;
}

export interface HistoryStats {
  symbol: string;
  range: string;
  years: number;
  cagr: number | null;
  annualVol: number | null;
  maxDrawdown: number;
  suggestedReturn: number;
  suggestedVol: number;
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

export const STANCE_LABEL: Record<Stance, string> = {
  accumulate: "Accumulate",
  steady: "Steady",
  patience: "Patience",
  caution: "Caution",
};
