import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "reading-a-chart",
  module: "numbers",
  title: "Reading a price chart",
  subtitle: "A chart is a story about price over time. Learn to read it without being scared by it.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "Every investing app opens with a chart, and most beginners react to it emotionally: a line going up feels safe, a line going down feels like danger. Neither feeling is information. This lesson teaches you what a chart actually shows, what it hides, and which parts of it deserve your attention.",
    },
    { type: "h2", text: "The two axes" },
    {
      type: "p",
      text: "A price chart has **time** running left to right and **price** running bottom to top. Each point on the line is the price at which the last trade happened at that moment. For daily charts, that point is usually the **close**: the last price of the trading day.",
    },
    {
      type: "p",
      text: "The chart does not show value, quality or the future. It shows what buyers and sellers agreed on in the past. A stock at $150 is not \"high\" and a stock at $3 is not \"cheap\". Price only means something when you compare it to what you get for it, which is the job of [valuation](/learn/valuation).",
    },
    { type: "h2", text: "Line charts and candlesticks" },
    {
      type: "p",
      text: "A **line chart** connects closing prices. It is clean and it is all a long-term investor really needs. A **candlestick chart** shows four numbers for each day: the **open** (first trade), the **high**, the **low**, and the **close**. The thick body runs from open to close; thin wicks stretch to the high and low. A green or hollow candle closed above where it opened; a red or filled one closed below.",
    },
    {
      type: "example",
      title: "One candle, four numbers",
      steps: [
        "Apple opens the day at $148.00.",
        "During the day it trades as high as $151.50 and as low as $147.20.",
        "It closes at $150.00.",
        "The candle body runs from $148.00 to $150.00, a rise of $2.00, so it is coloured green.",
        "The upper wick reaches $151.50 and the lower wick reaches $147.20, showing the full day's range of $4.30.",
      ],
      result: "One candle tells you the day was positive but bumpy: the price swung across a $4.30 range before settling $2.00 higher.",
    },
    {
      type: "p",
      text: "Below most charts sits **volume**: bars showing how many shares changed hands. High volume on a big move means many people agreed with the move. A large price jump on tiny volume is easier to reverse. For a monthly investor, volume mostly matters as a sanity check that you are looking at something people actually trade.",
    },
    { type: "h2", text: "Timeframes change the story" },
    {
      type: "p",
      text: "The same company can look like a disaster on a one-week chart and like a triumph on a ten-year chart. **One day tells you about mood. Ten years tells you about the business.** When you zoom in, every wiggle looks like a cliff. When you zoom out, the 2020 crash becomes a small dent in a rising line.",
    },
    {
      type: "table",
      headers: ["Timeframe", "What it mostly shows", "Useful for"],
      rows: [
        ["1 day to 1 week", "News, mood, noise", "Almost nothing for long-term investors"],
        ["1 to 6 months", "Recent trend, pullbacks", "Timing an extra contribution"],
        ["1 to 2 years", "Trend versus the 200-day average", "The Bearings signals"],
        ["10+ years", "Whether the business or market grew", "Deciding what to own at all"],
      ],
      caption: "Zoom out before you decide anything.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "The zoomed-in trap",
      text: "Apps love to show the one-day chart because it moves. A 1.5% drop drawn across your whole screen looks like a collapse. Switch to five years and the same day is invisible. Make five years your default view.",
    },
    { type: "h2", text: "Linear versus log scale" },
    {
      type: "p",
      text: "On a **linear** axis, every $10 takes the same vertical space. On a **logarithmic** (log) axis, every 10% takes the same space. For long histories, log is more honest: a move from $10 to $20 (a doubling) and a move from $100 to $200 (also a doubling) look the same size. On a linear chart the second move looks ten times bigger even though your money grew by the same proportion.",
    },
    { type: "h2", text: "Adjusted close: the price that includes what you were paid" },
    {
      type: "p",
      text: "When a company pays a [dividend](/learn/dividends), its share price drops by roughly that amount on the ex-dividend day, because that cash left the company and went to shareholders. When a company **splits** its stock 4-for-1, the price quarters overnight while you own four times as many shares. Neither event lost you money, but a raw price chart makes both look like drops.",
    },
    {
      type: "p",
      text: "The **adjusted close** fixes this. It rewrites past prices so that dividends and splits are folded in, giving you the true history of what an investor actually earned. Bearings uses adjusted prices for all long-term returns and for the [monthly-investing backtest](/learn/dollar-cost-averaging), and raw closes for short-term indicators like [moving averages](/learn/moving-averages).",
    },
    {
      type: "widget",
      widget: "live-chart",
      props: { symbol: "AAPL", range: "1y" },
      caption: "Switch the range from 1 month to 5 years and notice how the same drops shrink from cliffs to ripples.",
    },
    {
      type: "terms",
      terms: [
        { term: "Close", def: "The last price traded in a session. Most daily charts plot this." },
        { term: "Candlestick", def: "A bar showing open, high, low and close for one period." },
        { term: "Volume", def: "How many shares or units traded in the period." },
        { term: "Log scale", def: "A price axis where equal distances mean equal percentage changes." },
        { term: "Adjusted close", def: "Past prices restated to include dividends and stock splits." },
      ],
    },
    {
      type: "callout",
      tone: "key",
      title: "How to look at a chart as an investor",
      text: "Set the range to five or ten years. Ask one question: has this thing generally grown? Then look at the last two years only to see whether the current price is near the top, in a dip, or somewhere in the middle. That is all a chart can honestly tell you.",
    },
  ],
  quiz: [
    {
      q: "On a daily candlestick, what does the thick body of the candle show?",
      options: ["The high and low of the day", "The open and close prices", "The volume traded", "The 200-day average"],
      answer: 1,
      explain: "The body runs from the opening price to the closing price. The thin wicks show the high and low.",
    },
    {
      q: "A stock paid a $2 dividend and its price dropped from $52 to $50 the next morning. On the adjusted close series, what happens to the previous day's price?",
      options: ["It is left at $52", "It is restated to about $50 so the drop disappears", "It is raised to $54", "It is deleted"],
      answer: 1,
      explain: "Adjusted prices fold the dividend into history so the chart shows what an investor actually earned. Nothing was lost; cash was paid out.",
    },
    {
      q: "Which timeframe is the best default for deciding whether something is worth owning at all?",
      options: ["1 day", "1 week", "3 months", "10 years"],
      answer: 3,
      explain: "Long histories show whether the business or market actually grew. Short timeframes mostly show mood and noise.",
    },
    {
      q: "On a log-scale chart, a rise from $10 to $20 and a rise from $100 to $200 look…",
      options: ["The same height, because both are a doubling", "The second one ten times taller", "The first one taller", "Impossible to compare"],
      answer: 0,
      explain: "Log scale gives equal space to equal percentage changes, so both doublings occupy the same vertical distance.",
    },
  ],
  takeaways: [
    "A chart shows past prices agreed by buyers and sellers. It shows neither value nor the future.",
    "One day tells you about mood; ten years tells you about the business. Make five years your default view.",
    "Use adjusted close for long-term returns so dividends and splits do not look like losses.",
    "Log scale tells the truth about long histories because equal percentages take equal space.",
  ],
};
