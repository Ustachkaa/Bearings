import type { WidgetId } from "@/content/types";
import { Compound } from "./Compound";
import { Rule72 } from "./Rule72";
import { Dca } from "./Dca";
import { PositionSize } from "./PositionSize";
import { FeeDrag } from "./FeeDrag";
import { Inflation } from "./Inflation";
import { Pe } from "./Pe";
import { Dividend } from "./Dividend";
import { Drawdown } from "./Drawdown";
import { Volatility } from "./Volatility";
import { Currency } from "./Currency";
import { Allocation } from "./Allocation";
import { Goal } from "./Goal";
import { MovingAverages } from "./MovingAverages";
import { Rsi } from "./Rsi";
import { LiveChart } from "./LiveChart";
import { RiskQuiz } from "./RiskQuiz";
import { EmergencyFund } from "./EmergencyFund";
import "./widgets.css";

export const WIDGET_META: Record<WidgetId, { title: string; blurb: string; lesson: string }> = {
  "emergency-fund": { title: "Emergency fund", blurb: "How much cash to keep aside before you invest a single dollar.", lesson: "before-you-invest" },
  "risk-quiz": { title: "Risk profile quiz", blurb: "Six questions that suggest a starting mix of stocks, bonds and cash.", lesson: "risk-and-return" },
  goal: { title: "Goal planner", blurb: "How much to save each month to reach a target by a chosen year.", lesson: "goals-and-horizon" },
  compound: { title: "Compound growth", blurb: "Watch a monthly habit turn into a pot where most of the money is growth.", lesson: "compounding" },
  "rule-72": { title: "Rule of 72", blurb: "How many years it takes money to double at a given return.", lesson: "compounding" },
  dca: { title: "Monthly investing replay", blurb: "Replay a fixed monthly purchase on real price history.", lesson: "dollar-cost-averaging" },
  allocation: { title: "Portfolio mix", blurb: "See how the stock, bond and cash split changes return and swings.", lesson: "diversification" },
  "position-size": { title: "Position size", blurb: "Decide how much of one holding you can own before you buy it.", lesson: "position-sizing" },
  "fee-drag": { title: "Fee drag", blurb: "What a 1% higher yearly fee really costs over decades.", lesson: "fees" },
  inflation: { title: "Inflation", blurb: "What today's money will buy in the future if it just sits there.", lesson: "inflation-and-cash" },
  currency: { title: "Currency exposure", blurb: "Live GEL, USD, EUR and GBP conversion and what a lari move does to your investments.", lesson: "global-investing" },
  dividend: { title: "Dividend income", blurb: "How reinvested dividends snowball into a growing income stream.", lesson: "dividends" },
  drawdown: { title: "Recovery maths", blurb: "Why a 50% fall needs a 100% gain to get back to zero.", lesson: "drawdowns" },
  volatility: { title: "Volatility in dollars", blurb: "Turn a volatility percentage into the swing you will actually feel.", lesson: "volatility" },
  pe: { title: "P/E explorer", blurb: "Price divided by earnings, and what the answer does and does not mean.", lesson: "valuation" },
  "live-chart": { title: "Chart reader", blurb: "Live prices for any ticker over any period, with the key numbers pulled out.", lesson: "reading-a-chart" },
  "moving-averages": { title: "Moving averages", blurb: "Live 50-day and 200-day trend lines on a ticker of your choice.", lesson: "moving-averages" },
  rsi: { title: "RSI reader", blurb: "Live 14-day momentum with oversold and overbought lines.", lesson: "rsi" },
};

export const WIDGET_IDS: WidgetId[] = [
  "emergency-fund",
  "risk-quiz",
  "goal",
  "compound",
  "rule-72",
  "dca",
  "allocation",
  "position-size",
  "fee-drag",
  "inflation",
  "currency",
  "dividend",
  "drawdown",
  "volatility",
  "pe",
  "live-chart",
  "moving-averages",
  "rsi",
];

export function Widget({ widget, props = {} }: { widget: WidgetId; props?: Record<string, unknown> }) {
  const p = props as any;
  switch (widget) {
    case "compound":
      return <Compound {...p} />;
    case "rule-72":
      return <Rule72 {...p} />;
    case "dca":
      return <Dca {...p} />;
    case "position-size":
      return <PositionSize {...p} />;
    case "fee-drag":
      return <FeeDrag {...p} />;
    case "inflation":
      return <Inflation {...p} />;
    case "pe":
      return <Pe {...p} />;
    case "dividend":
      return <Dividend {...p} />;
    case "drawdown":
      return <Drawdown {...p} />;
    case "volatility":
      return <Volatility {...p} />;
    case "currency":
      return <Currency {...p} />;
    case "allocation":
      return <Allocation {...p} />;
    case "goal":
      return <Goal {...p} />;
    case "moving-averages":
      return <MovingAverages {...p} />;
    case "rsi":
      return <Rsi {...p} />;
    case "live-chart":
      return <LiveChart {...p} />;
    case "risk-quiz":
      return <RiskQuiz />;
    case "emergency-fund":
      return <EmergencyFund {...p} />;
    default:
      return null;
  }
}
