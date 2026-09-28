import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "fees",
  module: "plan",
  title: "Fees: the silent thief",
  subtitle: "Where costs hide, why one percent is not small, and how to keep almost all of your return.",
  minutes: 8,
  blocks: [
    {
      type: "p",
      text: "Fees are the only part of investing you control completely. You cannot choose next year's return, but you can choose whether to pay 0.2% or 1.5% for it, and that choice, repeated for decades, is worth more than almost any clever decision you will ever make.",
    },
    { type: "h2", text: "Why 1% is not small" },
    {
      type: "p",
      text: "A 1.5% fee sounds like a rounding error. But it is charged every year on your whole pot, including the growth, so it [compounds](/learn/compounding) against you. And it is not 1.5% of your return; if the market makes 7%, a 1.5% fee is more than a fifth of everything you earned.",
    },
    {
      type: "example",
      title: "200 USD a month for 30 years, two funds",
      steps: [
        "The market returns 7% a year before fees in both cases.",
        "Fund A charges 0.2%, so you keep 6.8%. Fund B charges 1.5%, so you keep 5.5%.",
        "Fund A after 30 years (monthly compounding): about 235,000 USD.",
        "Fund B after 30 years: about 183,000 USD.",
        "Total contributed in both: 200 × 12 × 30 = 72,000 USD.",
        "Difference: 235,000 − 183,000 = 52,000 USD.",
      ],
      result: "The same contributions, the same market. Fund B quietly handed about 52,000 USD to the fund company, roughly 22% of what Fund A ended with. Nobody sent a bill; it just never appeared.",
    },
    {
      type: "widget",
      widget: "fee-drag",
      props: { initial: 0, monthly: 200, years: 30, rate: 7, feeA: 0.2, feeB: 1.5 },
      caption: "Set fee B to 2.5%, the level of many bank-sold funds, and watch the gap. Then set both to 0.1% and 0.3% to see that small differences still matter.",
    },
    { type: "h2", text: "Where fees hide" },
    {
      type: "terms",
      terms: [
        { term: "TER (total expense ratio)", def: "The fund's yearly running cost, deducted from the fund daily. Shown on the factsheet. Under 0.25% is good for a broad ETF." },
        { term: "Commission", def: "A fixed or percentage fee your broker charges per trade. Some brokers charge zero for ETFs; others charge several USD or EUR." },
        { term: "Spread", def: "The gap between the buy and sell price at any moment. Tiny for large ETFs, wider for small or exotic ones." },
        { term: "Currency conversion fee", def: "What your bank or broker charges to turn GEL into USD or EUR. Often 0.5% to 2%, and easy to overlook." },
        { term: "Custody or inactivity fee", def: "A monthly or yearly charge simply for having an account. Avoid brokers that charge these unless the trade-off is clearly worth it." },
        { term: "Entry / exit load", def: "A percentage charged when buying or selling some mutual funds. Almost never worth paying; ETFs do not have them." },
      ],
    },
    { type: "h2", text: "Small purchases and fixed fees" },
    {
      type: "p",
      text: "A fixed commission hurts small trades most. Two USD on a 2,000 USD purchase is 0.1%, invisible. Two USD on a 50 USD purchase is 4%, a disaster if repeated every month.",
    },
    {
      type: "example",
      title: "Choosing how often to buy",
      steps: [
        "Your broker charges 2 USD per ETF trade. You want to invest 60 USD a month.",
        "Monthly: 2 ÷ 60 = 3.3% lost to fees on every purchase.",
        "Every three months: 2 ÷ 180 = 1.1%.",
        "Every six months: 2 ÷ 360 = 0.56%.",
      ],
      result: "Aim to keep the commission under about 0.5% of each purchase. Here that means buying twice a year, or switching to a broker with free ETF purchases and buying monthly.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Read the TER before anything else",
      text: "Every fund factsheet lists its TER (sometimes called \"ongoing charges\"). Search the fund's name plus \"factsheet\" or look it up on the provider's site. If a broad index fund charges more than about 0.4%, a cheaper one tracking the same index almost certainly exists.",
    },
    { type: "h2", text: "The hidden cost of activity" },
    {
      type: "p",
      text: "Every trade costs something: a commission, a spread, sometimes tax on a gain. Someone who trades in and out of positions ten times a year pays those ten times, on top of usually buying high and selling low. Studies of individual traders consistently find that the most active ones earn the least. The cheapest portfolio is the one you barely touch.",
    },
    {
      type: "p",
      text: "This is another argument for [dollar-cost averaging](/learn/dollar-cost-averaging) into one or two funds: a handful of identical purchases a year, no selling, minimal fees, minimal temptation.",
    },
    { type: "h2", text: "A fee checklist" },
    {
      type: "list",
      items: [
        "Fund TER under 0.25% for a broad index ETF.",
        "Broker commission zero, or under 0.5% of each purchase after adjusting how often you buy.",
        "No custody, inactivity or platform percentage fees, or ones so small they are irrelevant.",
        "Currency conversion under about 0.5%, or converted in larger batches to reduce the number of conversions.",
        "No entry or exit loads, no \"performance fees\", no advisers charging a percentage of your money for putting it in a fund you could buy yourself.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Bank-sold funds",
      text: "Funds offered over the counter by banks often carry TERs of 1.5% to 2.5% plus entry loads, and are frequently just expensive wrappers around the same indexes you can buy for 0.2%. Politeness is not a reason to pay 22% of your retirement to your bank.",
    },
  ],
  quiz: [
    {
      q: "The market returns 7% and your fund charges 1.5% a year. What share of your return goes to fees?",
      options: ["About 1.5%", "About 5%", "About 21%", "About 50%"],
      answer: 2,
      explain: "1.5 ÷ 7 ≈ 0.21, so more than a fifth of everything the market earned for you.",
    },
    {
      q: "Investing 200 USD a month for 30 years at 7% before fees, roughly how much more does a 0.2% fund leave you than a 1.5% fund?",
      options: ["About 500 USD", "About 5,000 USD", "About 52,000 USD", "About 200,000 USD"],
      answer: 2,
      explain: "About 235,000 versus about 183,000 USD, a gap of roughly 52,000 from the fee difference alone.",
    },
    {
      q: "Your broker charges a fixed 2 USD per trade and you invest 60 USD a month. What keeps the fee under 0.5% of each purchase?",
      options: [
        "Buying every month as planned",
        "Buying every six months (360 USD per purchase)",
        "Buying twice a month",
        "Buying a more expensive fund",
      ],
      answer: 1,
      explain: "2 ÷ 360 ≈ 0.56%, close to the target. Monthly would be 3.3%. Or switch to a broker with free ETF purchases.",
    },
    {
      q: "Where do you find a fund's yearly running cost?",
      options: [
        "It is not published",
        "In the factsheet, listed as TER or ongoing charges",
        "Only by asking a financial adviser",
        "On the stock exchange's website only",
      ],
      answer: 1,
      explain: "Every fund publishes a factsheet with the TER. It is the first number to check.",
    },
  ],
  takeaways: [
    "Fees compound against you. 1.5% a year can cost a fifth or more of your final pot.",
    "Know the TER, the commission, the spread, the conversion fee and any account charges.",
    "Keep commissions under about 0.5% of each purchase by adjusting how often you buy or by choosing a cheaper broker.",
    "The cheapest strategy is a broad fund you rarely touch. Activity is a cost.",
  ],
};
