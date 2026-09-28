import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "drawdowns",
  module: "numbers",
  title: "Drawdowns: how far from the top?",
  subtitle: "Every investment falls from its peak sometimes. Knowing the names and the recovery maths turns fear into arithmetic.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "A **drawdown** is the distance between the current price and the highest price it has reached, usually measured over the past year. It is the number that describes how much pain a holder who bought at the top is feeling right now. It is also, for a patient buyer, a measure of how much of a discount is on offer.",
    },
    { type: "h2", text: "The formula" },
    {
      type: "example",
      title: "Drawdown from the 52-week high",
      steps: [
        "A fund's highest close in the past year was $500.",
        "Today it closes at $425.",
        "Drawdown = 425 ÷ 500 − 1 = 0.85 − 1 = −0.15.",
        "That is −15%: the fund is 15% below its 52-week high.",
      ],
      result: "Bearings shows this number on every asset. A drawdown of −15% is a correction, which is normal weather.",
    },
    { type: "h2", text: "The names for different sizes" },
    {
      type: "table",
      headers: ["Fall from peak", "Name", "How often (broad US market, roughly)"],
      rows: [
        ["5% to 10%", "Pullback", "Several times a year"],
        ["10% to 20%", "Correction", "About once a year"],
        ["20% or more", "Bear market", "Every 4 to 7 years"],
        ["Over 40%", "Crash", "A few times per lifetime"],
      ],
      caption: "Corrections are not rare events. They are the normal cost of owning stocks.",
    },
    {
      type: "p",
      text: "Read that middle column again: a 10% drop happens in **most years**. If you invest for thirty years you will live through perhaps twenty-five corrections and five or six bear markets. Anyone who tells you they can avoid them all is [selling something](/learn/scams-and-red-flags).",
    },
    { type: "h2", text: "Recovery maths: the asymmetry that matters" },
    {
      type: "p",
      text: "Losses and gains are not symmetric. If you lose 50%, you do not need a 50% gain to get back to even. You need 100%. The bigger the fall, the disproportionately bigger the climb back.",
    },
    {
      type: "example",
      title: "Why −50% needs +100%",
      steps: [
        "Start with $1,000. It falls 50% to $500.",
        "To return to $1,000 you need to gain $500 on a base of $500.",
        "500 ÷ 500 = 1.00, which is a 100% gain.",
        "General rule: required gain = 1 ÷ (1 − loss) − 1. For a 20% loss: 1 ÷ 0.8 − 1 = 0.25, so +25%.",
      ],
      result: "Small falls are cheap to recover from. Large falls in a single holding can take a decade, or never.",
    },
    {
      type: "table",
      headers: ["Loss", "Gain needed to break even"],
      rows: [
        ["−10%", "+11%"],
        ["−20%", "+25%"],
        ["−33%", "+50%"],
        ["−50%", "+100%"],
        ["−75%", "+300%"],
      ],
      caption: "This table is the strongest argument for diversification and against concentrated bets.",
    },
    { type: "h2", text: "Funds recover. Companies might not." },
    {
      type: "p",
      text: "A broad [index fund](/learn/index-funds) owns hundreds of businesses. When the whole market falls 30%, it is because everything got cheaper at once, and history shows the whole market has always eventually made new highs, because economies grow and failing companies are replaced by rising ones inside the index. For a fund, a bear market is a **temporary** drawdown, and the deep ones have been the best buying moments of each decade.",
    },
    {
      type: "p",
      text: "A single company is different. When one business falls 60%, it may be because its product became obsolete or its accounts were false. That drawdown can be **permanent**. This is why Bearings treats a 40%+ fall as an opportunity for a diversified fund and as a caution for a single stock. Same number, different meaning.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "How a long-term investor uses drawdowns",
      text: "Set a dip alert on your core fund for −10% or −15%. When it fires, that is your cue to consider an extra contribution on top of your monthly plan. You are not predicting the bottom; you are simply buying more when things are cheaper than they were.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "The catching-knives problem",
      text: "\"It is down 40%, it must be cheap\" is how people lose the most money on single stocks. Down 40% can become down 80%, and −80% needs +400% to recover. For individual companies, a big drawdown is a reason to research, never a reason on its own to buy. See [behavioural traps](/learn/behavioural-traps).",
    },
    {
      type: "widget",
      widget: "drawdown",
      props: { drop: 30 },
      caption: "Slide the loss from 10% to 80% and watch the required recovery climb. Notice how quickly it gets out of hand.",
    },
    {
      type: "terms",
      terms: [
        { term: "Drawdown", def: "Current price divided by the peak price, minus one. How far below the top you are." },
        { term: "52-week high", def: "The highest price in the past year, the usual reference for drawdown." },
        { term: "Correction", def: "A fall of 10% to 20% from the peak." },
        { term: "Bear market", def: "A fall of 20% or more from the peak." },
        { term: "Maximum drawdown", def: "The worst peak-to-trough fall over a period. A measure of how bad it has ever got." },
      ],
    },
  ],
  quiz: [
    {
      q: "A fund's 52-week high was $200 and it now trades at $170. What is the drawdown?",
      options: ["−30%", "−17.6%", "−15%", "−10%"],
      answer: 2,
      explain: "170 ÷ 200 = 0.85. 0.85 − 1 = −0.15, so −15%.",
    },
    {
      q: "An investment falls 25%. What gain is needed to get back to where it started?",
      options: ["+25%", "+33%", "+50%", "+75%"],
      answer: 1,
      explain: "1 ÷ (1 − 0.25) = 1 ÷ 0.75 = 1.333. That is a 33% gain. Losses need bigger gains to undo.",
    },
    {
      q: "How often has the broad US stock market historically had a 10%+ correction?",
      options: ["Once a decade", "About once a year", "Never since 1990", "Every month"],
      answer: 1,
      explain: "Corrections of 10% or more have occurred in most years. They are the normal cost of owning stocks.",
    },
    {
      q: "Why does Bearings treat a 40% drawdown differently for a world index fund than for a single company?",
      options: [
        "Because funds are not allowed to fall that far",
        "Because the whole market has always recovered, while a single company's fall can be permanent",
        "Because single companies always recover faster",
        "Because drawdown cannot be calculated for funds",
      ],
      answer: 1,
      explain: "A diversified fund's drawdown reflects a temporary repricing of everything. A single business can decline for a real, lasting reason.",
    },
  ],
  takeaways: [
    "Drawdown = current price ÷ peak price − 1. A 10% to 20% fall is a correction and happens most years.",
    "Losses need bigger gains to undo: −20% needs +25%, −50% needs +100%.",
    "For broad funds, deep drawdowns have historically been the best times to keep buying.",
    "For single companies, a big drawdown may be permanent. Research first, never buy just because it fell.",
  ],
};
