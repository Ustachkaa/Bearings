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
  /** Fraction: 0.015 means 1.5 % */
  dividendYield?: number;
  high52?: number;
  low52?: number;
  avg50?: number;
  avg200?: number;
  marketState?: string;
  updatedAt: string;
}

export interface Candle {
  /** YYYY-MM-DD */
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
export const HISTORY_RANGES: HistoryRange[] = ["1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "max"];
