import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "using-bearings",
  module: "mindset",
  title: "Using Bearings honestly",
  subtitle: "What this app can tell you, what it cannot, and how to fit its signals into a plan that runs without them.",
  minutes: 9,
  blocks: [
    {
      type: "p",
      text: "Bearings is built by people who believe nobody can predict stock prices, and it is important that you believe it too. Everything in the app describes the **present**: where a price sits relative to its own history, how the mood has been, what you are paying for. None of it forecasts. This lesson explains each feature so you can use it for what it is.",
    },
    { type: "h2", text: "The stance dial" },
    {
      type: "p",
      text: "Every asset in Explore gets one of four stances. They are a composite of the rule-based signals below, added up into a score. They describe whether the **current price** is a friendly or unfriendly moment to add extra money. They never describe where the price is going.",
    },
    {
      type: "table",
      headers: ["Stance", "What the signals added up to", "What a monthly investor does"],
      rows: [
        ["Accumulate", "Discount, calm mood, trend intact: a favourable moment", "Regular contribution plus optional extra"],
        ["Steady", "Nothing special either way", "Regular contribution, ignore the noise"],
        ["Patience", "Price stretched or no discount", "Regular contribution, extra money waits"],
        ["Caution", "Several warning lights", "Regular contribution if it is a fund; understand each flag before adding to a single stock"],
      ],
      caption: "Notice that the regular contribution appears in every row of the last column.",
    },
    {
      type: "callout",
      tone: "key",
      title: "The plan does not read the dial",
      text: "Your monthly transfer happens whatever the stance says. The dial only helps you decide what to do with **extra** money and when to be patient with it. If you ever find yourself skipping a planned contribution because of a stance, you are using the app backwards. See [dollar-cost averaging](/learn/dollar-cost-averaging).",
    },
    { type: "h2", text: "Reading a signal card" },
    {
      type: "p",
      text: "Each signal card has three parts. The **title** names what was seen, for example \"In a correction (−14% from high)\". The **explanation** says in plain words what that usually means and how funds differ from single stocks. The **maths** line shows the exact arithmetic, so you can check it yourself and, over time, do it in your head.",
    },
    {
      type: "example",
      title: "Checking a signal by hand",
      steps: [
        "The card says: 52-week high $500, price $430.",
        "430 ÷ 500 = 0.86.",
        "0.86 − 1 = −0.14, so −14%.",
        "Between −10% and −20% is a correction, which the app scores as a mild opportunity for a fund.",
      ],
      result: "You have just reproduced a Bearings signal. Every signal in the app can be checked this way; the lessons on [drawdowns](/learn/drawdowns), [moving averages](/learn/moving-averages), [RSI](/learn/rsi), [valuation](/learn/valuation) and [volatility](/learn/volatility) cover each one.",
    },
    { type: "h2", text: "The checklist" },
    {
      type: "p",
      text: "Below the signals sits the pre-purchase checklist from [how to think](/learn/how-to-think). Most items are computed for you. One is not: \"You can explain in one sentence how it makes money.\" That one stays unticked on purpose. If you cannot write the sentence, the other seven ticks do not matter.",
    },
    { type: "h2", text: "Alerts: nudges for extra, not commands" },
    {
      type: "p",
      text: "Alerts watch your rules while you live your life: a dip below the 52-week high, an RSI reading, a cross of the 200-day line, or the stance changing. When one fires, it is an invitation to open the app and look, not an instruction to buy or sell. The most useful alert for a beginner is a monthly investing reminder, which has nothing to do with prices at all.",
    },
    {
      type: "list",
      items: [
        "A dip alert on your core fund at −10% or −15% is the classic extra-contribution nudge.",
        "The stance-change alert tells you when the composite moves to Accumulate or Caution.",
        "A big one-day move alert is mostly there to remind you that big moves are normal.",
        "The weekly digest replaces daily checking. One email, once a week, then close the app.",
      ],
    },
    { type: "h2", text: "Range of outcomes: a spread, not a prediction" },
    {
      type: "p",
      text: "The projection tool runs thousands of simulated futures using an assumed average return and [volatility](/learn/volatility), and shows the spread: the middle line is where half the futures ended above and half below. The bands show the range. **The middle line is not a promise.** It is where the middle of a cloud of possibilities happens to be, given assumptions that are themselves guesses. Use it to see how wide the cloud is, not to read off a number you will get.",
    },
    {
      type: "p",
      text: "The DCA backtest replays real history: what a fixed monthly amount into a chosen fund would have become. It is a true story about the past. It is not a story about the future; the next ten years will have their own crashes and rallies in a different order. What it does teach is how much the order of returns matters and how monthly buying smooths it.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Two tempting misreadings",
      text: "\"The median says $87,000, so I will have $87,000.\" No; half the simulated futures ended below that. \"VWCE returned 9% a year for ten years, so it will again.\" No; the next decade could be 4% or 12%. Plan with the low band, hope for the middle, and be pleasantly surprised by the top.",
    },
    { type: "h2", text: "Practice first" },
    {
      type: "p",
      text: "The [practice portfolio](/portfolio) trades with pretend money at real prices. Use it for a few months before you commit real savings. Write a thesis in the note field for every trade, apply your [position sizing](/learn/position-sizing) rule, and then read your notes back after a quarter. You will learn more about yourself from ten pretend trades than from a hundred articles.",
    },
    {
      type: "widget",
      widget: "live-chart",
      props: { symbol: "VWCE.DE", range: "2y" },
      caption: "This is the kind of fund most of the app's advice is built around. Look at two years of it, find the dips, and imagine your monthly buys landing on every one of them.",
    },
    {
      type: "terms",
      terms: [
        { term: "Stance", def: "Bearings' four-level summary of whether the current price is a friendly moment to add." },
        { term: "Signal", def: "One rule-based observation about the present, with its arithmetic shown." },
        { term: "Composite score", def: "The signals' points added together to produce the stance." },
        { term: "Monte Carlo projection", def: "Thousands of simulated futures showing a spread of outcomes, not a forecast." },
        { term: "Backtest", def: "Replaying a strategy on real past prices to see what would have happened." },
      ],
    },
  ],
  quiz: [
    {
      q: "What does the Bearings stance describe?",
      options: ["Where the price will be in six months", "Whether the current price is a friendly moment to add extra money", "Whether you should sell", "The fund's rating from analysts"],
      answer: 1,
      explain: "The stance is a composite of rule-based signals about the present price. It never forecasts.",
    },
    {
      q: "Your core fund shows the Patience stance this month. What happens to your regular monthly contribution?",
      options: ["Skip it until Accumulate appears", "Halve it", "It goes in as planned; only extra money waits", "Move it to cash"],
      answer: 2,
      explain: "The plan never reads the dial. Stances only guide extra contributions and patience with spare money.",
    },
    {
      q: "The projection's middle line ends at $87,000 after 20 years. What does that mean?",
      options: ["You will have $87,000", "Half of the simulated futures ended above that and half below, given the assumptions", "The minimum you can expect", "A guarantee from the app"],
      answer: 1,
      explain: "The median is the middle of a cloud of possibilities built on assumed inputs. Plan with the lower band.",
    },
    {
      q: "A signal card says the 52-week high is $200 and the price is $176. What drawdown should the maths line show?",
      options: ["−24%", "−12%", "−13.6%", "−8%"],
      answer: 1,
      explain: "176 ÷ 200 = 0.88. 0.88 − 1 = −0.12, so −12%: a correction. You can check every signal this way.",
    },
  ],
  takeaways: [
    "Everything in Bearings describes the present price, never the future. The stance is a composite of checkable rules.",
    "Your monthly contribution ignores the dial. Signals and alerts only guide extra money and patience.",
    "The projection shows a spread; the middle line is not a promise. The backtest is true about the past only.",
    "Practice with pretend money first, journal every trade, and read one weekly digest instead of checking daily.",
  ],
};
