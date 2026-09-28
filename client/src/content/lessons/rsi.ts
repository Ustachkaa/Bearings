import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "rsi",
  module: "numbers",
  title: "RSI: measuring the mood",
  subtitle: "A 0 to 100 gauge of whether buyers or sellers have been winning lately.",
  minutes: 8,
  blocks: [
    {
      type: "p",
      text: "Prices move in bursts. Sometimes buyers pile in for weeks and the price runs far ahead of itself. Sometimes sellers panic and dump everything. The **Relative Strength Index** (RSI) is a simple thermometer for those bursts. It tells you how hot or cold the recent trading has been, on a scale from 0 to 100.",
    },
    { type: "h2", text: "What the number means" },
    {
      type: "p",
      text: "RSI looks at the last 14 trading days (the standard setting) and compares the size of the up days with the size of the down days. If nearly every day was an up day, RSI heads toward 100. If nearly every day was a down day, it heads toward 0. A balanced mix lands around 50.",
    },
    {
      type: "table",
      headers: ["RSI reading", "Name", "Plain meaning"],
      rows: [
        ["Above 70", "Overbought", "Buyers have been frantic; you would be paying after a rush"],
        ["30 to 70", "Neutral", "Nothing unusual about recent mood"],
        ["Below 30", "Oversold", "Sellers have been intense; a bounce often follows"],
      ],
      caption: "The 30 and 70 lines are conventions, not physics.",
    },
    { type: "h2", text: "A simplified worked example" },
    {
      type: "p",
      text: "The real formula uses a smoothing method over 14 days, but the idea is easy to see with a short version. Take the average gain on up days and the average loss on down days, then compare them.",
    },
    {
      type: "example",
      title: "Average gains versus average losses",
      steps: [
        "Over 14 days, the price rose on 10 days by an average of $2, and fell on 4 days by an average of $1.",
        "Average gain per day across all 14 days = (10 × 2) ÷ 14 = 20 ÷ 14 ≈ $1.43.",
        "Average loss per day across all 14 days = (4 × 1) ÷ 14 = 4 ÷ 14 ≈ $0.29.",
        "Relative strength (RS) = 1.43 ÷ 0.29 ≈ 5.",
        "RSI = 100 − 100 ÷ (1 + RS) = 100 − 100 ÷ 6 ≈ 83.",
      ],
      result: "With RS of 5, RSI is about 83: strongly overbought. Buyers have dominated ten of the last fourteen days.",
    },
    {
      type: "p",
      text: "Now flip it: if the price fell on 10 days by $2 and rose on 4 days by $1, the RS becomes about 0.2 and the RSI about 17. Deeply oversold. Same arithmetic, opposite mood.",
    },
    { type: "h2", text: "What RSI is good for" },
    {
      type: "p",
      text: "For a long-term monthly investor, RSI is a **timing nudge for extra contributions**, nothing more. Your regular purchase happens on schedule regardless of RSI. But if you have spare money and the fund you already own shows RSI below 30, that is a friendlier moment to add than a euphoric one at RSI 80. Bearings uses it exactly this way: oversold adds to the opportunity score, overbought adds to caution.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Oversold can stay oversold",
      text: "RSI below 30 does not mean the price must bounce tomorrow. In a serious decline, RSI can sit at 25 for weeks while the price keeps falling. For a single company, oversold plus bad news is not a bargain, it is a trend. Use RSI together with the [200-day trend](/learn/moving-averages) and the [drawdown](/learn/drawdowns), never alone.",
    },
    {
      type: "p",
      text: "Equally, overbought is not a sell signal. Strong assets stay overbought for long stretches during rallies. Selling a good fund because RSI hit 72 is a classic way to miss the best months of a bull market. Overbought simply means: do not chase it with extra money this week.",
    },
    { type: "h2", text: "On crypto it swings harder" },
    {
      type: "p",
      text: "Because [crypto](/learn/crypto) moves so violently, its RSI spends more time at the extremes. Readings above 80 and below 20 are common. The same logic applies, just with more patience: oversold Bitcoin has gone on to get 30% cheaper more than once.",
    },
    {
      type: "widget",
      widget: "rsi",
      props: { symbol: "BTC-USD" },
      caption: "Watch how often Bitcoin's RSI crosses 30 and 70, then check what the price did in the weeks afterwards. Try a calm fund like VWCE.DE for comparison.",
    },
    {
      type: "terms",
      terms: [
        { term: "RSI", def: "Relative Strength Index: a 0 to 100 gauge of recent buying versus selling pressure." },
        { term: "Overbought", def: "RSI above 70: recent trading dominated by buyers." },
        { term: "Oversold", def: "RSI below 30: recent trading dominated by sellers." },
        { term: "Relative strength (RS)", def: "Average gain divided by average loss over the lookback window." },
        { term: "Momentum", def: "The tendency of recent price direction to continue for a while." },
      ],
    },
    {
      type: "callout",
      tone: "key",
      title: "The rule in one line",
      text: "RSI changes when you add extra, never whether you keep your plan. Set an [alert](/alerts) for RSI below 30 on your core fund, and treat it as an invitation, not an order.",
    },
  ],
  quiz: [
    {
      q: "What does an RSI reading of 25 mean?",
      options: ["The price is 25% below its high", "Recent trading has been dominated by sellers (oversold)", "The stock has a P/E of 25", "Buyers have been frantic"],
      answer: 1,
      explain: "Below 30 is oversold: down days have outweighed up days over the last 14 sessions.",
    },
    {
      q: "If average gains are $1.50 and average losses are $1.50, RSI is roughly…",
      options: ["0", "25", "50", "100"],
      answer: 2,
      explain: "RS = 1.5 ÷ 1.5 = 1. RSI = 100 − 100 ÷ (1 + 1) = 100 − 50 = 50. Balanced mood.",
    },
    {
      q: "Your core index fund shows RSI 74. As a long-term monthly investor, what should you do?",
      options: ["Sell everything before it crashes", "Skip this month's contribution", "Keep the regular contribution; do not add extra this week", "Double your contribution"],
      answer: 2,
      explain: "Overbought is not a sell signal and the plan does not change. It only says this is a poor week to chase with extra money.",
    },
    {
      q: "Why is RSI below 30 on a single company not automatically a bargain?",
      options: [
        "Because RSI cannot be calculated for single companies",
        "Because oversold can stay oversold while the business genuinely deteriorates",
        "Because 30 is the overbought line",
        "Because it means the dividend was cut",
      ],
      answer: 1,
      explain: "RSI measures mood, not health. A company in real trouble can stay oversold for weeks while the price keeps falling.",
    },
  ],
  takeaways: [
    "RSI runs from 0 to 100 and compares recent up days with recent down days over 14 sessions.",
    "Below 30 is oversold and above 70 is overbought. These are conventions, not commands.",
    "For a monthly investor RSI only affects extra contributions; the plan continues regardless.",
    "Never read RSI alone. Pair it with the 200-day trend and the drawdown from the high.",
  ],
};
