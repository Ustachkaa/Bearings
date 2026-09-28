import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "position-sizing",
  module: "mindset",
  title: "Position sizing: how much to buy",
  subtitle: "Being right about what to buy matters less than being right about how much. Sizing is where risk is actually controlled.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "Two investors buy the same stock and it falls 60%. One shrugs; the other cannot sleep and sells at the bottom. The difference is not knowledge or courage. It is that the first one held 3% of their portfolio in it and the second held 40%. **Position sizing** is the decision about how big each holding is, and it is the single most powerful risk control you have.",
    },
    { type: "h2", text: "Think in percentages, not dollars" },
    {
      type: "p",
      text: "Every holding should be described as a percentage of your whole portfolio. \"$2,000 of Apple\" means nothing on its own. \"Apple is 4% of my portfolio\" tells you exactly how much damage it can do: if Apple went to zero, you would lose 4%. Painful, survivable, and recovered by a normal year.",
    },
    {
      type: "table",
      headers: ["Holding type", "Rule of thumb", "Why"],
      rows: [
        ["Broad world or regional index fund", "Up to 100% of the stock portion", "It is already hundreds of companies"],
        ["Sector or theme fund", "Up to 10% each", "Concentrated in one story"],
        ["Single company", "Under 5% each", "One business can go to zero"],
        ["Crypto", "0% to 5% in total", "Extreme volatility, no cash flows"],
      ],
      caption: "These are the limits Bearings uses when it says \"keep it small\".",
    },
    { type: "h2", text: "Core and satellite" },
    {
      type: "p",
      text: "A simple structure that keeps sizing honest: a **core** of 80% to 90% in one or two broad, low-cost [index funds](/learn/index-funds), and a **satellite** of 10% to 20% for anything more adventurous, such as individual companies or a little [crypto](/learn/crypto). The core does the heavy lifting for decades. The satellite is where you learn, and where your mistakes are affordable.",
    },
    {
      type: "example",
      title: "Sizing a $20,000 portfolio",
      steps: [
        "Core: 85% in a world index fund = 20,000 × 0.85 = $17,000.",
        "Satellite: 15% = $3,000 for everything else.",
        "Single stock rule: 5% maximum = 20,000 × 0.05 = $1,000 each, so at most three single companies fill the satellite.",
        "You want to buy a stock at $80. 1,000 ÷ 80 = 12.5, so 12 shares.",
        "If that stock falls 50%, you lose $480, which is 2.4% of the portfolio. Annoying, not dangerous.",
      ],
      result: "Twelve shares, decided in advance. The size protects you from being wrong, which everyone is sometimes.",
    },
    {
      type: "widget",
      widget: "position-size",
      props: { portfolio: 20000, riskPct: 5 },
      caption: "Put in your real numbers. Then set the risk to 20% and look at what a 50% fall would do. That is why the rule exists.",
    },
    { type: "h2", text: "Sizing by volatility" },
    {
      type: "p",
      text: "A wilder asset deserves a smaller slice. If a fund swings 5% a month and a coin swings 20% a month, holding equal amounts of each means the coin dominates your emotional life. A cleaner approach: decide the dollar swing you can tolerate, then divide by each asset's typical monthly move. [Volatility](/learn/volatility) explains the maths.",
    },
    {
      type: "example",
      title: "Same fear, different sizes",
      steps: [
        "You can calmly watch $250 move in a month.",
        "World fund: 18% annual volatility, about 5.2% monthly. 250 ÷ 0.052 ≈ $4,800.",
        "Bitcoin: 70% annual volatility, about 20% monthly. 250 ÷ 0.20 = $1,250.",
      ],
      result: "For the same emotional budget you can hold nearly four times as much of the fund as of the coin.",
    },
    { type: "h2", text: "Rebalancing bands" },
    {
      type: "p",
      text: "Sizes drift. A stock that doubles turns your 5% into 10% without you doing anything. **Rebalancing** means selling some of what grew and buying what shrank to restore the target. Doing it on a calendar (once a year) or by **bands** (act when a holding drifts more than 5 percentage points from target) both work. Bands are stricter; calendars are simpler.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Rebalance with new money first",
      text: "For a monthly investor, the easiest rebalancing is to send this month's contribution to whatever is below target. No selling, no taxable event, no drama. Only sell to rebalance when new money cannot fix the drift.",
    },
    { type: "h2", text: "Adding to winners or losers?" },
    {
      type: "p",
      text: "For broad funds, add to whatever is cheapest relative to target; a dip is a discount. For single companies, be careful about adding to losers. \"Averaging down\" on a company whose thesis is broken is how a 5% position becomes a 15% disaster. Only add to a fallen single stock if your written thesis still holds and the size stays under the limit.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "The rule survives your conviction",
      text: "The moment you are most certain is the moment sizing rules matter most. Every investor who lost everything on one idea was certain. The 5% rule is not a lack of confidence; it is respect for the fact that the future is unknown.",
    },
    {
      type: "terms",
      terms: [
        { term: "Position size", def: "A holding expressed as a percentage of the whole portfolio." },
        { term: "Core and satellite", def: "80% to 90% in broad index funds, the rest for individual ideas." },
        { term: "Rebalancing", def: "Restoring target percentages by selling what grew or buying what shrank." },
        { term: "Rebalancing band", def: "A drift threshold (for example 5 points) that triggers a rebalance." },
        { term: "Averaging down", def: "Buying more of something after its price fell. Fine for funds, dangerous for broken theses." },
      ],
    },
  ],
  quiz: [
    {
      q: "Your portfolio is $15,000 and your single-stock limit is 5%. A share costs $60. What is the most you should buy?",
      options: ["5 shares", "12 shares", "25 shares", "60 shares"],
      answer: 1,
      explain: "5% of 15,000 = $750. 750 ÷ 60 = 12.5, so 12 shares.",
    },
    {
      q: "A single stock at 4% of your portfolio falls 50%. How much of your total portfolio did you lose?",
      options: ["50%", "4%", "2%", "8%"],
      answer: 2,
      explain: "Half of a 4% position is 2% of the whole portfolio. Sizing turns a disaster in one holding into a bad afternoon.",
    },
    {
      q: "In a core-and-satellite structure, roughly what share belongs in broad index funds?",
      options: ["10% to 20%", "50%", "80% to 90%", "0%"],
      answer: 2,
      explain: "The core of 80% to 90% in broad, low-cost funds does the long-term work. The satellite is for learning and individual ideas.",
    },
    {
      q: "What is the simplest way for a monthly investor to rebalance?",
      options: ["Sell everything and start again", "Direct new contributions to whatever is below its target", "Never rebalance", "Buy more of whatever grew the most"],
      answer: 1,
      explain: "Sending new money to the under-weight holding restores targets without selling or creating taxable events.",
    },
  ],
  takeaways: [
    "Describe every holding as a percentage of the whole. That percentage is your maximum possible damage.",
    "Single companies under 5% each, crypto 0% to 5% in total, broad funds as the 80% to 90% core.",
    "Wilder assets get smaller slices: divide your tolerable monthly swing by the asset's typical monthly move.",
    "Rebalance with new money first. Only average down on single stocks if the written thesis still holds.",
  ],
};
