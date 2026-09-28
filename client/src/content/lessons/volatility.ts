import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "volatility",
  module: "numbers",
  title: "Volatility: how bumpy is the ride?",
  subtitle: "One number that tells you how big the swings will be, so you can size your positions before the swings arrive.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "Two investments can have the same average return and feel completely different to hold. One drifts up a fraction of a percent most days. The other jumps 6% on Monday and drops 5% on Tuesday. **Volatility** is the number that captures the difference. It measures how widely returns scatter around their average.",
    },
    { type: "h2", text: "Standard deviation in plain words" },
    {
      type: "p",
      text: "Take every daily return over a period. Find their average. Then measure how far each day typically strays from that average. That typical distance is the **standard deviation**. Small standard deviation means days cluster tightly around the average; large means they are all over the place.",
    },
    {
      type: "p",
      text: "Statisticians usually quote volatility **annualised**: scaled up to a one-year figure so different assets can be compared. When you read \"volatility 18%\", it means that over a year, the return typically lands within about 18 percentage points of its average. Roughly two years in three fall inside that band; one year in three falls outside it.",
    },
    { type: "h2", text: "From yearly to monthly: the square-root rule" },
    {
      type: "p",
      text: "You do not feel volatility yearly. You feel it when you open the app. To turn an annual figure into a typical monthly swing, divide by the square root of 12, which is about 3.46.",
    },
    {
      type: "example",
      title: "What 18% volatility feels like each month",
      steps: [
        "Annualised volatility: 18%.",
        "Typical monthly swing = 18% ÷ √12 = 18 ÷ 3.46 ≈ 5.2%.",
        "On a $10,000 holding, a typical month moves about 10,000 × 0.052 = $520 up or down.",
        "For a daily figure, divide by √252 (about 15.9): 18 ÷ 15.9 ≈ 1.1% a day, or about $110.",
      ],
      result: "A world index fund at 18% volatility will show you roughly ±$500 months on $10,000. If that number makes you want to sell, the position is too big for you.",
    },
    {
      type: "table",
      headers: ["Annual volatility", "Bearings label", "Typical monthly swing", "Typical example"],
      rows: [
        ["Under 15%", "Calm", "Under 4%", "Bond funds, utilities"],
        ["15% to 30%", "Normal", "4% to 9%", "World index funds, large companies"],
        ["30% to 60%", "Bumpy", "9% to 17%", "Small or fast-growing companies"],
        ["Over 60%", "Wild", "Over 17%", "Bitcoin, meme stocks"],
      ],
      caption: "These bands are rules of thumb. They are the ones the Bearings risk signal uses.",
    },
    { type: "h2", text: "Beta: volatility relative to the market" },
    {
      type: "p",
      text: "**Beta** compares an asset's swings with the whole market's. A beta of 1 means it moves with the market. A beta of 1.5 means when the market moves 10%, this tends to move 15%. A beta of 0.6 means it dampens the market's moves. Beta only describes the part of volatility that comes from the market; a company can also have its own private drama that beta ignores.",
    },
    { type: "h2", text: "Volatility is the price of return" },
    {
      type: "p",
      text: "You cannot have the long-term returns of stocks without their volatility. The two are the same thing seen from different angles: prices swing because the future is uncertain, and you are paid for tolerating that uncertainty. Cash has near-zero volatility and, after [inflation](/learn/inflation-and-cash), near-zero or negative real return. See [risk and return](/learn/risk-and-return).",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Size positions to volatility",
      text: "A useful rule: decide the largest monthly swing you could watch calmly, then work backwards. If $300 a month is your limit and an asset has 70% volatility (about 20% a month), you can hold at most 300 ÷ 0.20 = $1,500 of it. The same $300 limit lets you hold about $5,800 of an 18% fund. This is the maths behind [position sizing](/learn/position-sizing).",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Volatility changes",
      text: "Bearings measures volatility over the last 30 trading days. It rises in scary periods and falls in calm ones. A fund that shows 12% today may show 35% during a crash. Plan for the higher figure, not the calm one.",
    },
    {
      type: "widget",
      widget: "volatility",
      props: { vol: 18, amount: 10000 },
      caption: "Set the volatility to 70% and the amount to what you were thinking of putting into crypto. Look at the typical monthly swing and ask whether you could sleep through it.",
    },
    {
      type: "terms",
      terms: [
        { term: "Volatility", def: "How widely returns scatter around their average, quoted as an annual percentage." },
        { term: "Standard deviation", def: "The statistical measure of typical distance from the average." },
        { term: "Annualised", def: "Scaled to a one-year figure so assets can be compared." },
        { term: "Square-root rule", def: "Monthly volatility ≈ annual ÷ √12; daily ≈ annual ÷ √252." },
        { term: "Beta", def: "How much an asset tends to move for each 1% the whole market moves." },
      ],
    },
  ],
  quiz: [
    {
      q: "A fund has 24% annualised volatility. Roughly what is its typical monthly swing?",
      options: ["2%", "7%", "12%", "24%"],
      answer: 1,
      explain: "24 ÷ √12 = 24 ÷ 3.46 ≈ 6.9%, so about 7% in a typical month.",
    },
    {
      q: "Which Bearings label applies to an asset with 45% annualised volatility?",
      options: ["Calm", "Normal", "Bumpy", "Wild"],
      answer: 2,
      explain: "30% to 60% is the Bumpy band: typical monthly swings of 9% to 17%.",
    },
    {
      q: "A stock has a beta of 1.5. If the market falls 10%, the stock tends to…",
      options: ["Fall about 15%", "Fall about 6.7%", "Rise 15%", "Stay flat"],
      answer: 0,
      explain: "Beta scales the market's move: 10% × 1.5 = 15%. High-beta assets amplify both directions.",
    },
    {
      q: "You can tolerate a $400 typical monthly swing. An asset has 80% annual volatility. Roughly how much of it can you hold?",
      options: ["$400", "$1,700", "$5,000", "$32,000"],
      answer: 1,
      explain: "Monthly volatility ≈ 80 ÷ 3.46 ≈ 23%. 400 ÷ 0.23 ≈ $1,740. Position size follows from your swing tolerance.",
    },
  ],
  takeaways: [
    "Volatility is the typical scatter of returns, quoted as an annual percentage.",
    "Divide by √12 to get the monthly swing you will actually feel: 18% a year is about 5% a month.",
    "Under 15% is calm, 15% to 30% normal, 30% to 60% bumpy, over 60% wild.",
    "Decide the swing you can stomach in dollars, then size the position to it. Never the other way round.",
  ],
};
