import type { Lesson } from "../types";
import { MODULES } from "../modules";

import { lesson as whatIsInvesting } from "./what-is-investing";
import { lesson as stocksBondsFunds } from "./stocks-bonds-funds";
import { lesson as compounding } from "./compounding";
import { lesson as riskAndReturn } from "./risk-and-return";
import { lesson as inflationAndCash } from "./inflation-and-cash";
import { lesson as beforeYouInvest } from "./before-you-invest";
import { lesson as goalsAndHorizon } from "./goals-and-horizon";
import { lesson as indexFunds } from "./index-funds";
import { lesson as diversification } from "./diversification";
import { lesson as dollarCostAveraging } from "./dollar-cost-averaging";
import { lesson as fees } from "./fees";
import { lesson as brokersAndTaxes } from "./brokers-and-taxes";
import { lesson as readingAChart } from "./reading-a-chart";
import { lesson as valuation } from "./valuation";
import { lesson as dividends } from "./dividends";
import { lesson as movingAverages } from "./moving-averages";
import { lesson as rsi } from "./rsi";
import { lesson as drawdowns } from "./drawdowns";
import { lesson as volatility } from "./volatility";
import { lesson as howToThink } from "./how-to-think";
import { lesson as behaviouralTraps } from "./behavioural-traps";
import { lesson as positionSizing } from "./position-sizing";
import { lesson as crypto } from "./crypto";
import { lesson as globalInvesting } from "./global-investing";
import { lesson as scamsAndRedFlags } from "./scams-and-red-flags";
import { lesson as usingBearings } from "./using-bearings";

const ALL: Lesson[] = [
  whatIsInvesting,
  stocksBondsFunds,
  compounding,
  riskAndReturn,
  inflationAndCash,
  beforeYouInvest,
  goalsAndHorizon,
  indexFunds,
  diversification,
  dollarCostAveraging,
  fees,
  brokersAndTaxes,
  readingAChart,
  valuation,
  dividends,
  movingAverages,
  rsi,
  drawdowns,
  volatility,
  howToThink,
  behaviouralTraps,
  positionSizing,
  crypto,
  globalInvesting,
  scamsAndRedFlags,
  usingBearings,
];

/** Lessons in curriculum order (module order, then the order listed in each module). */
export const LESSONS: Lesson[] = MODULES.flatMap((m) =>
  m.lessonIds.map((id) => {
    const l = ALL.find((x) => x.id === id);
    if (!l) throw new Error(`Lesson "${id}" is listed in modules.ts but has no content file`);
    return l;
  }),
);

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export function lessonIndex(id: string) {
  return LESSONS.findIndex((l) => l.id === id);
}

export function nextLesson(id: string): Lesson | undefined {
  const i = lessonIndex(id);
  return i >= 0 ? LESSONS[i + 1] : undefined;
}

export function prevLesson(id: string): Lesson | undefined {
  const i = lessonIndex(id);
  return i > 0 ? LESSONS[i - 1] : undefined;
}

export const TOTAL_MINUTES = LESSONS.reduce((a, l) => a + l.minutes, 0);
