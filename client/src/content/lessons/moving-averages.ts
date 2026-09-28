import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "moving-averages",
  module: "numbers",
  title: "Moving averages: the trend line",
  subtitle: "A slow line that smooths out the noise and tells you which way the tide has been running.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "Daily prices jump around for a thousand reasons that will not matter next month. A **moving average** quietly ignores most of that. It takes the average of the last N closing prices and plots that instead, redrawing the average each day as the window moves forward. The result is a smooth line that shows the underlying direction.",
    },
    { type: "h2", text: "How the average is built" },
    {
      type: "example",
      title: "A five-day simple moving average",
      steps: [
        "Closing prices for five days: $100, $102, $101, $105, $107.",
        "Add them: 100 + 102 + 101 + 105 + 107 = 515.",
        "Divide by 5: 515 ÷ 5 = $103.",
        "The next day closes at $110. Drop the oldest ($100), add the newest ($110): 102 + 101 + 105 + 107 + 110 = 525.",
        "525 ÷ 5 = $105. The average moved up by $2 even though the price jumped $3.",
      ],
      result: "The average follows the price but more slowly. That lag is the whole point: it filters out one-day excitement.",
    },
    {
      type: "p",
      text: "This is a **simple moving average** (SMA). There are fancier versions that weight recent days more heavily, but the simple kind is what most investors watch and what Bearings draws on every chart.",
    },
    { type: "h2", text: "The two lines everyone watches" },
    {
      type: "p",
      text: "The **50-day average** summarises roughly the last two and a half months. The **200-day average** summarises roughly the last ten months of trading, close to a year. When the price is above its 200-day average, the long march has been upward. When it is below, the past year has, on balance, been a decline.",
    },
    {
      type: "p",
      text: "Bearings also measures **how far** the price is from its 200-day line as a percentage. Price 5% above the line is a normal healthy uptrend. Price 25% or more above it is what the app calls **stretched**: a lot of optimism is already in the price, and pauses or pullbacks are common from there. It is not a sell signal; it is a reason to be patient about adding extra money.",
    },
    {
      type: "example",
      title: "Percent from the 200-day",
      steps: [
        "Price today: $250. The 200-day average: $200.",
        "250 ÷ 200 = 1.25.",
        "1.25 − 1 = 0.25, which is 25% above the average.",
      ],
      result: "At 25% above its trend line, this stock would be flagged as stretched. Your monthly contribution still goes in; extra money can wait.",
    },
    { type: "h2", text: "Golden cross and death cross" },
    {
      type: "p",
      text: "When the 50-day average rises above the 200-day average, traders call it a **golden cross**: recent months have been stronger than the past year. When it falls below, it is a **death cross**. Dramatic names for something quite dull: both are **lagging** signals, because both averages describe the past. By the time a golden cross prints, a good part of the move has usually already happened.",
    },
    {
      type: "table",
      headers: ["Signal", "What happened", "What it does not mean"],
      rows: [
        ["Golden cross", "50-day crossed above 200-day", "That prices will keep rising"],
        ["Death cross", "50-day crossed below 200-day", "That a crash is coming"],
        ["Price above 200-day", "Past year mostly up", "That today is a good price"],
        ["Price below 200-day", "Past year mostly down", "That something is broken"],
      ],
      caption: "Averages describe the tide that has already come in.",
    },
    { type: "h2", text: "Funds and single stocks read differently" },
    {
      type: "p",
      text: "For a broad [index fund](/learn/index-funds), dropping below the 200-day average is mostly good news for a monthly investor: the whole market is on sale, you get more units for the same money, and the whole market has always recovered eventually. Bearings treats this as a mild opportunity for funds.",
    },
    {
      type: "p",
      text: "For a single company, the same signal deserves homework. One business can decline for years or forever, so a downtrend may reflect real problems, not mood. Bearings treats it as a caution for single stocks and asks you to read the news and the [numbers](/learn/valuation) before adding.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "How a long-term investor uses this",
      text: "You do not trade crosses. You use the 200-day line as a mood gauge: above and near it is calm, far above is a time for patience, and below it (for funds) is a time to be glad your monthly plan is buying cheaper. See [dollar-cost averaging](/learn/dollar-cost-averaging).",
    },
    {
      type: "widget",
      widget: "moving-averages",
      props: { symbol: "MSFT" },
      caption: "Look at the live 50- and 200-day lines. Find the last cross and check how much of the move had already happened by then. Try a fund like VWCE.DE too.",
    },
    {
      type: "terms",
      terms: [
        { term: "Simple moving average", def: "The average of the last N closing prices, recalculated daily." },
        { term: "50-day / 200-day", def: "Averages covering roughly two and a half months and roughly ten months of trading." },
        { term: "Golden cross", def: "The 50-day average crossing above the 200-day average." },
        { term: "Death cross", def: "The 50-day average crossing below the 200-day average." },
        { term: "Lagging indicator", def: "A signal built from past data that confirms a move after it has happened." },
        { term: "Stretched", def: "Bearings' word for a price more than 25% above its 200-day average." },
      ],
    },
  ],
  quiz: [
    {
      q: "Closing prices over five days are $20, $22, $21, $24, $23. What is the five-day simple moving average?",
      options: ["$21", "$22", "$23", "$24"],
      answer: 1,
      explain: "20 + 22 + 21 + 24 + 23 = 110. 110 ÷ 5 = $22.",
    },
    {
      q: "A price of $120 with a 200-day average of $100 is how far above its trend line?",
      options: ["10%", "16.7%", "20%", "25%"],
      answer: 2,
      explain: "120 ÷ 100 = 1.20, so the price is 20% above the average.",
    },
    {
      q: "Why is a golden cross called a lagging signal?",
      options: [
        "Because it appears before prices move",
        "Because both averages are built from past prices, so it confirms a move that already happened",
        "Because it only works on gold",
        "Because it is calculated once a year",
      ],
      answer: 1,
      explain: "Moving averages summarise history. By the time the 50-day overtakes the 200-day, much of the rise is already in the past.",
    },
    {
      q: "A broad world index fund drops below its 200-day average. For a monthly investor, Bearings treats this as…",
      options: ["A signal to sell everything", "A mild opportunity: the market is cheaper", "Proof the fund is broken", "Irrelevant to funds"],
      answer: 1,
      explain: "For a diversified fund, being below trend mostly means buying more units for the same money. The whole market has always recovered eventually.",
    },
  ],
  takeaways: [
    "A moving average is the average of the last N closes. It smooths noise and lags on purpose.",
    "Price above the 200-day line means the past year was mostly up; far above (25%+) means stretched, so be patient with extra money.",
    "Golden and death crosses are lagging confirmations, not predictions.",
    "Below the 200-day is a discount for broad funds and a homework assignment for single stocks.",
  ],
};
