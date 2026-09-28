import type { Module } from "./types";

export const MODULES: Module[] = [
  {
    id: "foundations",
    number: 1,
    title: "Getting your bearings",
    tagline: "What investing is, and why time is the main ingredient.",
    description: "The vocabulary and the handful of ideas everything else rests on: ownership, compounding, risk, and why cash quietly loses.",
    lessonIds: ["what-is-investing", "stocks-bonds-funds", "compounding", "risk-and-return", "inflation-and-cash"],
  },
  {
    id: "plan",
    number: 2,
    title: "Charting the course",
    tagline: "Build a plan you can follow on autopilot.",
    description: "Emergency fund first, then goals, then the boring, brilliant machinery: index funds, diversification, monthly investing, and keeping fees low.",
    lessonIds: ["before-you-invest", "goals-and-horizon", "index-funds", "diversification", "dollar-cost-averaging", "fees", "brokers-and-taxes"],
  },
  {
    id: "numbers",
    number: 3,
    title: "Reading the instruments",
    tagline: "Charts, ratios and indicators, explained with arithmetic.",
    description: "What a price chart says, what P/E and dividend yield mean, and how moving averages, RSI, drawdowns and volatility work. This is the maths behind every Bearings signal.",
    lessonIds: ["reading-a-chart", "valuation", "dividends", "moving-averages", "rsi", "drawdowns", "volatility"],
  },
  {
    id: "mindset",
    number: 4,
    title: "Keeping a steady hand",
    tagline: "Think like an investor, not a gambler.",
    description: "The behavioural traps that cost people the most, how to size positions, what to do about crypto, investing globally from Georgia, and spotting scams.",
    lessonIds: ["how-to-think", "behavioural-traps", "position-sizing", "crypto", "global-investing", "scams-and-red-flags", "using-bearings"],
  },
];

export const ALL_LESSON_IDS = MODULES.flatMap((m) => m.lessonIds);
